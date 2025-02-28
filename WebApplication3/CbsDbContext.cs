using Microsoft.EntityFrameworkCore;
using WebApplication3.Entities;

namespace WebApplication3
{
    public class CbsDbContext : DbContext
    {
        public CbsDbContext(DbContextOptions<CbsDbContext> options) : base(options)
        {

        }
        public DbSet<Point> Points { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=CbsDb;User Id=postgres;Password=ib");
        }
    }

}
