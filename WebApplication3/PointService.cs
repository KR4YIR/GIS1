using WebApplication3.Entities;

namespace WebApplication3
{
    public class PointService
    {
        private List<Point> _pointList = new List<Point>();
        private long _nextId = 1;
        public ApiResponse<List<Point>> GetAsync()
        {
            return new ApiResponse<List<Point>>(true, "Data retrieved sucsessfully", _pointList);
        }
        public ApiResponse<Point> Add(Point p)
        {
            p.Id = _nextId;
            _nextId++;
            _pointList.Add(p);
            return new ApiResponse<Point>(true, "Point added successfully", p);
        }
        public ApiResponse<Point> Remove(long id)
        {
            var point = _pointList.FirstOrDefault(x => x.Id == id);
            if (point == null) { return new ApiResponse<Point>(false, "Point not found", null); };
            _pointList.Remove(point);
            return new ApiResponse<Point>(true, "Point deleted successfully", point);


        }
        public ApiResponse<Point> Update(long id, Point updatedPoint)
        {
            var point = _pointList.FirstOrDefault(p => p.Id == id);
            if (point == null) { return new ApiResponse<Point>(false, "Point not found", null); }
            point.PointX = updatedPoint.PointX;
            point.PointY = updatedPoint.PointY;
            point.Name = updatedPoint.Name;
            return new ApiResponse<Point>(true, "Point updated successfully", point);
        }
        public ApiResponse<Point> GetById(long id)
        {
            var point = _pointList.FirstOrDefault(p => p.Id == id);
            if (point == null) { return new ApiResponse<Point>(false, "Point not found", null); }
            return new ApiResponse<Point>(true, "Point retrieved succesfully", point);
        }
    }
}
