# Guía rápida: levantar SQL Server en el VPS y restaurar el backup

> Ejecuta estos comandos en tu VPS `eliconacento.com`. Reemplaza `TuContraseñaSegura123!` por una contraseña real y segura para el `sa`.

## 1. Verificar Docker en el VPS

```bash
docker --version
docker compose version
```

Si no aparece versión, instala Docker y Docker Compose primero.

## 2. Verificar si ya hay un SQL Server corriendo

```bash
docker ps -a | grep -i sql
docker volume ls | grep -i sql
```

Si ya existe un contenedor llamado `icalidad-sqlserver` y quieres rehacerlo, detenlo y elimínalo (pero **cuidado con los datos**):

```bash
docker stop icalidad-sqlserver
docker rm icalidad-sqlserver
```

## 3. Preparar el repo y el archivo .env

```bash
cd /var/www/icalidad
git pull
```

Crea el archivo `.env`:

```bash
cp .env.example .env
nano .env
```

Contenido mínimo:

```env
MSSQL_SA_PASSWORD=TuContraseñaSegura123!
DB_HOST=eliconacento.com
DB_PORT=1433
DB_USER=sa
DB_PASS=TuContraseñaSegura123!
DB_NAME=icalidad
```

Guarda (`Ctrl+O`, `Enter`, `Ctrl+X`).

## 4. Levantar SQL Server

```bash
docker compose up -d sqlserver
```

Ver logs hasta que esté saludable:

```bash
docker logs -f icalidad-sqlserver
```

Sal con `Ctrl+C` cuando veas que terminó de iniciar. Luego verifica el estado:

```bash
docker inspect --format='{{.State.Health.Status}}' icalidad-sqlserver
```

Debe decir `healthy`.

## 5. Probar conexión local

```bash
docker exec -it icalidad-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P 'TuContraseñaSegura123!' -C -Q "SELECT @@VERSION"
```

## 6. Enviar el backup desde tu laptop

Desde tu laptop (no en el VPS), ejecuta:

```bash
scp /ruta/a/tu/icalidad.bak usuario@eliconacento.com:/tmp/icalidad.bak
```

> Reemplaza `/ruta/a/tu/icalidad.bak` por la ruta real en tu laptop y `usuario` por tu usuario del VPS.

## 7. Copiar el backup al contenedor

De vuelta en el VPS:

```bash
docker cp /tmp/icalidad.bak icalidad-sqlserver:/var/opt/mssql/data/icalidad.bak
```

## 8. Restaurar la base de datos

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

## 9. Verificar que la base de datos quedó en línea

```bash
docker exec -it icalidad-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P 'TuContraseñaSegura123!' -C -Q "SELECT name FROM sys.databases"
```

Debes ver `icalidad` en la lista.

## 10. Probar conexión desde tu laptop de desarrollo

Si el puerto `1433` está abierto en el firewall del VPS, prueba conectar con tu herramienta favorita (Azure Data Studio, DBeaver, sqlcmd, etc.):

- Servidor: `eliconacento.com,1433`
- Usuario: `sa`
- Contraseña: la que pusiste en `.env`
- Base de datos: `icalidad`

## 11. Actualizar GitHub Secrets (después de verificar)

Cuando todo funcione, actualiza los secrets del repositorio para que la app apunte al nuevo servidor:

- `DB_HOST`: `eliconacento.com`
- `DB_PORT`: `1433`
- `DB_USER`: `sa`
- `DB_PASS`: la contraseña que elegiste
- `DB_NAME`: `icalidad`

El siguiente deploy de la app usará automáticamente esta base de datos.

## Si algo falla

- Revisa los logs: `docker logs icalidad-sqlserver`
- Verifica que el puerto 1433 no esté ocupado: `sudo ss -tlnp | grep 1433`
- Asegúrate de que la contraseña cumpla con los requisitos de SQL Server (mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos).
