using System.Drawing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication3.Entities;

namespace WebApplication3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PointController : ControllerBase
    {
        private readonly IPointService _pointService;
        public PointController(IPointService pointService)
        {
            _pointService = pointService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAsync()
        {
            var response = await _pointService.GetAsync();
            return Ok(response);
        }
        [HttpPost]
        public async Task<IActionResult> AddAsync(Point p)
        {
            var response = await _pointService.AddAsync(p);
            //Console.WriteLine($"Added Point: {response.Value}");

            return Ok(response);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(long id)
        {
            var response = await _pointService.GetByIdAsync(id);
            if (response.Success)
            {
                return Ok(response);
            }
            return NotFound(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveAsync(long id)
        {
            var response = await _pointService.RemoveAsync(id);
            if (response.Success)
            {
                return Ok(response);
            }
            return NotFound(response);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(long id, Point updatedPoint)
        {
            var response = await _pointService.UpdateAsync(id, updatedPoint);
            if (response.Success)
            {
                return Ok(response);
            }
            return NotFound(response);
        }
        
    }
}