using Microsoft.EntityFrameworkCore;
using iCalidad.Application.Common.Interfaces;
using iCalidad.Application.DTOs;
using iCalidad.Domain.Entities;

namespace iCalidad.Application.Services
{
    public class GerenciaService : IGerenciaService
    {
        private readonly IApplicationDbContext _context;

        public GerenciaService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<GerenciaDto>> GetPagedAsync(
            string? searchQuery,
            int pageNumber,
            int pageSize,
            string? sortBy,
            string? sortOrder)
        {
            var query = _context.Gerencias
                .Where(g => g.FechaBorrado == null)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                var search = searchQuery.Trim().ToUpper();
                var searchIsActivo = "ACTIVO".Contains(search);
                var searchIsInactivo = "INACTIVO".Contains(search);

                query = query.Where(g =>
                    g.ClaveGerencia.ToUpper().Contains(search) ||
                    g.NombreGerencia.ToUpper().Contains(search) ||
                    (searchIsActivo && g.IdEstatusGerencia) ||
                    (searchIsInactivo && !g.IdEstatusGerencia));
            }

            var totalRecords = await query.CountAsync();

            // Ordenamiento dinámico
            var isDescending = string.Equals(sortOrder, "DESC", StringComparison.OrdinalIgnoreCase);
            var sortField = sortBy?.Trim() ?? "NombreGerencia";

            query = sortField.ToLower() switch
            {
                "clavegerencia" => isDescending ? query.OrderByDescending(g => g.ClaveGerencia) : query.OrderBy(g => g.ClaveGerencia),
                "idestatusgerencia" => isDescending ? query.OrderByDescending(g => g.IdEstatusGerencia) : query.OrderBy(g => g.IdEstatusGerencia),
                _ => isDescending ? query.OrderByDescending(g => g.NombreGerencia) : query.OrderBy(g => g.NombreGerencia)
            };

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Determinar si tienen departamentos asociados para el indicador de borrado
            var gerenciaIds = items.Select(g => g.IdGerencia).ToList();
            var referencedGerenciaIds = await _context.Departamentos
                .Where(d => gerenciaIds.Contains(d.IdGerencia) && d.FechaBorrado == null)
                .Select(d => d.IdGerencia)
                .Distinct()
                .ToListAsync();

            var dtos = items.Select(g => new GerenciaDto
            {
                IdGerencia = g.IdGerencia,
                ClaveGerencia = g.ClaveGerencia.Trim(),
                NombreGerencia = g.NombreGerencia.Trim(),
                IdEstatusGerencia = g.IdEstatusGerencia,
                BorrarGerencia = referencedGerenciaIds.Contains(g.IdGerencia) ? "NoBorrar" : string.Empty
            }).ToList();

            var totalPages = pageSize > 0 ? (int)Math.Ceiling(totalRecords / (double)pageSize) : 0;

            return new PagedResult<GerenciaDto>
            {
                Items = dtos,
                TotalRecords = totalRecords,
                TotalPages = totalPages,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<List<GerenciaSimpleDto>> GetActiveListAsync()
        {
            return await _context.Gerencias
                .Where(g => g.IdEstatusGerencia && g.FechaBorrado == null)
                .OrderBy(g => g.NombreGerencia)
                .Select(g => new GerenciaSimpleDto
                {
                    IdGerencia = g.IdGerencia,
                    NombreGerencia = g.NombreGerencia.Trim()
                })
                .ToListAsync();
        }

        public async Task<GerenciaDto?> GetByIdAsync(int id)
        {
            var gerencia = await _context.Gerencias
                .FirstOrDefaultAsync(g => g.IdGerencia == id && g.FechaBorrado == null);

            if (gerencia == null) return null;

            return new GerenciaDto
            {
                IdGerencia = gerencia.IdGerencia,
                ClaveGerencia = gerencia.ClaveGerencia.Trim(),
                NombreGerencia = gerencia.NombreGerencia.Trim(),
                IdEstatusGerencia = gerencia.IdEstatusGerencia
            };
        }

        public async Task<GerenciaResultDto> CreateAsync(CreateGerenciaRequest request, int userId)
        {
            var cleanClave = request.ClaveGerencia?.Trim() ?? string.Empty;
            var cleanNombre = request.NombreGerencia?.Trim() ?? string.Empty;

            if (string.IsNullOrEmpty(cleanClave) || string.IsNullOrEmpty(cleanNombre))
            {
                return new GerenciaResultDto
                {
                    Resultado = -1,
                    Mensaje = "La clave y el nombre de gerencia son obligatorios."
                };
            }

            var duplicateExists = await _context.Gerencias
                .AnyAsync(g => g.IdEstatusGerencia && g.FechaBorrado == null &&
                    (g.ClaveGerencia.ToUpper() == cleanClave.ToUpper() ||
                     g.NombreGerencia.ToUpper() == cleanNombre.ToUpper()));

            if (duplicateExists)
            {
                return new GerenciaResultDto
                {
                    Resultado = -1,
                    Mensaje = "Ya existe un registro con la misma clave o nombre."
                };
            }

            var gerencia = new Gerencia
            {
                ClaveGerencia = cleanClave,
                NombreGerencia = cleanNombre,
                IdEstatusGerencia = true,
                IdEmpleadoAlta = userId,
                FechaAlta = DateTime.Now
            };

            _context.Gerencias.Add(gerencia);
            await _context.SaveChangesAsync();

            return new GerenciaResultDto
            {
                Resultado = gerencia.IdGerencia,
                Mensaje = "Creación exitosa"
            };
        }

        public async Task<GerenciaResultDto> UpdateAsync(int id, UpdateGerenciaRequest request, int userId)
        {
            var gerencia = await _context.Gerencias
                .FirstOrDefaultAsync(g => g.IdGerencia == id && g.FechaBorrado == null);

            if (gerencia == null)
            {
                return new GerenciaResultDto
                {
                    Resultado = -1,
                    Mensaje = "Gerencia no encontrada."
                };
            }

            var cleanClave = request.ClaveGerencia?.Trim() ?? string.Empty;
            var cleanNombre = request.NombreGerencia?.Trim() ?? string.Empty;

            if (string.IsNullOrEmpty(cleanClave) || string.IsNullOrEmpty(cleanNombre))
            {
                return new GerenciaResultDto
                {
                    Resultado = -1,
                    Mensaje = "La clave y el nombre de gerencia son obligatorios."
                };
            }

            var duplicateExists = await _context.Gerencias
                .AnyAsync(g => g.IdGerencia != id && g.FechaBorrado == null &&
                    (g.ClaveGerencia.ToUpper() == cleanClave.ToUpper() ||
                     g.NombreGerencia.ToUpper() == cleanNombre.ToUpper()));

            if (duplicateExists)
            {
                return new GerenciaResultDto
                {
                    Resultado = -1,
                    Mensaje = "Ya existe un registro con la misma clave o nombre."
                };
            }

            gerencia.ClaveGerencia = cleanClave;
            gerencia.NombreGerencia = cleanNombre;
            gerencia.IdEstatusGerencia = request.IdEstatusGerencia;
            gerencia.IdEmpleadoActualiza = userId;
            gerencia.FechaActualiza = DateTime.Now;

            await _context.SaveChangesAsync();

            return new GerenciaResultDto
            {
                Resultado = gerencia.IdGerencia,
                Mensaje = "Actualización exitosa"
            };
        }

        public async Task<GerenciaResultDto> DeleteAsync(int id, int userId)
        {
            var gerencia = await _context.Gerencias
                .FirstOrDefaultAsync(g => g.IdGerencia == id && g.FechaBorrado == null);

            if (gerencia == null)
            {
                return new GerenciaResultDto
                {
                    Resultado = -1,
                    Mensaje = "Gerencia no encontrada."
                };
            }

            // Verificar si tiene departamentos dependientes
            var hasDepartments = await _context.Departamentos
                .AnyAsync(d => d.IdGerencia == id && d.FechaBorrado == null);

            if (hasDepartments)
            {
                return new GerenciaResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se puede eliminar la gerencia porque tiene departamentos asociados."
                };
            }

            // Eliminación física (consistente con el SP PD_Gen_TGerencia original)
            _context.Gerencias.Remove(gerencia);
            await _context.SaveChangesAsync();

            return new GerenciaResultDto
            {
                Resultado = 1,
                Mensaje = "Eliminación exitosa"
            };
        }
    }
}
