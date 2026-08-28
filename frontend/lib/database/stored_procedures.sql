-- =============================================
-- Autor:       Elí Rodríguez
-- Fecha:       2025-10-19
-- Descripción: Obtiene el menú dinámico para un empleado y un rol específico.
--              Permite filtrar por un IdMenuPadre para submenús.
-- =============================================
ALTER PROCEDURE usp_GetMenuByEmployeeIdAndRole (
    @p_IdEmpleado INT,
    @p_IdRolPrincipal INT, -- Se pasa el rol principal del empleado
    @p_ParentMenuId INT = NULL -- NULL para obtener menús de nivel superior
)
AS
BEGIN
    SET NOCOUNT ON;
    -- usp_GetMenuByEmployeeIdAndRole 92, 1, 149
    -- Declarar constantes para mayor claridad
    DECLARE @ESTATUS_ACTIVO INT = 1;
    DECLARE @ESTATUS_VISIBLE_ESPECIAL INT = 2; -- Asumiendo que 2 es para menús visibles bajo ciertas condiciones
    DECLARE @ROL_SUPER_ADMIN INT = 1;
    DECLARE @MENU_RAIZ_ID INT = 149; -- Asumiendo que 149 es el ID del menú raíz 'iCalidad'

    -- Tabla temporal para almacenar los roles del empleado, incluyendo el rol de Super Administrador
    CREATE TABLE #EmployeeRoles (IdRol INT PRIMARY KEY);
    INSERT INTO #EmployeeRoles (IdRol)
    SELECT IdRol FROM Gen_REmpleadoRol WHERE IdEmpleado = @p_IdEmpleado GROUP BY IdRol;
    --UNION ALL
    --SELECT @ROL_SUPER_ADMIN ; -- Incluir el rol de Super Administrador

    -- Lógica para obtener el menú
    SELECT
        M.IdMenu AS id,
        M.Menu AS nombre,
        ISNULL(M.Icono, '') AS icono,
        ISNULL(M.URL, '') AS ruta,
        ISNULL(M.IdMenuPadre, 0) AS idPadre, -- Usar 0 para indicar que es un menú raíz si es NULL
        M.OrdenMenu AS orden
    FROM
        Gen_TMenu AS M
    INNER JOIN
        #EmployeeRoles AS ER ON M.IdRol = ER.IdRol
    WHERE
        M.IdEstatusMenu IN (@ESTATUS_ACTIVO, @ESTATUS_VISIBLE_ESPECIAL) -- Considerar ambos estatus si aplica
        AND (@p_ParentMenuId IS NULL OR ISNULL(M.IdMenuPadre, 0) = @p_ParentMenuId)
        -- Si necesitas lógica específica para el rol de administrador, hazlo aquí
        -- Por ejemplo, si el rol principal es 'iCalidad Administrador' y quieres mostrar algo especial
        -- AND (
        --     (@p_IdRolPrincipal = (SELECT IdRol FROM Gen_TRol WHERE NombreRol = 'iCalidad Administrador') AND M.Menu = 'iCalidad')
        --     OR
        --     (@p_IdRolPrincipal != (SELECT IdRol FROM Gen_TRol WHERE NombreRol = 'iCalidad Administrador') AND M.Menu != 'Salir')
        --     OR
        --     (M.Menu = 'Salir')
        -- )
    ORDER BY
        M.OrdenMenu, M.IdMenu;

    DROP TABLE #EmployeeRoles;
END
GO

