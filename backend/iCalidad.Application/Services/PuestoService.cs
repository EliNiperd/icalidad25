using Microsoft.EntityFrameworkCore;
using iCalidad.Application.Common.Interfaces;
using iCalidad.Application.DTOs;
using iCalidad.Domain.Entities;

namespace iCalidad.Application.Services
{
    public class PuestoService : IPuestoService
    {
        private readonly IApplicationDbContext _context;

        public PuestoService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<PuestoDto>> GetPagedAsync(
            string? searchQuery,
            int pageNumber,
            int pageSize,
            string? sortBy,
            string? sortOrder)
        {
            var query = _context.Puestos
                .Include(p => p.Departamento)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                var search = searchQuery.Trim().ToUpper();
                var searchIsActivo = "ACTIVO".Contains(search);
                var searchIsInactivo = "INACTIVO".Contains(search);

                query = query.Where(p =>
                    (p.NombrePuesto != null && p.NombrePuesto.ToUpper().Contains(search)) ||
                    (p.Departamento != null && p.Departamento.NombreDepartamento != null && p.Departamento.NombreDepartamento.ToUpper().Contains(search)) ||
                    (searchIsActivo && p.IdEstatusPuesto) ||
                    (searchIsInactivo && !p.IdEstatusPuesto));
            }

            var totalRecords = await query.CountAsync();

            var isDescending = string.Equals(sortOrder, "DESC", StringComparison.OrdinalIgnoreCase);
            var sortField = sortBy?.Trim() ?? "NombrePuesto";

            query = sortField.ToLower() switch
            {
                "nombredepartamento" => isDescending ? query.OrderByDescending(p => p.Departamento != null ? p.Departamento.NombreDepartamento : "") : query.OrderBy(p => p.Departamento != null ? p.Departamento.NombreDepartamento : ""),
                "idestatuspuesto" => isDescending ? query.OrderByDescending(p => p.IdEstatusPuesto) : query.OrderBy(p => p.IdEstatusPuesto),
                _ => isDescending ? query.OrderByDescending(p => p.NombrePuesto) : query.OrderBy(p => p.NombrePuesto)
            };

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = items.Select(p => new PuestoDto
            {
                IdPuesto = p.IdPuesto,
                NombrePuesto = (p.NombrePuesto ?? string.Empty).Trim(),
                IdDepartamento = p.IdDepartamento ?? 0,
                NombreDepartamento = p.Departamento?.NombreDepartamento?.Trim() ?? "Sin Asignar",
                IdEstatusPuesto = p.IdEstatusPuesto
            }).ToList();

            var totalPages = pageSize > 0 ? (int)Math.Ceiling(totalRecords / (double)pageSize) : 0;

            return new PagedResult<PuestoDto>
            {
                Items = dtos,
                TotalRecords = totalRecords,
                TotalPages = totalPages,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<List<PuestoSimpleDto>> GetActiveListAsync(int? idDepartamento = null)
        {
            var query = _context.Puestos
                .Include(p => p.Departamento)
                .Where(p => p.IdEstatusPuesto);

            if (idDepartamento.HasValue && idDepartamento.Value > 0)
            {
                query = query.Where(p => p.IdDepartamento == idDepartamento.Value);
            }

            return await query
                .OrderBy(p => p.NombrePuesto)
                .Select(p => new PuestoSimpleDto
                {
                    IdPuesto = p.IdPuesto,
                    NombrePuesto = (p.NombrePuesto ?? string.Empty).Trim(),
                    IdDepartamento = p.IdDepartamento ?? 0,
                    NombreDepartamento = p.Departamento != null && p.Departamento.NombreDepartamento != null 
                        ? p.Departamento.NombreDepartamento.Trim() 
                        : "Sin Asignar",
                    IdEstatusPuesto = p.IdEstatusPuesto
                })
                .ToListAsync();
        }

        public async Task<PuestoDto?> GetByIdAsync(int id)
        {
            var puesto = await _context.Puestos
                .Include(p => p.Departamento)
                .FirstOrDefaultAsync(p => p.IdPuesto == id);

            if (puesto == null)
            {
                return null;
            }

            return new PuestoDto
            {
                IdPuesto = puesto.IdPuesto,
                NombrePuesto = (puesto.NombrePuesto ?? string.Empty).Trim(),
                IdDepartamento = puesto.IdDepartamento ?? 0,
                NombreDepartamento = puesto.Departamento?.NombreDepartamento?.Trim() ?? "Sin Asignar",
                IdEstatusPuesto = puesto.IdEstatusPuesto
            };
        }

        public async Task<PuestoResultDto> CreateAsync(CreatePuestoRequest request, int userId)
        {
            var cleanNombre = request.NombrePuesto?.Trim() ?? string.Empty;

            if (string.IsNullOrEmpty(cleanNombre))
            {
                return new PuestoResultDto
                {
                    Resultado = -1,
                    Mensaje = "El nombre del puesto es obligatorio."
                };
            }

            if (request.IdDepartamento <= 0)
            {
                return new PuestoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Debe seleccionar un departamento válido."
                };
            }

            var deptoExists = await _context.Departamentos
                .AnyAsync(d => d.IdDepartamento == request.IdDepartamento && d.IdEstatusDepartamento && d.FechaBorrado == null);

            if (!deptoExists)
            {
                return new PuestoResultDto
                {
                    Resultado = -1,
                    Mensaje = "El departamento seleccionado no existe o no está activo."
                };
            }

            var duplicateExists = await _context.Puestos
                .AnyAsync(p => p.NombrePuesto != null && 
                               p.NombrePuesto.ToUpper() == cleanNombre.ToUpper() && 
                               p.IdEstatusPuesto);

            if (duplicateExists)
            {
                return new PuestoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Ya existe un puesto activo con ese nombre."
                };
            }

            var puesto = new Puesto
            {
                NombrePuesto = cleanNombre,
                IdDepartamento = request.IdDepartamento,
                IdEstatusPuesto = true,
                IdEmpleadoAlta = userId,
                FechaAlta = DateTime.Now
            };

            _context.Puestos.Add(puesto);
            await _context.SaveChangesAsync();

            return new PuestoResultDto
            {
                Resultado = puesto.IdPuesto,
                Mensaje = "Puesto creado exitosamente."
            };
        }

        public async Task<PuestoResultDto> UpdateAsync(int id, UpdatePuestoRequest request, int userId)
        {
            var puesto = await _context.Puestos
                .FirstOrDefaultAsync(p => p.IdPuesto == id);

            if (puesto == null)
            {
                return new PuestoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Puesto no encontrado."
                };
            }

            var cleanNombre = request.NombrePuesto?.Trim() ?? string.Empty;

            if (string.IsNullOrEmpty(cleanNombre))
            {
                return new PuestoResultDto
                {
                    Resultado = -1,
                    Mensaje = "El nombre del puesto es obligatorio."
                };
            }

            if (request.IdDepartamento <= 0)
            {
                return new PuestoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Debe seleccionar un departamento válido."
                };
            }

            var deptoExists = await _context.Departamentos
                .AnyAsync(d => d.IdDepartamento == request.IdDepartamento && d.IdEstatusDepartamento && d.FechaBorrado == null);

            if (!deptoExists)
            {
                return new PuestoResultDto
                {
                    Resultado = -1,
                    Mensaje = "El departamento seleccionado no existe o no está activo."
                };
            }

            var duplicateExists = await _context.Puestos
                .AnyAsync(p => p.IdPuesto != id && 
                               p.NombrePuesto != null && 
                               p.NombrePuesto.ToUpper() == cleanNombre.ToUpper() && 
                               p.IdEstatusPuesto);

            if (duplicateExists)
            {
                return new PuestoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Ya existe un puesto activo con ese nombre."
                };
            }

            puesto.NombrePuesto = cleanNombre;
            puesto.IdDepartamento = request.IdDepartamento;
            puesto.IdEstatusPuesto = request.IdEstatusPuesto;
            puesto.IdEmpleadoActualiza = userId;
            puesto.FechaActualiza = DateTime.Now;

            await _context.SaveChangesAsync();

            return new PuestoResultDto
            {
                Resultado = puesto.IdPuesto,
                Mensaje = "Puesto actualizado exitosamente."
            };
        }

        public async Task<PuestoResultDto> DeleteAsync(int id, int userId)
        {
            var puesto = await _context.Puestos
                .FirstOrDefaultAsync(p => p.IdPuesto == id);

            if (puesto == null)
            {
                return new PuestoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Puesto no encontrado."
                };
            }

            _context.Puestos.Remove(puesto);
            await _context.SaveChangesAsync();

            return new PuestoResultDto
            {
                Resultado = 1,
                Mensaje = "Puesto eliminado exitosamente."
            };
        }
    }
}
