using Microsoft.EntityFrameworkCore;
using iCalidad.Application.Common.Interfaces;
using iCalidad.Application.DTOs;
using iCalidad.Domain.Entities;

namespace iCalidad.Application.Services
{
    public class ProcesoService : IProcesoService
    {
        private readonly IApplicationDbContext _context;

        public ProcesoService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<ProcesoDto>> GetPagedAsync(
            string? searchQuery,
            int pageNumber,
            int pageSize,
            string? sortBy,
            string? sortOrder)
        {
            var query = _context.Procesos
                .Include(p => p.EmpleadoResponsable)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                var search = searchQuery.Trim().ToUpper();
                var searchIsActivo = "ACTIVO".Contains(search);
                var searchIsInactivo = "INACTIVO".Contains(search);

                query = query.Where(p =>
                    (p.ClaveProceso != null && p.ClaveProceso.ToUpper().Contains(search)) ||
                    (p.NombreProceso != null && p.NombreProceso.ToUpper().Contains(search)) ||
                    (p.EmpleadoResponsable != null && p.EmpleadoResponsable.NombreEmpleado != null && p.EmpleadoResponsable.NombreEmpleado.ToUpper().Contains(search)) ||
                    (searchIsActivo && p.IdEstatusProceso) ||
                    (searchIsInactivo && !p.IdEstatusProceso));
            }

            var totalRecords = await query.CountAsync();

            var isDescending = string.Equals(sortOrder, "DESC", StringComparison.OrdinalIgnoreCase);
            var sortField = sortBy?.Trim() ?? "NombreProceso";

            query = sortField.ToLower() switch
            {
                "claveproceso" => isDescending ? query.OrderByDescending(p => p.ClaveProceso) : query.OrderBy(p => p.ClaveProceso),
                "idestatusproceso" => isDescending ? query.OrderByDescending(p => p.IdEstatusProceso) : query.OrderBy(p => p.IdEstatusProceso),
                "responsableproceso" or "nombreempleadoresponsable" => isDescending 
                    ? query.OrderByDescending(p => p.EmpleadoResponsable != null ? p.EmpleadoResponsable.NombreEmpleado : "") 
                    : query.OrderBy(p => p.EmpleadoResponsable != null ? p.EmpleadoResponsable.NombreEmpleado : ""),
                _ => isDescending ? query.OrderByDescending(p => p.NombreProceso) : query.OrderBy(p => p.NombreProceso)
            };

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = items.Select(p => new ProcesoDto
            {
                IdProceso = p.IdProceso,
                ClaveProceso = (p.ClaveProceso ?? string.Empty).Trim(),
                NombreProceso = (p.NombreProceso ?? string.Empty).Trim(),
                ClaveNombreProceso = p.ClaveNombreProceso?.Trim(),
                ResponsableProceso = p.EmpleadoResponsable?.NombreEmpleado?.Trim() ?? p.ResponsableProceso?.Trim(),
                IdEstatusProceso = p.IdEstatusProceso,
                IdEmpleadoResponsable = p.IdEmpleadoResponsable,
                NombreEmpleadoResponsable = p.EmpleadoResponsable?.NombreEmpleado?.Trim()
            }).ToList();

            var totalPages = pageSize > 0 ? (int)Math.Ceiling(totalRecords / (double)pageSize) : 0;

            return new PagedResult<ProcesoDto>
            {
                Items = dtos,
                TotalRecords = totalRecords,
                TotalPages = totalPages,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<List<ProcesoSimpleDto>> GetActiveListAsync()
        {
            return await _context.Procesos
                .Where(p => p.IdEstatusProceso)
                .OrderBy(p => p.NombreProceso)
                .Select(p => new ProcesoSimpleDto
                {
                    IdProceso = p.IdProceso,
                    ClaveProceso = (p.ClaveProceso ?? string.Empty).Trim(),
                    NombreProceso = (p.NombreProceso ?? string.Empty).Trim(),
                    IdEstatusProceso = p.IdEstatusProceso
                })
                .ToListAsync();
        }

        public async Task<ProcesoDto?> GetByIdAsync(int id)
        {
            var p = await _context.Procesos
                .Include(p => p.EmpleadoResponsable)
                .FirstOrDefaultAsync(p => p.IdProceso == id);

            if (p == null) return null;

            return new ProcesoDto
            {
                IdProceso = p.IdProceso,
                ClaveProceso = (p.ClaveProceso ?? string.Empty).Trim(),
                NombreProceso = (p.NombreProceso ?? string.Empty).Trim(),
                ClaveNombreProceso = p.ClaveNombreProceso?.Trim(),
                ResponsableProceso = p.EmpleadoResponsable?.NombreEmpleado?.Trim() ?? p.ResponsableProceso?.Trim(),
                IdEstatusProceso = p.IdEstatusProceso,
                IdEmpleadoResponsable = p.IdEmpleadoResponsable,
                NombreEmpleadoResponsable = p.EmpleadoResponsable?.NombreEmpleado?.Trim()
            };
        }

        public async Task<ProcesoResultDto> CreateAsync(CreateProcesoRequest request, int userId)
        {
            var cleanClave = request.ClaveProceso?.Trim() ?? string.Empty;
            var cleanNombre = request.NombreProceso?.Trim() ?? string.Empty;

            if (string.IsNullOrEmpty(cleanClave))
            {
                return new ProcesoResultDto { Resultado = -1, Mensaje = "La clave del proceso es obligatoria." };
            }

            if (string.IsNullOrEmpty(cleanNombre))
            {
                return new ProcesoResultDto { Resultado = -1, Mensaje = "El nombre del proceso es obligatorio." };
            }

            var duplicateExists = await _context.Procesos
                .AnyAsync(p => (p.ClaveProceso != null && p.ClaveProceso.ToUpper() == cleanClave.ToUpper()) ||
                               (p.NombreProceso != null && p.NombreProceso.ToUpper() == cleanNombre.ToUpper()));

            if (duplicateExists)
            {
                return new ProcesoResultDto { Resultado = -1, Mensaje = "Ya existe un proceso con esa clave o nombre." };
            }

            string? responsableNombre = null;
            if (request.IdEmpleadoResponsable.HasValue && request.IdEmpleadoResponsable.Value > 0)
            {
                var emp = await _context.Empleados.FirstOrDefaultAsync(e => e.IdEmpleado == request.IdEmpleadoResponsable.Value);
                if (emp != null)
                {
                    responsableNombre = emp.NombreEmpleado;
                }
            }

            var proceso = new Proceso
            {
                ClaveProceso = cleanClave,
                NombreProceso = cleanNombre,
                IdEmpleadoResponsable = request.IdEmpleadoResponsable > 0 ? request.IdEmpleadoResponsable : null,
                ResponsableProceso = responsableNombre,
                IdEstatusProceso = true,
                IdEmpleadoAlta = userId,
                FechaAlta = DateTime.Now
            };

            _context.Procesos.Add(proceso);
            await _context.SaveChangesAsync();

            return new ProcesoResultDto
            {
                Resultado = proceso.IdProceso,
                Mensaje = "Proceso creado exitosamente."
            };
        }

        public async Task<ProcesoResultDto> UpdateAsync(int id, UpdateProcesoRequest request, int userId)
        {
            var proceso = await _context.Procesos.FirstOrDefaultAsync(p => p.IdProceso == id);

            if (proceso == null)
            {
                return new ProcesoResultDto { Resultado = -1, Mensaje = "Proceso no encontrado." };
            }

            var cleanClave = request.ClaveProceso?.Trim() ?? string.Empty;
            var cleanNombre = request.NombreProceso?.Trim() ?? string.Empty;

            if (string.IsNullOrEmpty(cleanClave))
            {
                return new ProcesoResultDto { Resultado = -1, Mensaje = "La clave del proceso es obligatoria." };
            }

            if (string.IsNullOrEmpty(cleanNombre))
            {
                return new ProcesoResultDto { Resultado = -1, Mensaje = "El nombre del proceso es obligatorio." };
            }

            var duplicateExists = await _context.Procesos
                .AnyAsync(p => p.IdProceso != id &&
                               ((p.ClaveProceso != null && p.ClaveProceso.ToUpper() == cleanClave.ToUpper()) ||
                                (p.NombreProceso != null && p.NombreProceso.ToUpper() == cleanNombre.ToUpper())));

            if (duplicateExists)
            {
                return new ProcesoResultDto { Resultado = -1, Mensaje = "Ya existe otro proceso con esa clave o nombre." };
            }

            string? responsableNombre = null;
            if (request.IdEmpleadoResponsable.HasValue && request.IdEmpleadoResponsable.Value > 0)
            {
                var emp = await _context.Empleados.FirstOrDefaultAsync(e => e.IdEmpleado == request.IdEmpleadoResponsable.Value);
                if (emp != null)
                {
                    responsableNombre = emp.NombreEmpleado;
                }
            }

            proceso.ClaveProceso = cleanClave;
            proceso.NombreProceso = cleanNombre;
            proceso.IdEstatusProceso = request.IdEstatusProceso;
            proceso.IdEmpleadoResponsable = request.IdEmpleadoResponsable > 0 ? request.IdEmpleadoResponsable : null;
            if (responsableNombre != null) proceso.ResponsableProceso = responsableNombre;
            proceso.IdEmpleadoActualiza = userId;
            proceso.FechaActualiza = DateTime.Now;

            await _context.SaveChangesAsync();

            return new ProcesoResultDto
            {
                Resultado = proceso.IdProceso,
                Mensaje = "Proceso actualizado exitosamente."
            };
        }

        public async Task<ProcesoResultDto> DeleteAsync(int id, int userId)
        {
            var proceso = await _context.Procesos
                .Include(p => p.SubProcesos)
                .FirstOrDefaultAsync(p => p.IdProceso == id);

            if (proceso == null)
            {
                return new ProcesoResultDto { Resultado = -1, Mensaje = "Proceso no encontrado." };
            }

            _context.Procesos.Remove(proceso);
            await _context.SaveChangesAsync();

            return new ProcesoResultDto
            {
                Resultado = 1,
                Mensaje = "Proceso eliminado exitosamente."
            };
        }

        // SubProcesos
        public async Task<List<SubProcesoDto>> GetSubProcesosAsync(int idProceso)
        {
            return await _context.SubProcesos
                .Where(sp => sp.IdProceso == idProceso)
                .OrderBy(sp => sp.ClaveSubProceso)
                .Select(sp => new SubProcesoDto
                {
                    IdSubProceso = sp.IdSubProceso,
                    IdProceso = sp.IdProceso,
                    ClaveSubProceso = (sp.ClaveSubProceso ?? string.Empty).Trim(),
                    DescripcionSubProceso = (sp.DescripcionSubProceso ?? string.Empty).Trim()
                })
                .ToListAsync();
        }

        public async Task<SubProcesoDto?> GetSubProcesoByIdAsync(int idSubProceso)
        {
            var sp = await _context.SubProcesos.FirstOrDefaultAsync(s => s.IdSubProceso == idSubProceso);
            if (sp == null) return null;

            return new SubProcesoDto
            {
                IdSubProceso = sp.IdSubProceso,
                IdProceso = sp.IdProceso,
                ClaveSubProceso = (sp.ClaveSubProceso ?? string.Empty).Trim(),
                DescripcionSubProceso = (sp.DescripcionSubProceso ?? string.Empty).Trim()
            };
        }

        public async Task<SubProcesoResultDto> CreateSubProcesoAsync(CreateSubProcesoRequest request, int userId)
        {
            var cleanClave = request.ClaveSubProceso?.Trim() ?? string.Empty;
            var cleanDesc = request.DescripcionSubProceso?.Trim() ?? string.Empty;

            if (request.IdProceso <= 0)
            {
                return new SubProcesoResultDto { Resultado = -1, Mensaje = "Proceso inválido." };
            }

            if (string.IsNullOrEmpty(cleanClave))
            {
                return new SubProcesoResultDto { Resultado = -1, Mensaje = "La clave del subproceso es obligatoria." };
            }

            if (string.IsNullOrEmpty(cleanDesc))
            {
                return new SubProcesoResultDto { Resultado = -1, Mensaje = "La descripción del subproceso es obligatoria." };
            }

            var duplicateExists = await _context.SubProcesos
                .AnyAsync(s => s.IdProceso == request.IdProceso &&
                               s.ClaveSubProceso != null &&
                               s.ClaveSubProceso.ToUpper() == cleanClave.ToUpper());

            if (duplicateExists)
            {
                return new SubProcesoResultDto { Resultado = -1, Mensaje = "Ya existe un subproceso con esa clave en este proceso." };
            }

            var subProceso = new SubProceso
            {
                IdProceso = request.IdProceso,
                ClaveSubProceso = cleanClave,
                DescripcionSubProceso = cleanDesc,
                IdEmpleadoAlta = userId,
                FechaAlta = DateTime.Now
            };

            _context.SubProcesos.Add(subProceso);
            await _context.SaveChangesAsync();

            return new SubProcesoResultDto
            {
                Resultado = subProceso.IdSubProceso,
                Mensaje = "SubProceso creado exitosamente."
            };
        }

        public async Task<SubProcesoResultDto> UpdateSubProcesoAsync(int idSubProceso, UpdateSubProcesoRequest request, int userId)
        {
            var sp = await _context.SubProcesos.FirstOrDefaultAsync(s => s.IdSubProceso == idSubProceso);
            if (sp == null)
            {
                return new SubProcesoResultDto { Resultado = -1, Mensaje = "SubProceso no encontrado." };
            }

            var cleanClave = request.ClaveSubProceso?.Trim() ?? string.Empty;
            var cleanDesc = request.DescripcionSubProceso?.Trim() ?? string.Empty;

            if (string.IsNullOrEmpty(cleanClave))
            {
                return new SubProcesoResultDto { Resultado = -1, Mensaje = "La clave del subproceso es obligatoria." };
            }

            if (string.IsNullOrEmpty(cleanDesc))
            {
                return new SubProcesoResultDto { Resultado = -1, Mensaje = "La descripción del subproceso es obligatoria." };
            }

            var duplicateExists = await _context.SubProcesos
                .AnyAsync(s => s.IdSubProceso != idSubProceso &&
                               s.IdProceso == sp.IdProceso &&
                               s.ClaveSubProceso != null &&
                               s.ClaveSubProceso.ToUpper() == cleanClave.ToUpper());

            if (duplicateExists)
            {
                return new SubProcesoResultDto { Resultado = -1, Mensaje = "Ya existe otro subproceso con esa clave en este proceso." };
            }

            sp.ClaveSubProceso = cleanClave;
            sp.DescripcionSubProceso = cleanDesc;
            sp.IdEmpleadoActualiza = userId;
            sp.FechaActualiza = DateTime.Now;

            await _context.SaveChangesAsync();

            return new SubProcesoResultDto
            {
                Resultado = sp.IdSubProceso,
                Mensaje = "SubProceso actualizado exitosamente."
            };
        }

        public async Task<SubProcesoResultDto> DeleteSubProcesoAsync(int idSubProceso, int userId)
        {
            var sp = await _context.SubProcesos.FirstOrDefaultAsync(s => s.IdSubProceso == idSubProceso);
            if (sp == null)
            {
                return new SubProcesoResultDto { Resultado = -1, Mensaje = "SubProceso no encontrado." };
            }

            _context.SubProcesos.Remove(sp);
            await _context.SaveChangesAsync();

            return new SubProcesoResultDto
            {
                Resultado = 1,
                Mensaje = "SubProceso eliminado exitosamente."
            };
        }
    }
}
