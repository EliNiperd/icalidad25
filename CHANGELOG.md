# Changelog

All notable changes to the `icalidad25` project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial C# / .NET 9 backend solution (`iCalidad.sln`) with Clean Architecture project structure: `Domain`, `Application`, `Infrastructure`, and `WebAPI`.
- Setup of a database query CLI utility (`scripts/db-query.js`) to execute queries against the SQL Server instance from the local Windows environment.
- Configured SSH passwordless access key setup from Windows 11 laptop to VPS for `icalidad-user`.
- Setup and deployment of Microsoft SQL Server 2022 Developer edition container on the VPS via Docker Compose.
- Successful restoration of database backup (`28-ago-25-iCalidad.bak`) onto the Docker MSSQL instance, resolving logical file redirection for Linux directories.

### Planned
- Migration/Upgrade of the frontend to **Next.js 16.3.3** for faster builds and improved TypeScript support.
- Integration of Entity Framework Core in the `iCalidad.Infrastructure` project.
- Implementation of the first API module: Security and Authentication (migrating from `usp_AuthenticateUser`).
- Implementation of the Requisitos CRUD module (linked with Normativas).
- Realization of missing database Stored Procedures (e.g., for Puestos) and integration with the corresponding React tables.
