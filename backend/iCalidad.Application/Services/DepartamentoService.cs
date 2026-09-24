using Microsoft.EntityFrameworkCore;
using iCalidad.Application.Common.Interfaces;
using iCalidad.Application.DTOs;
using iCalidad.Domain.Entities;

namespace iCalidad.Application.Services
{
    public class DepartamentoService : IDepartamentoService
    {
        private readonly IApplicationDbContext _context;

        public DepartamentoService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<DepartamentoDto>> GetPagedAsync(
            string? searchQuery,
            int pageNumber,
            int pageSize,
            string? sortBy,
            string? sortOrder)
        {
            var query = _context.Departamentos
                .Include(d => d.Gerencia)
                .Where(d => d.FechaBorrado == null)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                var search = searchQuery.Trim().ToUpper();
                var searchIsActivo = "ACTIVO".Contains(search);
                var searchIsInactivo = "INACTIVO".Contains(search);

                query = query.Where(d =>
                    (d.ClaveDepartamento != null && d.ClaveDepartamento.ToUpper().Contains(search)) ||
                    (d.NombreDepartamento != null && d.NombreDepartamento.ToUpper().Contains(search)) ||
                    (d.Gerencia != null && d.Gerencia.NombreGerencia != null && d.Gerencia.NombreGerencia.ToUpper().Contains(search)) ||
                    (searchIsActivo && d.IdEstatusDepartamento) ||
                    (searchIsInactivo && !d.IdEstatusDepartamento));
            }

            var totalRecords = await query.CountAsync();

            var isDescending = string.Equals(sortOrder, "DESC", StringComparison.OrdinalIgnoreCase);
            var sortField = sortBy?.Trim() ?? "NombreDepartamento";

            query = sortField.ToLower() switch
            {
                "clavedepartamento" => isDescending ? query.OrderByDescending(d => d.ClaveDepartamento) : query.OrderBy(d => d.ClaveDepartamento),
                "idestatusdepartamento" => isDescending ? query.OrderByDescending(d => d.IdEstatusDepartamento) : query.OrderBy(d => d.IdEstatusDepartamento),
                "nombregerencia" => isDescending ? query.OrderByDescending(d => d.Gerencia != null ? d.Gerencia.NombreGerencia : "") : query.OrderBy(d => d.Gerencia != null ? d.Gerencia.NombreGerencia : ""),
                _ => isDescending ? query.OrderByDescending(d => d.NombreDepartamento) : query.OrderBy(d => d.NombreDepartamento)
            };

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = items.Select(d => new DepartamentoDto
            {
                IdDepartamento = d.IdDepartamento,
                ClaveDepartamento = (d.ClaveDepartamento ?? string.Empty).Trim(),
                NombreDepartamento = (d.NombreDepartamento ?? string.Empty).Trim(),
                IdGerencia = d.IdGerencia,
                NombreGerencia = d.Gerencia?.NombreGerencia?.Trim() ?? string.Empty,
                IdEstatusDepartamento = d.IdEstatusDepartamento,
                BorrarDepartamento = string.Empty
            }).ToList();

            var totalPages = pageSize > 0 ? (int)Math.Ceiling(totalRecords / (double)pageSize) : 0;

            return new PagedResult<DepartamentoDto>
            {
                Items = dtos,
                TotalRecords = totalRecords,
                TotalPages = totalPages,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<List<DepartamentoSimpleDto>> GetActiveListAsync(int? idGerencia = null)
        {
            var query = _context.Departamentos
                .Where(d => d.IdEstatusDepartamento && d.FechaBorrado == null);

            if (idGerencia.HasValue && idGerencia.Value > 0)
            {
                query = query.Where(d => d.IdGerencia == idGerencia.Value);
            }

            return await query
                .OrderBy(d => d.NombreDepartamento)
                .Select(d => new DepartamentoSimpleDto
                {
                    IdDepartamento = d.IdDepartamento,
                    NombreDepartamento = (d.NombreDepartamento ?? string.Empty).Trim(),
                    IdGerencia = d.IdGerencia
                })
                .ToListAsync();
        }

        public async Task<DepartamentoDto?> GetByIdAsync(int id)
        {
            var depto = await _context.Departamentos
                .Include(d => d.Gerencia)
                .FirstOrDefaultAsync(d => d.IdDepartamento == id && d.FechaBorrado == null);

            if (depto == null) return null;

            return new DepartamentoDto
            {
                IdDepartamento = depto.IdDepartamento,
                ClaveDepartamento = (depto.ClaveDepartamento ?? string.Empty).Trim(),
                NombreDepartamento = (depto.NombreDepartamento ?? string.Empty).Trim(),
                IdGerencia = depto.IdGerencia,
                NombreGerencia = depto.Gerencia?.NombreGerencia?.Trim() ?? string.Empty,
                IdEstatusDepartamento = depto.IdEstatusDepartamento
            };
        }

        public async Task<DepartamentoResultDto> CreateAsync(CreateDepartamentoRequest request, int userId)
        {
            var cleanClave = request.ClaveDepartamento?.Trim() ?? string.Empty;
            var cleanNombre = request.NombreDepartamento?.Trim() ?? string.Empty;

            if (string.IsNullOrEmpty(cleanClave) || string.IsNullOrEmpty(cleanNombre))
            {
                return new DepartamentoResultDto
                {
                    Resultado = -1,
                    Mensaje = "La clave y el nombre del departamento son obligatorios."
                };
            }

            if (request.IdGerencia <= 0)
            {
                return new DepartamentoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Debe seleccionar una gerencia válida."
                };
            }

            var gerenciaExists = await _context.Gerencias
                .AnyAsync(g => g.IdGerencia == request.IdGerencia && g.IdEstatusGerencia && g.FechaBorrado == null);

            if (!gerenciaExists)
            {
                return new DepartamentoResultDto
                {
                    Resultado = -1,
                    Mensaje = "La gerencia seleccionada no existe o no está activa."
                };
            }

            var duplicateExists = await _context.Departamentos
                .AnyAsync(d => d.IdEstatusDepartamento && d.FechaBorrado == null &&
                    ((d.ClaveDepartamento != null && d.ClaveDepartamento.ToUpper() == cleanClave.ToUpper()) ||
                     (d.NombreDepartamento != null && d.NombreDepartamento.ToUpper() == cleanNombre.ToUpper())));

            if (duplicateExists)
            {
                return new DepartamentoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Ya existe un departamento con la misma clave o nombre."
                };
            }

            var depto = new Departamento
            {
                ClaveDepartamento = cleanClave,
                NombreDepartamento = cleanNombre,
                IdGerencia = request.IdGerencia,
                IdEstatusDepartamento = true,
                IdEmpleadoAlta = userId,
                FechaAlta = DateTime.Now
            };

            _context.Departamentos.Add(depto);
            await _context.SaveChangesAsync();

            return new DepartamentoResultDto
            {
                Resultado = depto.IdDepartamento,
                Mensaje = "Creación exitosa"
            };
        }

        public async Task<DepartamentoResultDto> UpdateAsync(int id, UpdateDepartamentoRequest request, int userId)
        {
            var depto = await _context.Departamentos
                .FirstOrDefaultAsync(d => d.IdDepartamento == id && d.FechaBorrado == null);

            if (depto == null)
            {
                return new DepartamentoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Departamento no encontrado."
                };
            }

            var cleanClave = request.ClaveDepartamento?.Trim() ?? string.Empty;
            var cleanNombre = request.NombreDepartamento?.Trim() ?? string.Empty;

            if (string.IsNullOrEmpty(cleanClave) || string.IsNullOrEmpty(cleanNombre))
            {
                return new DepartamentoResultDto
                {
                    Resultado = -1,
                    Mensaje = "La clave y el nombre del departamento son obligatorios."
                };
            }

            if (request.IdGerencia <= 0)
            {
                return new DepartamentoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Debe seleccionar una gerencia válida."
                };
            }

            var gerenciaExists = await _context.Gerencias
                .AnyAsync(g => g.IdGerencia == request.IdGerencia && g.IdEstatusGerencia && g.FechaBorrado == null);

            if (!gerenciaExists)
            {
                return new DepartamentoResultDto
                {
                    Resultado = -1,
                    Mensaje = "La gerencia seleccionada no existe o no está activa."
                };
            }

            var duplicateExists = await _context.Departamentos
                .AnyAsync(d => d.IdDepartamento != id && d.FechaBorrado == null &&
                    ((d.ClaveDepartamento != null && d.ClaveDepartamento.ToUpper() == cleanClave.ToUpper()) ||
                     (d.NombreDepartamento != null && d.NombreDepartamento.ToUpper() == cleanNombre.ToUpper())));

            if (duplicateExists)
            {
                return new DepartamentoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Ya existe un departamento con la misma clave o nombre."
                };
            }

            depto.ClaveDepartamento = cleanClave;
            depto.NombreDepartamento = cleanNombre;
            depto.IdGerencia = request.IdGerencia;
            depto.IdEstatusDepartamento = request.IdEstatusDepartamento;
            depto.IdEmpleadoActualiza = userId;
            depto.FechaActualiza = DateTime.Now;

            await _context.SaveChangesAsync();

            return new DepartamentoResultDto
            {
                Resultado = depto.IdDepartamento,
                Mensaje = "Actualización exitosa"
            };
        }

        public async Task<DepartamentoResultDto> DeleteAsync(int id, int userId)
        {
            var depto = await _context.Departamentos
                .FirstOrDefaultAsync(d => d.IdDepartamento == id && d.FechaBorrado == null);

            if (depto == null)
            {
                return new DepartamentoResultDto
                {
                    Resultado = -1,
                    Mensaje = "Departamento no encontrado."
                };
            }

            // Eliminación física consistente con PD_Gen_TDepartamento
            _context.Departamentos.Remove(depto);
            await _context.SaveChangesAsync();

            return new DepartamentoResultDto
            {
                Resultado = 1,
                Mensaje = "Eliminación exitosa"
            };
        }
    }
}
