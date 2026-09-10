# Changelog

All notable changes to the `icalidad25` project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Migration/Upgrade of the frontend to **Next.js 16.3.3** for faster builds and improved TypeScript support.
- Implementation of the Requisitos CRUD module (linked with Normativas).
- Realization of missing database Stored Procedures (e.g., for Puestos) and integration with the corresponding React tables.

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
