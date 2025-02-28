let map;
let vectorSource;
let drawActive = false;
let drawnMarker;
let selectInteraction;
let working = false;
let ifClickedFromQueryTable=false;
function init() {
    vectorSource = new ol.source.Vector();
    let vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({ color: 'red' }),
                stroke: new ol.style.Stroke({ color: 'white', width: 2 })
            })
        })
    });

    let osmLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    map = new ol.Map({
        target: 'map',
        view: new ol.View({
            center: ol.proj.fromLonLat([35, 39]), // Türkiye merkez
            zoom: 6
        }),
        layers: [osmLayer, vectorLayer]
    });

    // Veritabanındaki noktaları yükle
    loadPointsFromDB();

    // "Nokta Ekle" Butonu
    document.getElementById('addPointBtn').addEventListener('click', function() {
        drawActive = true;
        
        map.getViewport().style.cursor = 'crosshair';
    });

    // "queryPointsBtn" Butonu
    document.getElementById('queryPointsBtn').addEventListener('click', function() {
        queryPoints();
    });
    
    
    

    // Haritaya tıklayınca koordinat al
    map.on('click', function(event) {
        
        if (drawActive) {
            working = true;
            let coords = ol.proj.toLonLat(event.coordinate);
            showPanel(coords);
            drawActive = false;
            map.getViewport().style.cursor = 'default';

            // Haritaya nokta ekle
            drawnMarker = new ol.Feature({
                geometry: new ol.geom.Point(event.coordinate)
            });
            vectorSource.addFeature(drawnMarker);
        }
        
    });

    // Noktayı seçmek için etkileşim ekleyin
selectInteraction = new ol.interaction.Select();
map.addInteraction(selectInteraction);


// Bir nokta seçildiğinde
selectInteraction.on('select', function(event) {
    if (event.selected.length > 0) {
        // Update the global selectedFeature variable
        selectedFeature = event.selected[0];
        let coords = ol.proj.toLonLat(selectedFeature.getGeometry().getCoordinates());
        showDetails(coords, selectedFeature);
    } else {
        // Clear the selectedFeature when nothing is selected
        selectedFeature = null;
    }
});
    
}

// Koordinatlar ile jsPanel aç
function showPanel(coords) {
    let panel = jsPanel.create({
        headerTitle: 'Nokta Ekle',
        theme: 'dark',
        contentSize: '320 320',
        content: `
            <form id="pointForm">
                <label>X Koordinati:</label>
                <input type="text" id="xCoord" value="${coords[0]}" disabled>
                <label>Y Koordinati:</label>
                <input type="text" id="yCoord" value="${coords[1]}" disabled>
                <label>Ad:</label>
                <input type="text" id="name" required>
                <div class="form-buttons">
                    <button type="submit" id="saveBtn">Kaydet</button>
                    <button type="button" id="cancelBtn">İptal</button>
                </div>
            </form>
        `,
        onwindowclose: function() {
            drawActive = false;
            map.getViewport().style.cursor = 'default';
        }
    });

    // Kaydet butonuna tıklandığında
    document.getElementById('pointForm').addEventListener('submit', function(event) {
        event.preventDefault();
        let name = document.getElementById('name').value;
        let pointX = document.getElementById('xCoord').value;
        let pointY = document.getElementById('yCoord').value;
        let createdDate = new Date().toISOString();
        fetch('https://localhost:7223/api/point', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, pointX, pointY, createdDate })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Yeni nokta eklendi:', data);
            panel.close();
            loadPointsFromDB();
        })
        .catch(error => console.error('Hata:', error));
        working = false;
    });

    // İptal butonuna tıklandığında
    document.getElementById('cancelBtn').addEventListener('click', function() {
        if (drawnMarker) {
            vectorSource.removeFeature(drawnMarker);
            drawnMarker = null;
        }
        panel.close();
        working = false;
    });
}

// Veritabanındaki noktaları yükleme
function loadPointsFromDB() {
    vectorSource.clear();

    fetch('https://localhost:7223/api/point')
        .then(response => response.json())
        .then(responseData => {
            const points = responseData.value || [];

            console.log(`${points.length} nokta yükleniyor...`);

            points.forEach(point => {
                if (point && typeof point.pointX === 'number' && typeof point.pointY === 'number') {
                    let feature = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([point.pointX, point.pointY])),
                        name: point.name || 'Unnamed Point',
                        id: point.id
                    });

                    vectorSource.addFeature(feature);
                }
            });

        })
        .catch(error => {
            console.error('Veriler yüklenirken hata oluştu:', error);
        });
}

// Seçilen noktanın detaylarını gösteren panel
function showDetails(coords, featureOrPoint) {
    if (!working) {
        let name, id;

        // Check if featureOrPoint is a feature or a point object
        if (featureOrPoint.get) {
            name = featureOrPoint.get('name') || 'Unnamed Point';
            id = featureOrPoint.get('id');
        } else {
            name = featureOrPoint.name || 'Unnamed Point';
            id = featureOrPoint.id;
        }

        let NoktaPanel = jsPanel.create({
            headerTitle: 'Nokta Detayları',
            theme: 'dark',
            contentSize: '320 320',
            content: `
                <p><strong>X Koordinatı:</strong> ${coords[0]}</p>
                <p><strong>Y Koordinatı:</strong> ${coords[1]}</p>
                <p><strong>Ad:</strong> ${name}</p>
                <button id="show-button">Show</button>
                <button id="update-button">Update</button>
                <button id="Delete-button">Delete</button>
            `
        });


        document.getElementById('show-button').addEventListener('click', function() {
            zoomToLocation(coords);
            NoktaPanel.close();
        });

        document.getElementById('update-button').addEventListener('click', function() {
            let updatePanel = jsPanel.create({
                headerTitle: 'Noktayı Güncelle',
                theme: 'dark',
                contentSize: '320 200',
                content: `
                    <form id="updateForm">
                        <label>Yeni Ad:</label>
                        <input type="text" id="updatedName" value="${name}" required>
                        <label>Yeni X Koordinatı:</label>
                        <input type="number" step="any" id="updatedX" value="${coords[0]}" required>
                        <label>Yeni Y Koordinatı:</label>
                        <input type="number" step="any" id="updatedY" value="${coords[1]}" required>
                        <div class="form-buttons">
                            <button type="submit">Kaydet</button>
                            <button id="enableModifyBtn">surukle birak Modu</button>

                            <button type="button" id="cancelUpdateBtn">İptal</button>
                        </div>
                    </form>
                `
            });
            document.getElementById('enableModifyBtn').addEventListener('click', function() {
                enableModifyInteraction();
            });

            document.getElementById('updateForm').addEventListener('submit', function(event) {
                event.preventDefault();
                let newName = document.getElementById('updatedName').value;
                let newX = Number(document.getElementById('updatedX').value); // Çift hassasiyetli
                let newY = Number(document.getElementById('updatedY').value); // Çift hassasiyetli
            
                let updatedPoint = { 
                    name: newName, 
                    pointX: newX, 
                    pointY: newY, 
                    id: id 
                };
            
                fetch(`https://localhost:7223/api/point/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedPoint)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Güncelleme başarısız oldu');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Nokta güncellendi:', data);
                    updatePanel.close();
                    NoktaPanel.close();
                    loadPointsFromDB(); // Harita üzerindeki veriyi güncelle
                })
                .catch(error => console.error('Güncelleme hatası:', error));
            });
        
            // Güncellemeyi iptal etme butonu
            document.getElementById('cancelUpdateBtn').addEventListener('click', function() {
                updatePanel.close();
            });
        });
        

document.getElementById('Delete-button').addEventListener('click', function() {
    if (confirm("Bu noktayı silmek istediğinizden emin misiniz?")) {
        fetch(`https://localhost:7223/api/point/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                console.log('Nokta silindi');
                NoktaPanel.close();
                loadPointsFromDB(); // Harita üzerindeki noktaları güncelle
            } else {
                console.error('Silme işlemi başarısız oldu');
            }
        })
        .catch(error => console.error('Silme hatası:', error));
    }
});


    };}

    // Zoom to the location function
function zoomToLocation(coords) {
    map.getView().animate({
        center: ol.proj.fromLonLat(coords),
        zoom: 10, // Adjust the zoom level as needed
        duration: 1000 // Animation duration in milliseconds
    });
}


function queryPoints() {
    fetch('https://localhost:7223/api/point')
        .then(response => response.json())
        .then(responseData => {
            console.log("API'den gelen veri:", responseData);

            const points = responseData.value || [];
            console.log(`${points.length} nokta listeleniyor...`);

            // Create the table content for the panel
            let content = '<table class="point-table">';
            content += `
                <tr>
                    <th style="color:black">Ad</th>
                    <th>X Koordinati</th>
                    <th>Y Koordinati</th>
                    <th>Select</th>
                </tr>`;
            points.forEach(point => {
                if (point && typeof point.pointX === 'number' && typeof point.pointY === 'number') {
                    content += `
                        <tr>
                            <td>${point.name || 'Unnamed Point'}</td>
                            <td>${point.pointX}</td>
                            <td>${point.pointY}</td>
                            <td><button class="select-button" data-point='${JSON.stringify(point)}'>Select</button></td>
                        </tr>`;
                }
            });
            content += '</table>';

            // Create the jsPanel with the generated content
            const queryPanel = jsPanel.create({
                headerTitle: 'Eklenmiş Noktalar',
                theme: 'dark',
                contentSize: '700 320',
                content: content
            });

            // Add event listeners to the select buttons
queryPanel.content.querySelectorAll('.select-button').forEach(button => {
    button.addEventListener('click', function() {
        const point = JSON.parse(this.getAttribute('data-point'));
        let coords = [point.pointX, point.pointY];
        
        // Find the feature in the vectorSource that corresponds to this point
        let features = vectorSource.getFeatures();
        for (let i = 0; i < features.length; i++) {
            if (features[i].get('id') === point.id) {
                selectedFeature = features[i];
                break;
            }
        }
        
        showDetails(coords, point);
        queryPanel.close();
    });
});
            
        })
        .catch(error => {
            console.error('Veriler listelenirken hata oluştu:', error);
        });
}
let modifyInteraction;
let selectedFeature = null;

function enableModifyInteraction() {
    // Eğer modifyInteraction zaten varsa, onu kaldır
    if (modifyInteraction) {
        map.removeInteraction(modifyInteraction);
    }

    // Eğer seçili bir özellik yoksa, uyarı ver
    if (!selectedFeature) {
        alert("Lütfen bir nokta seçin.");
        return;
    }

    // Original coordinates before modification (for potential restoration)
    const originalCoords = selectedFeature.getGeometry().getCoordinates();
    const featureId = selectedFeature.get('id');
    const featureName = selectedFeature.get('name');
    
    // Set up the modify interaction
    modifyInteraction = new ol.interaction.Modify({
        features: new ol.Collection([selectedFeature])
    });

    // Handle the modification end
    modifyInteraction.on('modifyend', function(event) {
        // Get the new coordinates
        const newCoords = selectedFeature.getGeometry().getCoordinates();
        const newLonLat = ol.proj.toLonLat(newCoords);
        
        if (confirm("Nokta güncellensin mi?")) {
            // User confirmed - update the database
            const updatedPoint = { 
                name: featureName || 'Unnamed Point', 
                pointX: newLonLat[0], 
                pointY: newLonLat[1],
                id: featureId 
            };
            
            fetch(`https://localhost:7223/api/point/${featureId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPoint)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Güncelleme başarısız oldu');
                }
                return response.json();
            })
            .then(data => {
                console.log('Nokta güncellendi:', data);
                // Completely reload all points to ensure consistency
                loadPointsFromDB();
            })
            .catch(error => {
                console.error('Güncelleme hatası:', error);
                // Revert to original position on error
                selectedFeature.getGeometry().setCoordinates(originalCoords);
                loadPointsFromDB();
            });
        } else {
            // User canceled - revert to original position
            selectedFeature.getGeometry().setCoordinates(originalCoords);
            
        }
        
        // Clean up
        map.removeInteraction(modifyInteraction);
        modifyInteraction = null;
    });

    // Add the interaction
    map.addInteraction(modifyInteraction);
}





window.onload = init;
