using Microsoft.EntityFrameworkCore;
using iCalidad.Application.Common.Interfaces;
using iCalidad.Application.DTOs;
using iCalidad.Domain.Entities;

namespace iCalidad.Application.Services
{
    public class RequisitoService : IRequisitoService
    {
        private readonly IApplicationDbContext _context;

        public RequisitoService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<RequisitoDto>> GetPagedAsync(
            string? searchQuery,
            int? idNormativa,
            int pageNumber,
            int pageSize,
            string? sortBy,
            string? sortOrder)
        {
            var query = _context.Requisitos
                .Include(r => r.Normativa)
                .AsQueryable();

            if (idNormativa.HasValue && idNormativa.Value > 0)
            {
                query = query.Where(r => r.IdNormativa == idNormativa.Value);
            }

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                var search = searchQuery.Trim().ToUpper();
                var searchIsActivo = "ACTIVO".Contains(search);
                var searchIsInactivo = "INACTIVO".Contains(search);

                query = query.Where(r =>
                    (r.ClaveRequisito != null && r.ClaveRequisito.ToUpper().Contains(search)) ||
                    (r.NombreRequisito != null && r.NombreRequisito.ToUpper().Contains(search)) ||
                    (r.TextoRequisito != null && r.TextoRequisito.ToUpper().Contains(search)) ||
                    (r.Normativa != null && r.Normativa.NombreNormativa != null && r.Normativa.NombreNormativa.ToUpper().Contains(search)) ||
                    (searchIsActivo && r.IdEstatusRequisito) ||
                    (searchIsInactivo && !r.IdEstatusRequisito));
            }

            var totalRecords = await query.CountAsync();

            var isDescending = string.Equals(sortOrder, "DESC", StringComparison.OrdinalIgnoreCase);
            var sortField = sortBy?.Trim() ?? "ClaveRequisito";

            query = sortField.ToLower() switch
            {
                "nombrerequisito" => isDescending ? query.OrderByDescending(r => r.NombreRequisito) : query.OrderBy(r => r.NombreRequisito),
                "nombrenormativa" => isDescending ? query.OrderByDescending(r => r.Normativa != null ? r.Normativa.NombreNormativa : "") : query.OrderBy(r => r.Normativa != null ? r.Normativa.NombreNormativa : ""),
                "idestatusrequisito" => isDescending ? query.OrderByDescending(r => r.IdEstatusRequisito) : query.OrderBy(r => r.IdEstatusRequisito),
                _ => isDescending ? query.OrderByDescending(r => r.ClaveRequisito) : query.OrderBy(r => r.ClaveRequisito)
            };

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = items.Select(r => new RequisitoDto
            {
                IdRequisito = r.IdRequisito,
                IdNormativa = r.IdNormativa ?? 0,
                ClaveNormativa = (r.Normativa?.ClaveNormativa ?? string.Empty).Trim(),
                NombreNormativa = (r.Normativa?.NombreNormativa ?? string.Empty).Trim(),
                ClaveRequisito = (r.ClaveRequisito ?? string.Empty).Trim(),
                NombreRequisito = (r.NombreRequisito ?? string.Empty).Trim(),
                ClaveNombreRequisito = r.ClaveNombreRequisito?.Trim(),
                TextoRequisito = r.TextoRequisito?.Trim(),
                IdTipoRequisito = r.IdTipoRequisito,
                IdEstatusRequisito = r.IdEstatusRequisito
            }).ToList();

            var totalPages = pageSize > 0 ? (int)Math.Ceiling(totalRecords / (double)pageSize) : 0;

            return new PagedResult<RequisitoDto>
            {
                Items = dtos,
                TotalRecords = totalRecords,
                TotalPages = totalPages,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<List<RequisitoDto>> GetActiveListByNormativaAsync(int idNormativa)
        {
            return await _context.Requisitos
                .Include(r => r.Normativa)
                .Where(r => r.IdNormativa == idNormativa && r.IdEstatusRequisito)
                .OrderBy(r => r.ClaveRequisito)
                .Select(r => new RequisitoDto
                {
                    IdRequisito = r.IdRequisito,
                    IdNormativa = r.IdNormativa ?? 0,
                    ClaveNormativa = (r.Normativa != null ? r.Normativa.ClaveNormativa ?? "" : "").Trim(),
                    NombreNormativa = (r.Normativa != null ? r.Normativa.NombreNormativa ?? "" : "").Trim(),
                    ClaveRequisito = (r.ClaveRequisito ?? string.Empty).Trim(),
                    NombreRequisito = (r.NombreRequisito ?? string.Empty).Trim(),
                    ClaveNombreRequisito = r.ClaveNombreRequisito != null ? r.ClaveNombreRequisito.Trim() : null,
                    TextoRequisito = r.TextoRequisito != null ? r.TextoRequisito.Trim() : null,
                    IdTipoRequisito = r.IdTipoRequisito,
                    IdEstatusRequisito = r.IdEstatusRequisito
                })
                .ToListAsync();
        }

        public async Task<RequisitoDto?> GetByIdAsync(int id)
        {
            var req = await _context.Requisitos
                .Include(r => r.Normativa)
                .FirstOrDefaultAsync(r => r.IdRequisito == id);

            if (req == null)
            {
                return null;
            }

            return new RequisitoDto
            {
                IdRequisito = req.IdRequisito,
                IdNormativa = req.IdNormativa ?? 0,
                ClaveNormativa = (req.Normativa?.ClaveNormativa ?? string.Empty).Trim(),
                NombreNormativa = (req.Normativa?.NombreNormativa ?? string.Empty).Trim(),
                ClaveRequisito = (req.ClaveRequisito ?? string.Empty).Trim(),
                NombreRequisito = (req.NombreRequisito ?? string.Empty).Trim(),
                ClaveNombreRequisito = req.ClaveNombreRequisito?.Trim(),
                TextoRequisito = req.TextoRequisito?.Trim(),
                IdTipoRequisito = req.IdTipoRequisito,
                IdEstatusRequisito = req.IdEstatusRequisito
            };
        }

        public async Task<RequisitoResultDto> CreateAsync(CreateRequisitoRequest request, int userId)
        {
            var cleanClave = request.ClaveRequisito?.Trim() ?? string.Empty;
            var cleanNombre = request.NombreRequisito?.Trim() ?? string.Empty;
            var cleanTexto = request.TextoRequisito?.Trim();

            if (request.IdNormativa <= 0)
            {
                return new RequisitoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Debe seleccionar una normativa válida."
                };
            }

            if (string.IsNullOrEmpty(cleanClave))
            {
                return new RequisitoResultDto
                {
                    Resultado = -1,
                    Mensaje = "La clave del requisito es obligatoria."
                };
            }

            if (string.IsNullOrEmpty(cleanNombre))
            {
                return new RequisitoResultDto
                {
                    Resultado = -1,
                    Mensaje = "El nombre del requisito es obligatorio."
                };
            }

            var normativaExists = await _context.Normativas
                .AnyAsync(n => n.IdNormativa == request.IdNormativa && n.IdEstatusNormativa);

            if (!normativaExists)
            {
                return new RequisitoResultDto
                {
                    Resultado = -1,
                    Mensaje = "La normativa seleccionada no existe o no está activa."
                };
            }

            var duplicateExists = await _context.Requisitos
                .AnyAsync(r => r.IdNormativa == request.IdNormativa &&
                               r.ClaveRequisito != null &&
                               r.ClaveRequisito.ToUpper() == cleanClave.ToUpper());

            if (duplicateExists)
            {
                return new RequisitoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Ya existe un requisito con esa clave para la normativa seleccionada."
                };
            }

            var requisito = new Requisito
            {
                IdNormativa = request.IdNormativa,
                ClaveRequisito = cleanClave,
                NombreRequisito = cleanNombre,
                TextoRequisito = cleanTexto,
                IdTipoRequisito = request.IdTipoRequisito,
                IdEstatusRequisito = true,
                IdEmpleadoAlta = userId,
                FechaAlta = DateTime.Now
            };

            _context.Requisitos.Add(requisito);
            await _context.SaveChangesAsync();

            return new RequisitoResultDto
            {
                Resultado = requisito.IdRequisito,
                Mensaje = "Requisito creado exitosamente."
            };
        }

        public async Task<RequisitoResultDto> UpdateAsync(int id, UpdateRequisitoRequest request, int userId)
        {
            var requisito = await _context.Requisitos
                .FirstOrDefaultAsync(r => r.IdRequisito == id);

            if (requisito == null)
            {
                return new RequisitoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Requisito no encontrado."
                };
            }

            var cleanClave = request.ClaveRequisito?.Trim() ?? string.Empty;
            var cleanNombre = request.NombreRequisito?.Trim() ?? string.Empty;
            var cleanTexto = request.TextoRequisito?.Trim();

            if (request.IdNormativa <= 0)
            {
                return new RequisitoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Debe seleccionar una normativa válida."
                };
            }

            if (string.IsNullOrEmpty(cleanClave))
            {
                return new RequisitoResultDto
                {
                    Resultado = -1,
                    Mensaje = "La clave del requisito es obligatoria."
                };
            }

            if (string.IsNullOrEmpty(cleanNombre))
            {
                return new RequisitoResultDto
                {
                    Resultado = -1,
                    Mensaje = "El nombre del requisito es obligatorio."
                };
            }

            var normativaExists = await _context.Normativas
                .AnyAsync(n => n.IdNormativa == request.IdNormativa && n.IdEstatusNormativa);

            if (!normativaExists)
            {
                return new RequisitoResultDto
                {
                    Resultado = -1,
                    Mensaje = "La normativa seleccionada no existe o no está activa."
                };
            }

            var duplicateExists = await _context.Requisitos
                .AnyAsync(r => r.IdRequisito != id &&
                               r.IdNormativa == request.IdNormativa &&
                               r.ClaveRequisito != null &&
                               r.ClaveRequisito.ToUpper() == cleanClave.ToUpper());

            if (duplicateExists)
            {
                return new RequisitoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Ya existe un requisito con esa clave para la normativa seleccionada."
                };
            }

            requisito.IdNormativa = request.IdNormativa;
            requisito.ClaveRequisito = cleanClave;
            requisito.NombreRequisito = cleanNombre;
            requisito.TextoRequisito = cleanTexto;
            requisito.IdTipoRequisito = request.IdTipoRequisito;
            requisito.IdEstatusRequisito = request.IdEstatusRequisito;
            requisito.IdEmpleadoActualiza = userId;
            requisito.FechaActualiza = DateTime.Now;

            await _context.SaveChangesAsync();

            return new RequisitoResultDto
            {
                Resultado = requisito.IdRequisito,
                Mensaje = "Requisito actualizado exitosamente."
            };
        }

        public async Task<RequisitoResultDto> DeleteAsync(int id, int userId)
        {
            var requisito = await _context.Requisitos
                .FirstOrDefaultAsync(r => r.IdRequisito == id);

            if (requisito == null)
            {
                return new RequisitoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Requisito no encontrado."
                };
            }

            _context.Requisitos.Remove(requisito);
            await _context.SaveChangesAsync();

            return new RequisitoResultDto
            {
                Resultado = 1,
                Mensaje = "Requisito eliminado exitosamente."
            };
        }
    }
}
