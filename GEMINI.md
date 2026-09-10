# Historial de Desarrollo con Gemini CLI

Este documento resume las interacciones y cambios realizados en el proyecto `icalidad25` con la asistencia de Gemini CLI.

## 1. Solución de Errores Iniciales de Configuración

...

## 4. Catálogo de Gerencias (`/icalidad/gerencia`)

...

## 5. Catálogos Adicionales (Departamentos, Puestos, Empleados, Normativas)

### Problema Original
Implementar los CRUD completos para los catálogos de Departamentos, Puestos, Empleados y Normativas, siguiendo la arquitectura establecida con el CRUD de Gerencias.

### Acciones Realizadas
-   **Arquitectura Replicada:** Para cada catálogo, se ha seguido el patrón de crear un esquema Zod, funciones de acceso a datos (Server Actions), componentes de UI (tabla, formulario, acciones) y páginas de ruteo (`/icalidad/[catalogo]`).
-   **Formularios con Relaciones:** Se implementaron formularios que manejan relaciones de maestro-detalle, como el `select` de Gerencias en el formulario de Departamentos, y el selector de Puestos en el de Empleados.
-   **Integración de Auditoría:** Las funciones de creación y actualización (`create...`, `update...`) se modificaron para obtener el ID del usuario de la sesión de NextAuth y pasarlo a los Stored Procedures para los campos de auditoría (`IdEmpleadoAlta`, `IdEmpleadoActualiza`).
-   **Depuración y Corrección:** Se solucionaron diversos problemas relacionados con la implementación de formularios (`react-hook-form`), el manejo de estado en componentes cliente y la correcta propagación de errores desde las Server Actions a la UI.

### Resultado
Se ha implementado la estructura completa para los CRUD de Departamentos, Puestos, Empleados y Normativas. La funcionalidad de cada catálogo depende de la correcta implementación de sus respectivos Stored Procedures en la base de datos.

---

## 6. Optimización de Carga de Datos con `Suspense` y `useTransition`

### Problema Original
La carga de datos en las tablas de catálogos (ej. Procesos) no mostraba un estado de carga intermedio (`fallback` de `Suspense` o esqueleto). En la navegación inicial, la obtención de datos era tan rápida que el `fallback` no era perceptible. En navegaciones del lado del cliente (paginación, búsqueda, ordenamiento), la UI antigua permanecía visible hasta que los nuevos datos estaban listos, sin dar retroalimentación al usuario de que una carga estaba en progreso.

### Acciones Realizadas
Se implementó una solución moderna aprovechando las características de React 18 y Next.js para el streaming de UI y las transiciones.

1.  **Streaming con `Suspense` para Carga Inicial:**
    *   Se refactorizó el componente de la página principal (ej. `app/icalidad/proceso/page.tsx`) para que no realizara el `await` de los datos directamente.
    *   Se creó un nuevo Componente de Servidor (`async`) intermedio (ej. `app/ui/procesos/procesos-table.tsx`) que se encarga de hacer el `await` de los datos.
    *   La página principal ahora renderiza este nuevo componente dentro de una barrera `<Suspense>`, permitiendo que la página se muestre instantáneamente con un `fallback` mientras los datos se cargan en segundo plano.

2.  **Transiciones con `useTransition` para Navegación del Cliente:**
    *   Se refactorizó el componente genérico `app/ui/shared/data-table.tsx` para modernizar su manejo de estado.
    *   Se eliminó la lógica tradicional basada en `useState` y `useEffect` para manejar la paginación, búsqueda y ordenamiento.
    *   Se implementó el hook `useTransition`. Ahora, cualquier cambio en la URL (al paginar, buscar, etc.) se envuelve en una `startTransition`.
    *   El estado `isPending` de la transición se utiliza para aplicar un estilo de "cargando" (opacidad reducida) directamente sobre la tabla, dando al usuario retroalimentación visual inmediata durante las navegaciones del lado del cliente.

3.  **Creación de Esqueleto de Carga Reutilizable:**
    *   Se desarrolló un componente `TableSkeleton` en `app/ui/shared/skeletons.tsx`.
    *   Este componente imita la estructura de la `DataTable` (búsqueda, tabla, paginación) con una animación de pulso para una carga visualmente coherente.
    *   Es configurable mediante `props` (ej. `rows`, `cols`), lo que permite adaptarlo fácilmente a las distintas tablas de los catálogos.
    *   Se integró en el `fallback` de `Suspense` de la página de Procesos, reemplazando el simple texto de "Cargando...".

### Resultado
La experiencia de usuario en la carga de datos ha mejorado significativamente. La carga inicial ahora puede mostrar un esqueleto (o `fallback`), y las interacciones subsecuentes en la tabla (paginar, buscar) proveen retroalimentación visual instantánea, resultando en una interfaz más fluida y moderna.

-   **Aplicación Generalizada:** El patrón de carga con `Suspense` y `TableSkeleton` se aplicó exitosamente a todos los catálogos existentes (Gerencias, Departamentos, Puestos, Empleados, Requisitos), unificando la experiencia de usuario en toda la aplicación.

## 7. CRUD de Sub-Procesos y Mejoras de UI (Maestro-Detalle)

### Problema Original
Implementar un CRUD completo para los "Sub-Procesos", que están directamente relacionados con un "Proceso". A diferencia de otros catálogos, la interfaz debía ser un formulario de tipo maestro-detalle, presentado dentro de una pestaña en el formulario principal de edición de Procesos. Adicionalmente, se solicitaron mejoras en la UI para la confirmación de borrado y el estilo de los tabs.

### Acciones Realizadas
1.  **Componente de Maestro-Detalle (`sub-procesos-form.tsx`):**
    *   Se desarrolló un componente de cliente único que maneja toda la lógica del CRUD de sub-procesos.
    *   El componente obtiene el `IdProceso` del formulario padre y busca los sub-procesos asociados usando una Acción de Servidor (`getSubProcesos`).
    *   Muestra los registros en una "mini-tabla" con opciones para editar y eliminar.
    *   Integra un formulario (usando `react-hook-form` y `zod`) que aparece y desaparece en el mismo componente para crear o editar registros sin navegar a otra página.

2.  **Depuración de Interacciones de Formulario:**
    *   Se solucionó un problema crítico de **formularios anidados**, que causaba que el formulario de sub-proceso enviara incorrectamente el formulario principal del proceso. La solución fue eliminar la etiqueta `<form>` interna y activar el envío mediante `form.handleSubmit` en el `onClick` del botón "Guardar".
    *   Se robustecieron las Acciones de Servidor (`createSubProceso`, etc.) para manejar casos donde la base de datos no retorna un valor, evitando que la aplicación falle silenciosamente y mostrando un mensaje de error claro al usuario.

3.  **Mejoras de UI/UX:**
    *   **Confirmación de Borrado:** Se reemplazó el `window.confirm()` nativo por un `AlertDialog` de `shadcn/ui`, mejorando la consistencia visual y la experiencia de usuario al eliminar un registro.
    *   **Estilo de Pestañas (Tabs):** Se aplicaron estilos avanzados a los `Tabs` del formulario de procesos para lograr un diseño profesional, donde el tab activo se conecta visualmente con el panel de contenido, incluyendo bordes, colores y efectos `hover` específicos.
    *   **Efecto Hover en Tabla:** Se añadió un efecto de resaltado a las filas de la tabla de sub-procesos para mantener la consistencia con otras tablas de la aplicación.

### Resultado
Se ha implementado exitosamente un CRUD de tipo maestro-detalle para los Sub-Procesos, completamente integrado en la pestaña correspondiente del formulario de Procesos. La solución es robusta, visualmente atractiva y sigue las mejores prácticas de la arquitectura del proyecto.

## 8. Infraestructura de Base de Datos y Acceso Seguro (VPS)

### Problema Original
Migrar y desplegar la base de datos SQL Server en el VPS usando Docker de manera que sea accesible, segura y persistente, facilitando también la conexión directa sin contraseñas a través de SSH utilizando un usuario restringido.

### Acciones Realizadas
1.  **Seguridad y SSH:**
    *   Se creó un usuario restringido sin acceso root directo (`icalidad-user`) en el VPS.
    *   Se integraron permisos para que este usuario pueda administrar Docker y comandos sudo sin recurrir al root directo.
    *   Se configuró el acceso por llaves SSH (`id_ed25519`) desde la laptop Windows 11 del usuario para permitir login automático sin solicitar contraseña.
2.  **Contenedor Docker SQL Server:**
    *   Se diseñó y levantó un archivo `docker-compose.yml` para levantar la versión Developer de **Microsoft SQL Server 2022** con volumen persistente.
    *   Se mapeó la conexión al puerto seguro del host `1435` redirigido al interno `1433`.
3.  **Restauración de Base de Datos:**
    *   Se copió el respaldo `.bak` (`28-ago-25-iCalidad.bak`) al contenedor.
    *   Se ejecutaron comandos de restauración mapeando correctamente los nombres lógicos de archivos a la estructura de archivos en Linux (Docker).
    *   Se configuró exitosamente la conexión en DBeaver configurando las directivas `trustServerCertificate=true` y `encrypt=true`.

### Resultado
La base de datos se encuentra desplegada, restaurada y conectada en un entorno VPS robusto mediante Docker, con accesos seguros y sin contraseñas configurados.

---

## 9. Migración del Módulo de Menú Dinámico a .NET WebAPI & EF Core

### Problema Original
El menú lateral de la aplicación dependía de llamadas directas a la base de datos mediante el cliente `mssql` de Node.js y la ejecución de un Stored Procedure (`usp_GetMenuByEmployeeIdAndRole`). Esto acoplaba el frontend directamente al motor de base de datos e impedía la centralización de la seguridad y el control de accesos en el backend de C# .NET.

### Acciones Realizadas
1. **Entidad y Mapeo en Persistencia:**
   - Se definió la entidad `Menu` en `iCalidad.Domain` y se implementó su mapeo Fluent API en `MenuConfiguration.cs` (`iCalidad.Infrastructure`) hacia la tabla existente `Gen_TMenu`.
2. **Lógica de Aplicación (Application Layer):**
   - Se creó el servicio `MenuService` y la interfaz `IMenuService` en `iCalidad.Application`.
   - Consulta los roles del empleado en `EmpleadosRoles`, filtra los menús activos (`IdEstatusMenu` 1 y 2), realiza deduplicación en memoria para empleados con múltiples roles y ordena jerárquicamente por `OrdenMenu`.
3. **Endpoint REST Protegido:**
   - Se desarrolló `MenuController` (`GET /api/menu`) en `iCalidad.WebAPI` protegido por `[Authorize]`, extrayendo de forma segura el identificador del empleado autenticado a partir de los claims (`ClaimTypes.NameIdentifier` / `sub`) del token JWT.
4. **Integración con Frontend Next.js:**
   - Se refactorizó `frontend/lib/data/menu.ts` para consumir el endpoint `/menu` a través del cliente centralizado `apiFetch`, propagando automáticamente el JWT Bearer token de la sesión.
   - Se añadió protección con bloque `try/catch` en `frontend/app/icalidad/layout.tsx` para evitar caídas de renderizado y proveer degradación elegante.

### Resultado
El módulo de navegación dinámica quedó 100% desacoplado de la base de datos en el frontend, operando a través de la API REST de .NET con validación de seguridad por token JWT y cumpliendo los principios de Arquitectura Limpia.

---

## 10. Diagnóstico y Resolución de Errores 502 Bad Gateway en Nginx (Docker DNS vs Host Mapping)

### Problema Original
Al desplegar el stack completo en el VPS mediante Docker, Nginx retornaba intermitentemente errores `502 Bad Gateway` al intentar acceder a la aplicación frontend o a los endpoints de la API.

### Causa Raíz
1. **Fallo de Resolución DNS en Docker (`SERVFAIL`)**:
   - En el host Ubuntu 24.04 del VPS, `systemd-resolved` configuraba la directiva `search .` en `/etc/resolv.conf`.
   - Al heredar esta configuración, las consultas DNS dentro de contenedores Alpine (`nginx:alpine` con musl libc) agregaban un punto final a los nombres de host (`icalidad-frontend.`), provocando que el servidor DNS interno de Docker (`127.0.0.11`) no encontrara coincidencia y retornara `SERVFAIL`.
2. **Comportamiento de Nginx con Upstreams Dinámicos**:
   - Al fallar la resolución de nombres en el arranque o durante las peticiones, Nginx no lograba enrutar a `icalidad-frontend:3000` o `icalidad-backend:5175`, respondiendo inmediatamente con `502 Bad Gateway`.

### Acciones Realizadas
1. **Definición de Subred Estática en Docker Network**:
   - Se recreó la red `icalidad-net` con una subred explícita fija: `172.23.0.0/16`.
2. **Asignación de IPs Fijas Internas**:
   - Backend (`icalidad-backend`): `172.23.0.2`
   - Frontend (`icalidad-frontend`): `172.23.0.3`
   - Nginx (`icalidad-nginx`): `172.23.0.4`
   - Base de Datos (`icalidad-sqlserver`): `172.23.0.10`
3. **Mapeo Directo de Hosts (`--add-host`)**:
   - Se configuraron banderas `--add-host icalidad-frontend:172.23.0.3` e `--add-host icalidad-backend:172.23.0.2` en el contenedor de Nginx y Frontend.
   - Esto inyecta las entradas directamente en el `/etc/hosts` de cada contenedor, garantizando resolución en 0 ms sin depender del DNS embebido ni verse afectado por `systemd-resolved`.
4. **Automatización en Pipeline CI/CD**:
   - Se actualizó `.github/workflows/deploy.yml` para garantizar que todos los despliegues automáticos inicien los contenedores con estas directivas de red estáticas.

### Resultado
El error 502 quedó eliminado por completo. Tanto la interfaz web en `https://icalidad.eliconacento.com/login` como los endpoints del backend en `/api/` responden de manera inmediata y estable.

---

## 11. Requisitos Técnicos de Base de Datos y Compatibilidad para Instalaciones Multi-Cliente

### Problema / Hallazgo Técnico
Al restaurar respaldos de base de datos legados (`.bak`) generados en versiones antiguas de SQL Server (ej. SQL Server 2008 / nivel 100), Entity Framework Core 8/9 genera un error de sintaxis al ejecutar consultas LINQ con `.Contains(...)`:
```text
Microsoft.Data.SqlClient.SqlException: Incorrect syntax near '$'.
```

### Causa Raíz
EF Core 8 y 9 traducen las cláusulas `collection.Contains(x.Field)` a instrucciones optimizadas `OPENJSON(...) WITH ([value] int '$')`. Esta sintaxis requiere que el nivel de compatibilidad de la base de datos de SQL Server sea **igual o superior a 130 (SQL Server 2016)**; de lo contrario, el parser de T-SQL desconoce el operador `$` en `OPENJSON` y rechaza la consulta.

### Guía de Instalación y Configuración para Nuevos Clientes
1. **Verificar el Nivel de Compatibilidad Actual:**
   ```sql
   SELECT name, compatibility_level FROM sys.databases WHERE name = 'iCalidad';
   ```
2. **Homologar al Nivel de Compatibilidad Recomendado (160 para SQL Server 2022 o mínimo 130):**
   ```sql
   ALTER DATABASE [iCalidad] SET COMPATIBILITY_LEVEL = 160;
   ```
3. **Configuración de la Cadena de Conexión (`ConnectionStrings__DefaultConnection`):**
   - Para entornos Dockerizados y servidores con certificados autofirmados, es mandatorio incluir:
     ```ini
     TrustServerCertificate=True;Encrypt=True;
     ```
   - Sin `TrustServerCertificate=True`, `Microsoft.Data.SqlClient` rechazará la conexión con el error: `The remote certificate was rejected by the provided RemoteCertificateValidationCallback`.
4. **Herramienta CLI de Verificación Rápida:**
   - La utilidad `node scripts/db-query.js` en el directorio `/frontend` permite ejecutar consultas y scripts DDL directos contra la instancia de base de datos para diagnosticar y validar rápidamente el entorno antes de iniciar la aplicación.

---

## Plan de Atención General (Roadmap de Migración)

Para llevar el proyecto a un nivel profesional, robusto y escalable, seguiremos este plan estructurado paso a paso:

### Fase 1: Verificación de Conectividad Actual
*   **Objetivo:** Validar que la aplicación Next.js actual en producción/desarrollo pueda realizar login e interactuar correctamente con la nueva instancia de SQL Server restaurada en el VPS Docker.

### Fase 2: Estructura Inicial del Backend (.NET 10 & Clean Architecture)
*   **Objetivo:** Crear la solución base en C# usando la CLI de .NET 10 siguiendo los principios de Arquitectura Limpia.
*   **Proyectos a crear:**
    1.  `iCalidad.Domain` (Entidades, Interfaces y Reglas de Negocio base).
    2.  `iCalidad.Application` (Casos de Uso, DTOs, Mapeadores, Validaciones y Lógica de Aplicación).
    3.  `iCalidad.Infrastructure` (Implementación de Persistencia con Entity Framework Core, servicios externos y seguridad).
    4.  `iCalidad.WebAPI` (Controladores, Endpoint mappings, Middleware de manejo de errores y Configuración de Dependencias).

### Fase 3: Estrategia de Persistencia y Flexibilidad de Motor (Entity Framework Core)
*   **Objetivo:** Sustituir progresivamente la dependencia actual de Stored Procedures (SPs) por consultas LINQ y migraciones controladas de EF Core para mejorar la mantenibilidad, estabilidad y facilidad de pruebas.
*   **Enfoque Multi-Cliente y Multi-Base de Datos:**
    *   La arquitectura está diseñada para ser agnóstica al motor de base de datos. La lógica de negocio reside únicamente en `Domain` y `Application`, las cuales no tienen conocimiento del motor utilizado (SQL Server, Oracle, MySQL, etc.).
    *   En `Infrastructure`, registraremos el `DbContext` utilizando interfaces genéricas.
    *   Para dar soporte a un nuevo motor de base de datos para un cliente específico, el proceso consistirá en:
        1. Instalar el proveedor de EF Core correspondiente (ej. `Pomelo.EntityFrameworkCore.MySql` para MySQL, u `Oracle.EntityFrameworkCore` para Oracle).
        2. Configurar la inyección de dependencias en `iCalidad.WebAPI` para seleccionar el proveedor adecuado basándose en una variable de entorno (`DB_PROVIDER`) y la cadena de conexión correspondiente.

### Fase 4: Primera API - Módulo de Seguridad y Autenticación (Completada ✅)
*   **Objetivo:** Diseñar y codificar la primera API funcional enfocada en la autenticación, autorización y seguridad de usuarios, la cual sirve como plantilla de diseño para la posterior migración de los catálogos restantes.
*   **Resultado:**
    *   Backend .NET 9 con arquitectura limpia (`Domain`, `Application`, `Infrastructure`, `WebAPI`).
    *   Generación y validación de tokens JWT con claims de usuario y roles.
    *   NextAuth en Next.js migrado para consumir `POST /api/auth/login` directamente.
    *   Despliegue en producción en VPS mediante contenedores Docker en red privada `icalidad-net`.

---

### Fase 5: Migración Progresiva de Catálogos (Sustitución de Stored Procedures por EF Core y REST APIs)
*   **Objetivo:** Eliminar la dependencia de llamadas directas a SQL Server (`mssql` / Stored Procedures) en el Frontend, creando para cada catálogo su entidad en `Domain`, mapeo en `Infrastructure`, servicio/casos de uso en `Application`, controlador REST en `WebAPI` (protegido con `[Authorize]`) y conectando las Server Actions del Frontend a través del cliente `apiFetch`.

*   **Orden de Ejecución por Dependencia:**
    1.  **Módulo 1: Gerencias (`/icalidad/gerencia`)** — Catálogo raíz independiente (CRUD completo: Listar con paginación/filtros, Crear, Actualizar, Eliminar).
    2.  **Módulo 2: Departamentos (`/icalidad/departamento`)** — Relación con Gerencias (`IdGerencia`).
    3.  **Módulo 3: Puestos (`/icalidad/puesto`)** — Relación con Departamentos (`IdDepartamento`).
    4.  **Módulo 4: Empleados (`/icalidad/empleado`)** — Relación con Puestos y asignación de Roles.
    5.  **Módulo 5: Normativas y Requisitos (`/icalidad/normativa`, `/icalidad/requisito`)** — Gestión de normas de calidad y requisitos asociados.
    6.  **Módulo 6: Procesos y Sub-Procesos (`/icalidad/proceso`)** — Gestión de procesos con estructura maestro-detalle.
