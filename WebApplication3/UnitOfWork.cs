using WebApplication3.Entities;
using WebApplication3.Repositories;

namespace WebApplication3
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly CbsDbContext _context;

        public IWriteRepository<Point> Points {  get; private set; }

        public IReadRepository<Point> ReadPoints {  get; private set; }

        public UnitOfWork(CbsDbContext context)
        {
            _context = context;
            Points = new WriteRepository<Point>(_context);
            ReadPoints = new ReadRepository<Point>(_context);
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
