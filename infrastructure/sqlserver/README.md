# SQL Server Docker para iCalidad

Esta carpeta contiene la configuración para levantar SQL Server en el VPS `eliconacento.com` usando Docker Compose.

> **Importante:** La base de datos se creará a partir de un backup `.bak` que tienes en tu laptop. No usamos scripts de inicialización automáticos porque la BD ya existe con datos.

## Requisitos en el VPS

- Docker instalado.
- Docker Compose instalado (plugin `docker compose` o binario `docker-compose`).
- Puerto `1433` libre o disponible para exponer.

## Primer levantamiento

1. Copiar este repo al VPS (por ejemplo en `/var/www/icalidad`):

   ```bash
   cd /var/www/icalidad
   git pull
   ```

2. Crear el archivo de variables de entorno:

   ```bash
   cp .env.example .env
   nano .env
   ```

3. Editar `.env` y poner una contraseña segura para `MSSQL_SA_PASSWORD`. Ejemplo:

   ```env
   MSSQL_SA_PASSWORD=TuContraseñaSegura123!
   DB_HOST=eliconacento.com
   DB_PORT=1433
   DB_USER=sa
   DB_PASS=TuContraseñaSegura123!
   DB_NAME=icalidad
   ```

4. Levantar SQL Server:

   ```bash
   docker compose up -d sqlserver
   ```

5. Verificar que esté saludable:

   ```bash
   docker logs -f icalidad-sqlserver
   docker inspect --format='{{.State.Health.Status}}' icalidad-sqlserver
   ```

6. Probar conexión desde el mismo VPS:

   ```bash
   docker exec -it icalidad-sqlserver /opt/mssql-tools18/bin/sqlcmd \
     -S localhost -U sa -P 'TuContraseñaSegura123!' -C -Q "SELECT @@VERSION"
   ```

## Restaurar la base de datos desde tu laptop

1. **En tu laptop**, localiza el archivo `.bak`.
2. Envía el backup al VPS. Si tienes acceso SSH, usa `scp`:

   ```bash
   scp /ruta/a/icalidad.bak usuario@eliconacento.com:/tmp/icalidad.bak
   ```

3. **En el VPS**, copia el backup dentro del contenedor:

   ```bash
   docker cp /tmp/icalidad.bak icalidad-sqlserver:/var/opt/mssql/data/icalidad.bak
   ```

4. Conéctate al contenedor y obtén los nombres lógicos del backup:

   ```bash
   docker exec -it icalidad-sqlserver /opt/mssql-tools18/bin/sqlcmd \
     -S localhost -U sa -P 'TuContraseñaSegura123!' -C -Q "RESTORE FILELISTONLY FROM DISK = N'/var/opt/mssql/data/icalidad.bak'"
   ```

5. Restaura la base de datos (ajusta `LogicalName` y `LogicalName_log` según el paso anterior):

   ```sql
   RESTORE DATABASE [icalidad]
   FROM DISK = N'/var/opt/mssql/data/icalidad.bak'
   WITH FILE = 1,
        MOVE N'LogicalName'      TO N'/var/opt/mssql/data/icalidad.mdf',
        MOVE N'LogicalName_log'  TO N'/var/opt/mssql/data/icalidad_log.ldf',
        NOUNLOAD, REPLACE, STATS = 10;
   ```

   Según tu backup, los nombres lógicos son `iCalidadCCMSLP22` y `iCalidadCCMSLP22_log`. Ejecuta:

   ```bash
   docker exec -it icalidad-sqlserver /opt/mssql-tools18/bin/sqlcmd \
     -S localhost -U sa -P 'TuContraseñaSegura123!' -C -Q "
     RESTORE DATABASE [icalidad]
     FROM DISK = N'/var/opt/mssql/data/icalidad.bak'
     WITH FILE = 1,
          MOVE N'iCalidadCCMSLP22'     TO N'/var/opt/mssql/data/icalidad.mdf',
          MOVE N'iCalidadCCMSLP22_log' TO N'/var/opt/mssql/data/icalidad_log.ldf',
          NOUNLOAD, REPLACE, STATS = 10;"
   ```

6. Verifica que la base de datos esté en línea:

   ```bash
   docker exec -it icalidad-sqlserver /opt/mssql-tools18/bin/sqlcmd \
     -S localhost -U sa -P 'TuContraseñaSegura123!' -C -Q "SELECT name FROM sys.databases"
   ```

## Persistencia

Los datos se guardan en el volumen Docker `icalidad-sqlserver-data`. No se pierden al reiniciar o actualizar el contenedor.

## Seguridad

- Por defecto el puerto `1433` está expuesto. Restringe el acceso en el firewall del VPS solo a tus IPs de desarrollo.
- Considera crear un usuario SQL distinto de `sa` para la aplicación.

## Conectar la app al nuevo servidor

Una vez restaurada la BD, actualiza las variables de entorno de la app:

```env
DB_HOST=eliconacento.com
DB_PORT=1433
DB_USER=sa
DB_PASS=TuContraseñaSegura123!
DB_NAME=icalidad
```

En producción, estas variables se inyectan desde los GitHub Secrets en `.github/workflows/deploy.yml`.
