# Changelog

All notable changes to the `icalidad25` project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Migration of Módulo 5: Normativas y Requisitos (`/icalidad/normativa`, `/icalidad/requisito`).
- Migration of Módulo 6: Procesos y Sub-Procesos (`/icalidad/proceso`).

## [1.5.0] - 2026-09-28

### Added
- **Fase 5 - Módulo 4: Catálogo de Empleados, Puestos Asignados y Roles (`/icalidad/empleado`)**:
  - **Backend (.NET 9 WebAPI & EF Core)**:
    - Domain: Entidad `Empleado` enriquecida con auditoría completa y propiedades de navegación; nueva entidad de relación `EmpleadoPuesto` (`Gen_REmpleadoPuesto`); soporte para `IdEstatusRol` en `Rol`.
    - Infrastructure: Mapeos Fluent API en `EmpleadoConfiguration` con `tb.UseSqlOutputClause(false)`, `EmpleadoPuestoConfiguration` con clave compuesta e `IdEstatusRol` en `RolConfiguration`. Registro en `ApplicationDbContext`.
    - Application: DTOs en `EmpleadoDtos.cs`, contrato `IEmpleadoService` e implementación `EmpleadoService` con búsqueda integral, paginación, validación de unicidad de `UserName`, y sincronización diferencial transaccional automática de puestos y roles.
    - WebAPI: Controlador `EmpleadosController` (`GET /api/empleados`, `GET /api/empleados/list`, `GET /api/empleados/{id}`, `GET /api/empleados/{id}/puestos`, `GET /api/empleados/{id}/roles`, `POST /api/empleados`, `PUT /api/empleados/{id}`, `DELETE /api/empleados/{id}`) protegido con `[Authorize]` y extracción de claims JWT. Controlador `RolesController` (`GET /api/roles/list`).
  - **Pruebas Unitarias Automatizadas**:
    - `EmpleadoServiceTests` en `iCalidad.UnitTests` con 6 casos de prueba completos (creación, unicidad de usuario, sincronización diferencial de puestos/roles, consultas de sub-recursos y eliminación en cascada). 26/26 pruebas unitarias exitosas (100% passed).
  - **Frontend (Next.js 16)**:
    - Refactorización de `frontend/lib/data/empleados.ts` y `frontend/lib/data/roles.ts`, eliminando todas las conexiones directas a `mssql`, SPs (`PF_Gen_TEmpleado`, `PI_Gen_TEmpleado`, `PU_Gen_TEmpleado`, `PD_Gen_TEmpleado`, `PF_Gen_REmpleadoRol`) y consultas SQL cliente (`asignarPuestos`, `removerPuestos`, `asignarRoles`, `removerRoles`).
    - Delegación total de persistencia y lógica de asignaciones a través de `apiFetch` hacia la WebAPI.

## [1.4.0] - 2026-09-27

### Added
- **Fase 5 - Módulos 2 y 3: Catálogo de Departamentos y Puestos**:
  - Migración completa de Departamentos y Puestos a .NET 9 WebAPI y EF Core con consultas LINQ y pruebas unitarias integradas.
  - Implementación de `BearerSecuritySchemeTransformer` para habilitar autenticación Bearer JWT en la documentación interactiva Scalar OpenAPI (`/scalar/v1`).
- **Mejoras UX & Foco en Filtrado de Tablas**:
  - Corrección de pérdida de foco en cajas de texto de búsqueda de tablas al optimizar límites `<Suspense>` y transición no bloqueante en `DataTable`.

### Added
- **Fase 5 - Módulo 1: Catálogo de Gerencias (`/icalidad/gerencia`)**:
  - **Clean Architecture (.NET 9 WebAPI & EF Core)**:
    - Domain: Created `Gerencia` and `Departamento` entities with audit and null-safe properties.
    - Infrastructure: Implemented Fluent API mapping in `GerenciaConfiguration` and `DepartamentoConfiguration` to `Gen_TGerencia` and `Gen_TDepartamento`.
    - Application: Created `GerenciaDtos`, `IGerenciaService` interface, and `GerenciaService` implementing search filtering, dynamic ordering, pagination, uniqueness validation, and referential integrity verification (`BorrarGerencia: 'NoBorrar'`).
    - WebAPI: Developed `GerenciasController` (`GET /api/gerencias`, `GET /api/gerencias/list`, `GET /api/gerencias/{id}`, `POST /api/gerencias`, `PUT /api/gerencias/{id}`, `DELETE /api/gerencias/{id}`) protected by `[Authorize]` with safe audit extraction.
  - **Frontend SOLID Compliance & Decoupling**:
    - Refactored `frontend/lib/data/gerencias.ts` to fully eliminate direct database/Stored Procedure calls (`PF_Gen_TGerencia`, `PFK_Gen_TGerencia`, `PI_Gen_TGerencia`, `PU_Gen_TGerencia`, `PD_Gen_TGerencia`), delegating all operations to `apiFetch` against `/api/gerencias` with automatic JWT Bearer token propagation.
    - Verified Gerencias UI components (`page.tsx`, `gerencias-table.tsx`, `gerencia-table-wrapper.tsx`, `gerencia-actions.tsx`, `create-edit-form.tsx`) for strict adherence to SOLID design principles (SRP, OCP, LSP, ISP, DIP).
    - Added interactive tooltip on disabled delete action when a gerencia has linked departments (`BorrarGerencia: 'NoBorrar'`).

### Fixed & Security
- **Security Vulnerability Remediation**:
  - Upgraded Next.js to **`16.3.5`** alongside React 19 and configured transitive dependency overrides.
  - Resolved all 27 vulnerabilities reported by `pnpm audit` (audit result: **0 known vulnerabilities**).
- **Backend JSON Serialization & Error Handling**:
  - Configured ASP.NET Core JSON serializer to preserve **PascalCase** naming policy (`PropertyNamingPolicy = null`).
  - Added Global Exception Handling Middleware in WebAPI providing structured JSON diagnostics on unhandled exceptions.
  - Added `tb.UseSqlOutputClause(false)` in EF Core entity configurations to ensure full compatibility with SQL Server tables containing database triggers.
  - Added null safety across entity properties and LINQ queries to prevent `Data is Null` exceptions on legacy database records.

## [1.1.0] - 2026-09-10

### Added
- **Dynamic Menu Migration to .NET WebAPI & EF Core**:
  - Implemented `Menu` domain entity and Fluent API mapping (`Gen_TMenu`) in `iCalidad.Infrastructure`.
  - Created `MenuService` and `IMenuService` in `iCalidad.Application` to retrieve dynamic menu items filtered by the authenticated employee's roles.
  - Implemented `MenuController` (`GET /api/menu`) with JWT Bearer token claims-based authentication (`[Authorize]`).
  - Migrated frontend dynamic navigation (`frontend/lib/data/menu.ts` and `frontend/app/icalidad/layout.tsx`) to consume the REST API via `apiFetch`.
  - Added robust error handling and fallback support during navigation menu rendering.
- **Security & Authentication Module**:
  - Full JWT authentication flow with claims extraction and role authorization.
  - Integration of NextAuth with .NET backend `/api/auth/login`.
  - Centralized API client `apiFetch` with automatic JWT Bearer token propagation.
- **Docker & Infrastructure Pipeline**:
  - Dockerized full-stack deployment pipeline with Nginx reverse proxy routing `/api/` to backend and `/` to frontend.
  - Production containerization fixes eliminating host-dependent mount paths.

## [1.0.0] - 2026-09-10

### Added
- Restructured workspace into `/frontend` (Next.js) and `/backend` (C# .NET) directories.
- Initial C# / .NET 9 backend solution (`iCalidad.sln`) with Clean Architecture project structure: `Domain`, `Application`, `Infrastructure`, and `WebAPI`.
- Integration of Entity Framework Core in the `iCalidad.Infrastructure` project.
- Setup of a database query CLI utility (`scripts/db-query.js`).
- Setup and deployment of Microsoft SQL Server 2022 Developer edition container on the VPS via Docker Compose.
- Successful restoration of database backup (`28-ago-25-iCalidad.bak`).
