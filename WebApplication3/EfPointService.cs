using System.Data.SqlTypes;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using WebApplication3.Entities;

namespace WebApplication3
{
    public class EfPointService : IPointService
    {

        private readonly CbsDbContext _context;

        public EfPointService(CbsDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<List<Point>>> GetAsync()
        {
            //Metod Syntax

            var points = await _context.Points.ToListAsync();
            if(points.Count != 0)
            return new ApiResponse<List<Point>>(true,"points get successfully",points);
            return new ApiResponse<List<Point>>(true,"there is no point saved database",null);

        }
        public async Task<ApiResponse<Point>> AddAsync(Point point)
        {
            var addPoint = new Point();
            addPoint.PointX = point.PointX;
            addPoint.PointY = point.PointY;
            addPoint.Name = point.Name;
            await _context.Points.AddAsync(addPoint);
            await _context.SaveChangesAsync();
            return new ApiResponse<Point>(true,"point added succesful", addPoint);
        }
        public async Task<ApiResponse<Point>> RemoveAsync(long id)
        {
            
            Point point = await _context.Points.FindAsync(id);

            if (point != null)
            {
                _context.Remove(point);
                await _context.SaveChangesAsync();
                return new ApiResponse<Point>(true, "deleted succesfuly", point);

            }
            return new ApiResponse<Point>(false, "point not found", point);

        }
        public async Task<ApiResponse<Point>> UpdateAsync(long id,Point updatedPoint)
        {
            Point point = await _context.Points.FindAsync(id);
            if (point != null)
            {
                point.Name = updatedPoint.Name;
                point.PointX = updatedPoint.PointX;
                point.PointY = updatedPoint.PointY;
                await _context.SaveChangesAsync();
                return new ApiResponse<Point>(true, "updated successfuly", updatedPoint);
            }
            return new ApiResponse<Point>(false, "point not found", updatedPoint);

        }
        public async Task<ApiResponse<Point>> GetByIdAsync(long id)
        {
            var point = await _context.Points.FindAsync(id);
            if (point != null)
            return new ApiResponse<Point>(true,"successful",point);
            return new ApiResponse<Point>(false, "point not found", point);

        }

    }
}
