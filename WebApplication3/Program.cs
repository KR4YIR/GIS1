using Microsoft.EntityFrameworkCore;
using WebApplication3;
using WebApplication3.Repositories;





var builder = WebApplication.CreateBuilder(args);

//program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("http://127.0.0.1:5500")
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

//builder.Services.AddSingleton<IPointService, PointService>();
//builder.Services.AddScoped<IPointService, PointService>();
//builder.Services.AddScoped<IPointService, EfPointService>();
builder.Services.AddScoped<IPointService,ApiService>();
// Add services to the container.
builder.Services.AddScoped(typeof(IWriteRepository<>),typeof(WriteRepository<>));
builder.Services.AddScoped(typeof(IReadRepository<>), typeof(ReadRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddDbContext<CbsDbContext>(options 
    => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors("AllowSpecificOrigin");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
