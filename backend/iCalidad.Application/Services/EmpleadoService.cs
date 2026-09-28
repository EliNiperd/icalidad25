using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using iCalidad.Application.Common.Interfaces;
using iCalidad.Application.DTOs;
using iCalidad.Domain.Entities;

namespace iCalidad.Application.Services
{
    public class EmpleadoService : IEmpleadoService
    {
        private readonly IApplicationDbContext _context;

        public EmpleadoService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<EmpleadoDto>> GetPagedAsync(
            string? searchQuery,
            int pageNumber,
            int pageSize,
            string? sortBy,
            string? sortOrder)
        {
            var query = _context.Empleados
                .Include(e => e.EmpleadosPuestos)
                    .ThenInclude(ep => ep.Puesto)
                .Include(e => e.EmpleadosRoles)
                    .ThenInclude(er => er.Rol)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                var search = searchQuery.Trim().ToUpper();
                var searchIsActivo = "ACTIVO".Contains(search);
                var searchIsInactivo = "INACTIVO".Contains(search);

                query = query.Where(e =>
                    (e.NombreEmpleado != null && e.NombreEmpleado.ToUpper().Contains(search)) ||
                    (e.UserName != null && e.UserName.ToUpper().Contains(search)) ||
                    (e.Correo != null && e.Correo.ToUpper().Contains(search)) ||
                    (e.EmpleadosPuestos.Any(ep => ep.Puesto != null && ep.Puesto.NombrePuesto != null && ep.Puesto.NombrePuesto.ToUpper().Contains(search))) ||
                    (searchIsActivo && e.IdEstatusEmpleado) ||
                    (searchIsInactivo && !e.IdEstatusEmpleado));
            }

            var totalRecords = await query.CountAsync();

            var isDescending = string.Equals(sortOrder, "DESC", StringComparison.OrdinalIgnoreCase);
            var sortField = sortBy?.Trim() ?? "NombreEmpleado";

            query = sortField.ToLower() switch
            {
                "username" => isDescending ? query.OrderByDescending(e => e.UserName) : query.OrderBy(e => e.UserName),
                "correo" => isDescending ? query.OrderByDescending(e => e.Correo) : query.OrderBy(e => e.Correo),
                "idestatusempleado" => isDescending ? query.OrderByDescending(e => e.IdEstatusEmpleado) : query.OrderBy(e => e.IdEstatusEmpleado),
                "fechaalta" => isDescending ? query.OrderByDescending(e => e.FechaAlta) : query.OrderBy(e => e.FechaAlta),
                _ => isDescending ? query.OrderByDescending(e => e.NombreEmpleado) : query.OrderBy(e => e.NombreEmpleado)
            };

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = items.Select(e => new EmpleadoDto
            {
                IdEmpleado = e.IdEmpleado,
                NombreEmpleado = e.NombreEmpleado,
                UserName = e.UserName,
                Password = e.Password,
                Correo = e.Correo,
                IdEstatusEmpleado = e.IdEstatusEmpleado,
                FechaAlta = e.FechaAlta,
                Puestos = e.EmpleadosPuestos
                    .Where(ep => ep.Puesto != null)
                    .Select(ep => new PuestoAsignadoDto
                    {
                        IdPuesto = ep.IdPuesto,
                        NombrePuesto = ep.Puesto.NombrePuesto ?? string.Empty,
                        FechaAsignacion = e.FechaAlta ?? DateTime.Now
                    }).ToList(),
                Roles = e.EmpleadosRoles
                    .Where(er => er.Rol != null)
                    .Select(er => new RolAsignadoDto
                    {
                        IdRol = er.IdRol,
                        NombreRol = er.Rol.NombreRol
                    }).ToList()
            }).ToList();

            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

            return new PagedResult<EmpleadoDto>
            {
                Items = dtos,
                TotalRecords = totalRecords,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = totalPages
            };
        }

        public async Task<List<EmpleadoListItemDto>> GetActiveListAsync()
        {
            return await _context.Empleados
                .Where(e => e.IdEstatusEmpleado)
                .OrderBy(e => e.NombreEmpleado)
                .Select(e => new EmpleadoListItemDto
                {
                    IdEmpleado = e.IdEmpleado,
                    NombreEmpleado = e.NombreEmpleado,
                    UserName = e.UserName,
                    Correo = e.Correo,
                    IdEstatusEmpleado = e.IdEstatusEmpleado
                })
                .ToListAsync();
        }

        public async Task<EmpleadoDto?> GetByIdAsync(int id)
        {
            var empleado = await _context.Empleados
                .Include(e => e.EmpleadosPuestos)
                    .ThenInclude(ep => ep.Puesto)
                .Include(e => e.EmpleadosRoles)
                    .ThenInclude(er => er.Rol)
                .FirstOrDefaultAsync(e => e.IdEmpleado == id);

            if (empleado == null) return null;

            return new EmpleadoDto
            {
                IdEmpleado = empleado.IdEmpleado,
                NombreEmpleado = empleado.NombreEmpleado,
                UserName = empleado.UserName,
                Password = empleado.Password,
                Correo = empleado.Correo,
                IdEstatusEmpleado = empleado.IdEstatusEmpleado,
                FechaAlta = empleado.FechaAlta,
                Puestos = empleado.EmpleadosPuestos
                    .Where(ep => ep.Puesto != null)
                    .Select(ep => new PuestoAsignadoDto
                    {
                        IdPuesto = ep.IdPuesto,
                        NombrePuesto = ep.Puesto.NombrePuesto ?? string.Empty,
                        FechaAsignacion = empleado.FechaAlta ?? DateTime.Now
                    }).ToList(),
                Roles = empleado.EmpleadosRoles
                    .Where(er => er.Rol != null)
                    .Select(er => new RolAsignadoDto
                    {
                        IdRol = er.IdRol,
                        NombreRol = er.Rol.NombreRol
                    }).ToList()
            };
        }

        public async Task<List<PuestoAsignadoDto>> GetPuestosByEmpleadoAsync(int idEmpleado)
        {
            return await _context.EmpleadosPuestos
                .Where(ep => ep.IdEmpleado == idEmpleado)
                .Include(ep => ep.Puesto)
                .Select(ep => new PuestoAsignadoDto
                {
                    IdPuesto = ep.IdPuesto,
                    NombrePuesto = ep.Puesto.NombrePuesto ?? string.Empty,
                    FechaAsignacion = DateTime.Now
                })
                .ToListAsync();
        }

        public async Task<List<RolAsignadoDto>> GetRolesByEmpleadoAsync(int idEmpleado)
        {
            return await _context.EmpleadosRoles
                .Where(er => er.IdEmpleado == idEmpleado)
                .Include(er => er.Rol)
                .Select(er => new RolAsignadoDto
                {
                    IdRol = er.IdRol,
                    NombreRol = er.Rol.NombreRol
                })
                .ToListAsync();
        }

        public async Task<EmpleadoResultDto> CreateAsync(CreateEmpleadoRequest request, int userId)
        {
            var cleanNombre = request.NombreEmpleado?.Trim() ?? string.Empty;
            var cleanUserName = request.UserName?.Trim() ?? string.Empty;

            if (string.IsNullOrWhiteSpace(cleanNombre))
            {
                return new EmpleadoResultDto { Resultado = -1, Mensaje = "El nombre del empleado es requerido." };
            }

            if (string.IsNullOrWhiteSpace(cleanUserName))
            {
                return new EmpleadoResultDto { Resultado = -1, Mensaje = "El nombre de usuario es requerido." };
            }

            // Validar unicidad de UserName
            var userExists = await _context.Empleados
                .AnyAsync(e => e.UserName.ToUpper() == cleanUserName.ToUpper());

            if (userExists)
            {
                return new EmpleadoResultDto { Resultado = -1, Mensaje = "Ya existe un empleado con ese nombre de usuario." };
            }

            var empleado = new Empleado
            {
                NombreEmpleado = cleanNombre,
                UserName = cleanUserName,
                Password = request.Password?.Trim() ?? string.Empty,
                Correo = request.Correo?.Trim(),
                IdEstatusEmpleado = request.IdEstatusEmpleado,
                FechaAlta = DateTime.Now,
                IdEmpleadoAlta = userId
            };

            // Asignar puestos
            if (request.IdPuestos != null)
            {
                foreach (var idPuesto in request.IdPuestos.Distinct())
                {
                    empleado.EmpleadosPuestos.Add(new EmpleadoPuesto
                    {
                        Empleado = empleado,
                        IdPuesto = idPuesto
                    });
                }
            }

            // Asignar roles
            if (request.IdRoles != null)
            {
                foreach (var idRol in request.IdRoles.Distinct())
                {
                    empleado.EmpleadosRoles.Add(new EmpleadoRol
                    {
                        Empleado = empleado,
                        IdRol = idRol
                    });
                }
            }

            _context.Empleados.Add(empleado);
            await _context.SaveChangesAsync();

            return new EmpleadoResultDto
            {
                Resultado = empleado.IdEmpleado,
                IdEmpleado = empleado.IdEmpleado,
                Mensaje = "Empleado creado exitosamente con sus puestos y roles asignados."
            };
        }

        public async Task<EmpleadoResultDto> UpdateAsync(int id, UpdateEmpleadoRequest request, int userId)
        {
            var empleado = await _context.Empleados
                .Include(e => e.EmpleadosPuestos)
                .Include(e => e.EmpleadosRoles)
                .FirstOrDefaultAsync(e => e.IdEmpleado == id);

            if (empleado == null)
            {
                return new EmpleadoResultDto { Resultado = -1, Mensaje = "Empleado no encontrado." };
            }

            var cleanNombre = request.NombreEmpleado?.Trim() ?? string.Empty;
            var cleanUserName = request.UserName?.Trim() ?? string.Empty;

            if (string.IsNullOrWhiteSpace(cleanNombre))
            {
                return new EmpleadoResultDto { Resultado = -1, Mensaje = "El nombre del empleado es requerido." };
            }

            if (string.IsNullOrWhiteSpace(cleanUserName))
            {
                return new EmpleadoResultDto { Resultado = -1, Mensaje = "El nombre de usuario es requerido." };
            }

            // Validar unicidad de UserName excluyendo el empleado actual
            var duplicateUser = await _context.Empleados
                .AnyAsync(e => e.IdEmpleado != id && e.UserName.ToUpper() == cleanUserName.ToUpper());

            if (duplicateUser)
            {
                return new EmpleadoResultDto { Resultado = -1, Mensaje = "Ya existe otro empleado con ese nombre de usuario." };
            }

            empleado.NombreEmpleado = cleanNombre;
            empleado.UserName = cleanUserName;
            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                empleado.Password = request.Password.Trim();
            }
            empleado.Correo = request.Correo?.Trim();
            empleado.IdEstatusEmpleado = request.IdEstatusEmpleado;
            empleado.FechaActualiza = DateTime.Now;
            empleado.IdEmpleadoActualiza = userId;

            // Sincronizar puestos (comparación diferencial)
            var targetPuestos = (request.IdPuestos ?? new List<int>()).Distinct().ToList();
            var currentPuestos = empleado.EmpleadosPuestos.Select(ep => ep.IdPuesto).ToList();

            var puestosToRemove = empleado.EmpleadosPuestos.Where(ep => !targetPuestos.Contains(ep.IdPuesto)).ToList();
            foreach (var toRemove in puestosToRemove)
            {
                _context.EmpleadosPuestos.Remove(toRemove);
            }

            var puestosToAdd = targetPuestos.Where(pId => !currentPuestos.Contains(pId)).ToList();
            foreach (var toAdd in puestosToAdd)
            {
                empleado.EmpleadosPuestos.Add(new EmpleadoPuesto
                {
                    IdEmpleado = id,
                    IdPuesto = toAdd
                });
            }

            // Sincronizar roles (comparación diferencial)
            var targetRoles = (request.IdRoles ?? new List<int>()).Distinct().ToList();
            var currentRoles = empleado.EmpleadosRoles.Select(er => er.IdRol).ToList();

            var rolesToRemove = empleado.EmpleadosRoles.Where(er => !targetRoles.Contains(er.IdRol)).ToList();
            foreach (var toRemove in rolesToRemove)
            {
                _context.EmpleadosRoles.Remove(toRemove);
            }

            var rolesToAdd = targetRoles.Where(rId => !currentRoles.Contains(rId)).ToList();
            foreach (var toAdd in rolesToAdd)
            {
                empleado.EmpleadosRoles.Add(new EmpleadoRol
                {
                    IdEmpleado = id,
                    IdRol = toAdd
                });
            }

            await _context.SaveChangesAsync();

            return new EmpleadoResultDto
            {
                Resultado = empleado.IdEmpleado,
                IdEmpleado = empleado.IdEmpleado,
                Mensaje = "Empleado actualizado exitosamente."
            };
        }

        public async Task<EmpleadoResultDto> DeleteAsync(int id, int userId)
        {
            var empleado = await _context.Empleados
                .Include(e => e.EmpleadosPuestos)
                .Include(e => e.EmpleadosRoles)
                .FirstOrDefaultAsync(e => e.IdEmpleado == id);

            if (empleado == null)
            {
                return new EmpleadoResultDto { Resultado = -1, Mensaje = "Empleado no encontrado." };
            }

            // Al eliminar el empleado, las relaciones en cascada limpian EmpleadosPuestos y EmpleadosRoles
            _context.Empleados.Remove(empleado);
            await _context.SaveChangesAsync();

            return new EmpleadoResultDto
            {
                Resultado = 1,
                Mensaje = "Empleado eliminado exitosamente."
            };
        }
    }
}
