// main.js - Modüler harita uygulaması

/**
 * Harita uygulamasını yöneten ana sınıf
 */
class MapApplication {
    constructor(config) {
        // Yapılandırma
        this.config = {
            mapTargetId: 'map',
            apiUrl: 'https://localhost:7223/api/point',
            initialCenter: [35, 39], // Türkiye merkezi
            initialZoom: 6,
            ...config
        };

        // Değişkenler
        this.map = null;
        this.vectorSource = null;
        this.vectorLayer = null;
        this.drawInteraction = null;
        this.isDrawActive = false;
        this.currentFeature = null;

        // Bağlayıcılar
        this.initDrawButton = this.initDrawButton.bind(this);
        this.handleDrawEnd = this.handleDrawEnd.bind(this);
        this.savePoint = this.savePoint.bind(this);
        this.cancelPoint = this.cancelPoint.bind(this);
    }

    /**
     * Uygulamayı başlat
     */
    init() {
        this.createMap();
        this.loadPointsFromDB();
        this.initDrawButton();
    }

    /**
     * Haritayı oluştur
     */
    createMap() {
        // Vektör kaynağı ve katmanı
        this.vectorSource = new ol.source.Vector();
        this.vectorLayer = new ol.layer.Vector({
            source: this.vectorSource,
            style: this.createPointStyle()
        });

        // OSM katmanı
        const osmLayer = new ol.layer.Tile({
            source: new ol.source.OSM()
        });

        // Harita oluştur
        this.map = new ol.Map({
            target: this.config.mapTargetId,
            view: new ol.View({
                center: ol.proj.fromLonLat(this.config.initialCenter),
                zoom: this.config.initialZoom
            }),
            layers: [osmLayer, this.vectorLayer]
        });
    }

    /**
     * Nokta stili oluştur
     */
    createPointStyle() {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({ color: 'red' }),
                stroke: new ol.style.Stroke({ color: 'white', width: 2 })
            })
        });
    }

    /**
     * Veritabanından noktaları yükle
     */
    loadPointsFromDB() {
        this.vectorSource.clear();
        
        fetch(this.config.apiUrl)
            .then(response => response.json())
            .then(responseData => {
                console.log("API'den gelen veri:", responseData);
                
                // Extract points from the API response
                const points = responseData.value || [];
                
                console.log(`${points.length} nokta yükleniyor...`);
                
                // Add each point to the map
                points.forEach(point => this.addPointToMap(point));
                
                console.log("Noktalar başarıyla yüklendi.");
            })
            .catch(error => {
                console.error('Veriler yüklenirken hata oluştu:', error);
            });
    }

    /**
     * Nokta verilerini haritaya ekle
     */
    addPointToMap(point) {
        if (point && typeof point.pointX === 'number' && typeof point.pointY === 'number') {
            const feature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([point.pointX, point.pointY])),
                name: point.name || 'Unnamed Point',
                id: point.id
            });
            
            this.vectorSource.addFeature(feature);
        }
    }

    /**
     * "Nokta Ekle" butonunu yapılandır
     */
    initDrawButton() {
        const addPointBtn = document.getElementById('addPointBtn');
        if (addPointBtn) {
            addPointBtn.addEventListener('click', () => {
                if (!this.isDrawActive) {
                    this.startDrawing();
                } else {
                    this.stopDrawing();
                }
            });
        }
    }

    /**
     * Çizim modunu başlat
     */
    startDrawing() {
        // Çizim etkileşimini oluştur
        this.drawInteraction = new ol.interaction.Draw({
            source: this.vectorSource,
            type: 'Point'
        });
        
        // Çizim tamamlandığında
        this.drawInteraction.on('drawend', this.handleDrawEnd);
        
        // Haritaya ekle
        this.map.addInteraction(this.drawInteraction);
        this.isDrawActive = true;
        this.map.getViewport().style.cursor = 'crosshair';
    }

    /**
     * Çizim modunu durdur
     */
    stopDrawing() {
        if (this.drawInteraction) {
            this.map.removeInteraction(this.drawInteraction);
            this.drawInteraction = null;
        }
        this.isDrawActive = false;
        this.map.getViewport().style.cursor = 'default';
    }

    /**
     * Çizim tamamlandığında
     */
    handleDrawEnd(event) {
        this.currentFeature = event.feature;
        const coords = ol.proj.toLonLat(this.currentFeature.getGeometry().getCoordinates());
        this.showPanel(coords);
        this.stopDrawing();
    }

    /**
     * Panel göster
     */
    showPanel(coords) {
        const panel = jsPanel.create({
            headerTitle: 'Nokta Ekle',
            theme: 'dark',
            contentSize: '320 320',
            content: `
                <form id="pointForm">
                    <label>X Koordinatı:</label>
                    <input type="text" id="xCoord" value="${coords[0]}" disabled>
                    <label>Y Koordinatı:</label>
                    <input type="text" id="yCoord" value="${coords[1]}" disabled>
                    <label>Ad:</label>
                    <input type="text" id="name" required>
                    <div class="form-buttons">
                        <button type="submit" id="saveBtn">Kaydet</button>
                        <button type="button" id="cancelBtn">İptal</button>
                    </div>
                </form>
            `,
            onwindowclose: () => {
                this.isDrawActive = false;
                this.map.getViewport().style.cursor = 'default';
            }
        });

        // Form olaylarını ekle
        const form = document.getElementById('pointForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePoint(form, panel);
        });

        const cancelBtn = document.getElementById('cancelBtn');
        cancelBtn.addEventListener('click', () => {
            this.cancelPoint(panel);
        });
    }

    /**
     * Noktayı kaydet
     */
    savePoint(form, panel) {
        const name = document.getElementById('name').value;
        const pointX = document.getElementById('xCoord').value;
        const pointY = document.getElementById('yCoord').value;
        const createdDate = new Date().toISOString();
        
        fetch(this.config.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name, 
                pointX, 
                pointY, 
                createdDate 
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Başarıyla Kaydedildi:', data);
            panel.close();
            this.loadPointsFromDB(); // Yeni noktayı yükle
        })
        .catch(error => console.error('Hata:', error));
    }

    /**
     * Nokta eklemeyi iptal et
     */
    cancelPoint(panel) {
        if (this.currentFeature) {
            this.vectorSource.removeFeature(this.currentFeature);
            this.currentFeature = null;
        }
        panel.close();
    }
}

// Uygulama başlatıcı
function initializeApp() {
    const app = new MapApplication({
        // İsteğe bağlı yapılandırma burada eklenebilir
    });
    app.init();
}

// Sayfa yüklendiğinde başlat
window.onload = initializeApp;