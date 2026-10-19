using Microsoft.EntityFrameworkCore;
using iCalidad.Application.Common.Interfaces;
using iCalidad.Application.DTOs;
using iCalidad.Domain.Entities;

namespace iCalidad.Application.Services
{
    public class NormativaService : INormativaService
    {
        private readonly IApplicationDbContext _context;

        public NormativaService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<NormativaDto>> GetPagedAsync(
            string? searchQuery,
            int pageNumber,
            int pageSize,
            string? sortBy,
            string? sortOrder)
        {
            var query = _context.Normativas.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                var search = searchQuery.Trim().ToUpper();
                var searchIsActivo = "ACTIVO".Contains(search);
                var searchIsInactivo = "INACTIVO".Contains(search);

                query = query.Where(n =>
                    (n.ClaveNormativa != null && n.ClaveNormativa.ToUpper().Contains(search)) ||
                    (n.NombreNormativa != null && n.NombreNormativa.ToUpper().Contains(search)) ||
                    (searchIsActivo && n.IdEstatusNormativa) ||
                    (searchIsInactivo && !n.IdEstatusNormativa));
            }

            var totalRecords = await query.CountAsync();

            var isDescending = string.Equals(sortOrder, "DESC", StringComparison.OrdinalIgnoreCase);
            var sortField = sortBy?.Trim() ?? "NombreNormativa";

            query = sortField.ToLower() switch
            {
                "clavenormativa" => isDescending ? query.OrderByDescending(n => n.ClaveNormativa) : query.OrderBy(n => n.ClaveNormativa),
                "idestatusnormativa" => isDescending ? query.OrderByDescending(n => n.IdEstatusNormativa) : query.OrderBy(n => n.IdEstatusNormativa),
                _ => isDescending ? query.OrderByDescending(n => n.NombreNormativa) : query.OrderBy(n => n.NombreNormativa)
            };

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = items.Select(n => new NormativaDto
            {
                IdNormativa = n.IdNormativa,
                ClaveNormativa = (n.ClaveNormativa ?? string.Empty).Trim(),
                NombreNormativa = (n.NombreNormativa ?? string.Empty).Trim(),
                ClaveNombreNormativa = n.ClaveNombreNormativa?.Trim(),
                IdEstatusNormativa = n.IdEstatusNormativa
            }).ToList();

            var totalPages = pageSize > 0 ? (int)Math.Ceiling(totalRecords / (double)pageSize) : 0;

            return new PagedResult<NormativaDto>
            {
                Items = dtos,
                TotalRecords = totalRecords,
                TotalPages = totalPages,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<List<NormativaSimpleDto>> GetActiveListAsync()
        {
            return await _context.Normativas
                .Where(n => n.IdEstatusNormativa)
                .OrderBy(n => n.NombreNormativa)
                .Select(n => new NormativaSimpleDto
                {
                    IdNormativa = n.IdNormativa,
                    ClaveNormativa = (n.ClaveNormativa ?? string.Empty).Trim(),
                    NombreNormativa = (n.NombreNormativa ?? string.Empty).Trim(),
                    IdEstatusNormativa = n.IdEstatusNormativa
                })
                .ToListAsync();
        }

        public async Task<NormativaDto?> GetByIdAsync(int id)
        {
            var normativa = await _context.Normativas
                .FirstOrDefaultAsync(n => n.IdNormativa == id);

            if (normativa == null)
            {
                return null;
            }

            return new NormativaDto
            {
                IdNormativa = normativa.IdNormativa,
                ClaveNormativa = (normativa.ClaveNormativa ?? string.Empty).Trim(),
                NombreNormativa = (normativa.NombreNormativa ?? string.Empty).Trim(),
                ClaveNombreNormativa = normativa.ClaveNombreNormativa?.Trim(),
                IdEstatusNormativa = normativa.IdEstatusNormativa
            };
        }

        public async Task<NormativaResultDto> CreateAsync(CreateNormativaRequest request, int userId)
        {
            var cleanClave = request.ClaveNormativa?.Trim() ?? string.Empty;
            var cleanNombre = request.NombreNormativa?.Trim() ?? string.Empty;

            if (string.IsNullOrEmpty(cleanClave))
            {
                return new NormativaResultDto
                {
                    Resultado = -1,
                    Mensaje = "La clave de la normativa es obligatoria."
                };
            }

            if (string.IsNullOrEmpty(cleanNombre))
            {
                return new NormativaResultDto
                {
                    Resultado = -1,
                    Mensaje = "El nombre de la normativa es obligatorio."
                };
            }

            var duplicateExists = await _context.Normativas
                .AnyAsync(n => (n.ClaveNormativa != null && n.ClaveNormativa.ToUpper() == cleanClave.ToUpper()) ||
                               (n.NombreNormativa != null && n.NombreNormativa.ToUpper() == cleanNombre.ToUpper()));

            if (duplicateExists)
            {
                return new NormativaResultDto
                {
                    Resultado = -1,
                    Mensaje = "Ya existe una normativa con esa clave o nombre."
                };
            }

            var normativa = new Normativa
            {
                ClaveNormativa = cleanClave,
                NombreNormativa = cleanNombre,
                IdEstatusNormativa = true,
                IdEmpleadoAlta = userId,
                FechaAlta = DateTime.Now
            };

            _context.Normativas.Add(normativa);
            await _context.SaveChangesAsync();

            return new NormativaResultDto
            {
                Resultado = normativa.IdNormativa,
                Mensaje = "Normativa creada exitosamente."
            };
        }

        public async Task<NormativaResultDto> UpdateAsync(int id, UpdateNormativaRequest request, int userId)
        {
            var normativa = await _context.Normativas
                .FirstOrDefaultAsync(n => n.IdNormativa == id);

            if (normativa == null)
            {
                return new NormativaResultDto
                {
                    Resultado = -1,
                    Mensaje = "Normativa no encontrada."
                };
            }

            var cleanClave = request.ClaveNormativa?.Trim() ?? string.Empty;
            var cleanNombre = request.NombreNormativa?.Trim() ?? string.Empty;

            if (string.IsNullOrEmpty(cleanClave))
            {
                return new NormativaResultDto
                {
                    Resultado = -1,
                    Mensaje = "La clave de la normativa es obligatoria."
                };
            }

            if (string.IsNullOrEmpty(cleanNombre))
            {
                return new NormativaResultDto
                {
                    Resultado = -1,
                    Mensaje = "El nombre de la normativa es obligatorio."
                };
            }

            var duplicateExists = await _context.Normativas
                .AnyAsync(n => n.IdNormativa != id &&
                               ((n.ClaveNormativa != null && n.ClaveNormativa.ToUpper() == cleanClave.ToUpper()) ||
                                (n.NombreNormativa != null && n.NombreNormativa.ToUpper() == cleanNombre.ToUpper())));

            if (duplicateExists)
            {
                return new NormativaResultDto
                {
                    Resultado = -1,
                    Mensaje = "Ya existe otra normativa con esa clave o nombre."
                };
            }

            normativa.ClaveNormativa = cleanClave;
            normativa.NombreNormativa = cleanNombre;
            normativa.IdEstatusNormativa = request.IdEstatusNormativa;
            normativa.IdEmpleadoActualiza = userId;
            normativa.FechaActualiza = DateTime.Now;

            await _context.SaveChangesAsync();

            return new NormativaResultDto
            {
                Resultado = normativa.IdNormativa,
                Mensaje = "Normativa actualizada exitosamente."
            };
        }

        public async Task<NormativaResultDto> DeleteAsync(int id, int userId)
        {
            var normativa = await _context.Normativas
                .Include(n => n.Requisitos)
                .FirstOrDefaultAsync(n => n.IdNormativa == id);

            if (normativa == null)
            {
                return new NormativaResultDto
                {
                    Resultado = -1,
                    Mensaje = "Normativa no encontrada."
                };
            }

            var hasRequisitos = await _context.Requisitos
                .AnyAsync(r => r.IdNormativa == id);

            if (hasRequisitos)
            {
                return new NormativaResultDto
                {
                    Resultado = -1,
                    Mensaje = "No es posible eliminar la normativa porque tiene requisitos asociados."
                };
            }

            _context.Normativas.Remove(normativa);
            await _context.SaveChangesAsync();

            return new NormativaResultDto
            {
                Resultado = 1,
                Mensaje = "Normativa eliminada exitosamente."
            };
        }
    }
}
