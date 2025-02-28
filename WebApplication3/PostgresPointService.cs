using Npgsql;
using WebApplication3.Entities;

namespace WebApplication3
{
    public class PostgresPointService
    {
        private readonly string _connectionString;

        public PostgresPointService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            CreateTableIfNotExsist();
        }

        private void CreateTableIfNotExsist()
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            var sql = @"
            CREATE TABLE IF NOT EXISTS points (
                id SERIAL PRIMARY KEY,
                point_x DOUBLE PRECISION,
                point_y DOUBLE PRECISION,
                name VARCHAR(100)
            )";
            using var command = new NpgsqlCommand(sql, connection);
            command.ExecuteNonQuery();

        }
        public ApiResponse<List<Point>> GetAsync()
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            var sql = "SELECT id, point_x, point_y, name FROM points";
            using var command = new NpgsqlCommand( sql, connection);


            var points = new List<Point>();

            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                points.Add (new Point
                {
                    Id = reader.GetInt64(0),
                    PointX = reader.GetDouble(1),
                    PointY = reader.GetDouble(2),
                    Name = reader.GetString(3)
                });

            }
            return new ApiResponse <List<Point>> (true, "successful", points);



        }
        public ApiResponse<Point> Add(Point point) 
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            var sql = @"
            INSERT INTO points (point_x, point_y, name)
            VALUES (@pointX, @pointY, @name)
            RETURNING id, point_x, point_y, name";
            using var command = new NpgsqlCommand( sql, connection);
            command.Parameters.AddWithValue("pointX", point.PointX);
            command.Parameters.AddWithValue("pointY", point.PointY);
            command.Parameters.AddWithValue("name", point.Name);

            using var reader = command.ExecuteReader();
            if (reader.Read())
            {
                var newPoint = new Point
                {
                    Id = reader.GetInt64(0),
                    PointX = reader.GetDouble(1),
                    PointY = reader.GetDouble(2),
                    Name = reader.GetString(3)
                };
                return new ApiResponse<Point>(true, "point added", newPoint);
            }
            return new ApiResponse<Point>(false, "FAILED", null);

        }

        public ApiResponse<Point> Remove(long id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            var point = GetById(id).Value;
            if (point == null)
            {
                return new ApiResponse<Point>(false, "Point not found", null);
            }

            var sql = "DELETE FROM points WHERE id = @id";
            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("id", id);

            var rowsAffected = command.ExecuteNonQuery();
            if (rowsAffected > 0)
            {
                return new ApiResponse<Point>(true, "Point deleted", point);
            }

            return new ApiResponse<Point>(false, "Failed to delete", null);


        }
        public ApiResponse<Point> Update(long id, Point updatedPoint)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            var sql = @"
            UPDATE points 
            SET point_x = @pointX, point_y = @pointY, name = @name 
            WHERE id = @id 
            RETURNING id, point_x, point_y, name";

            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("id", id);
            command.Parameters.AddWithValue("pointX", updatedPoint.PointX);
            command.Parameters.AddWithValue("pointY", updatedPoint.PointY);
            command.Parameters.AddWithValue("name", updatedPoint.Name);

            using var reader = command.ExecuteReader();
            if (reader.Read())
            {
                var point = new Point
                {
                    Id = reader.GetInt64(0),
                    PointX = reader.GetDouble(1),
                    PointY = reader.GetDouble(2),
                    Name = reader.GetString(3)
                };
                return new ApiResponse<Point>(true, "Point updated", point);
            }

            return new ApiResponse<Point>(false, "Point not found", null);
        }
        
        public ApiResponse<Point> GetById(long id)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            connection.Open();

            var sql = "SELECT id, point_x, point_y, name FROM points WHERE id = @id";
            using var command = new NpgsqlCommand(sql, connection);
            command.Parameters.AddWithValue("id", id);

            using var reader = command.ExecuteReader();
            if (reader.Read())
            {
                var point = new Point
                {
                    Id = reader.GetInt64(0),
                    PointX = reader.GetDouble(1),
                    PointY = reader.GetDouble(2),
                    Name = reader.GetString(3)
                };
                return new ApiResponse<Point>(true, "successful", point);
            }

            return new ApiResponse<Point>(false, "ERROR", null);
        }
    }
}
