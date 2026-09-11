# Changelog

All notable changes to the `icalidad25` project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Migration of Módulo 2: Departamentos (`/icalidad/departamento`) to .NET 9 WebAPI & EF Core.
- Migration of Módulo 3: Puestos (`/icalidad/puesto`).
- Migration of Módulo 4: Empleados (`/icalidad/empleado`).
- Migration of Módulo 5: Normativas y Requisitos.
- Migration of Módulo 6: Procesos y Sub-Procesos.

## [1.2.0] - 2026-09-11

### Added
- **Fase 5 - Módulo 1: Catálogo de Gerencias (`/icalidad/gerencia`)**:
  - **Clean Architecture (.NET 9 WebAPI & EF Core)**:
    - Domain: Created `Gerencia` and `Departamento` entities with audit properties.
    - Infrastructure: Implemented Fluent API mapping in `GerenciaConfiguration` and `DepartamentoConfiguration` to `Gen_TGerencia` and `Gen_TDepartamento`.
    - Application: Created `GerenciaDtos`, `IGerenciaService` interface, and `GerenciaService` implementing search filtering, dynamic ordering, pagination, uniqueness validation, and referential integrity verification (`BorrarGerencia: 'NoBorrar'`).
    - WebAPI: Developed `GerenciasController` (`GET /api/gerencias`, `GET /api/gerencias/list`, `GET /api/gerencias/{id}`, `POST /api/gerencias`, `PUT /api/gerencias/{id}`, `DELETE /api/gerencias/{id}`) protected by `[Authorize]`.
  - **Frontend SOLID Compliance & Decoupling**:
    - Refactored `frontend/lib/data/gerencias.ts` to fully eliminate direct database/Stored Procedure calls (`PF_Gen_TGerencia`, `PFK_Gen_TGerencia`, `PI_Gen_TGerencia`, `PU_Gen_TGerencia`, `PD_Gen_TGerencia`), delegating all operations to `apiFetch` against `/api/gerencias` with automatic JWT Bearer token propagation.
    - Verified Gerencias UI components (`page.tsx`, `gerencias-table.tsx`, `gerencia-table-wrapper.tsx`, `gerencia-actions.tsx`, `create-edit-form.tsx`) for strict adherence to SOLID design principles (SRP, OCP, LSP, ISP, DIP).

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
