using WebApplication3.Entities;
using WebApplication3.Repositories;

namespace WebApplication3
{
    public interface IUnitOfWork : IDisposable
    {
        IWriteRepository<Point> Points { get; }
        IReadRepository<Point> ReadPoints { get; }
        Task<int> SaveAsync();
    }
}
