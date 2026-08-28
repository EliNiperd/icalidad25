ALTER PROCEDURE [dbo].[PF_Gen_TGerencia]
    @p_SearchQuery          NVARCHAR(100) = NULL, -- Parámetro unificado para búsqueda
    @p_IdEstatus            NVARCHAR(5) = NULL,
    @p_PageNumber           INT = 1,
    @p_PageSize             INT = 10,
    @p_SortBy               NVARCHAR(50) = 'NombreGerencia',
    @p_SortOrder            NVARCHAR(4) = 'ASC'
AS
BEGIN
    SET NOCOUNT ON;

    -- Consulta principal con Common Table Expression (CTE) para paginación
    WITH GerenciasCTE AS (
        SELECT
            IdGerencia,
            RTRIM(NombreGerencia) AS NombreGerencia,
            RTRIM(ClaveGerencia) AS ClaveGerencia,
            IdEstatusGerencia,
            CASE IdEstatusGerencia
                WHEN 1 THEN 'Activo'
                WHEN 0 THEN 'Inactivo'
            END AS Estatus,
            CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM Gen_TDepartamento d 
                    WHERE d.IdGerencia = g.IdGerencia AND d.ClaveDepartamento = g.ClaveGerencia
                ) THEN 'NoBorrar' 
                ELSE '' 
            END AS BorrarGerencia,
            -- Contar el total de registros que coinciden con el filtro
            COUNT(*) OVER() AS TotalRecords
        FROM
            Gen_TGerencia g
        WHERE
            (@p_IdEstatus IS NULL OR @p_IdEstatus = '%' OR IdEstatusGerencia LIKE @p_IdEstatus)
            AND 
            (@p_SearchQuery IS NULL OR @p_SearchQuery = '' OR
             UPPER(RTRIM(ClaveGerencia)) LIKE '%' + UPPER(RTRIM(@p_SearchQuery)) + '%' OR
             UPPER(RTRIM(NombreGerencia)) LIKE '%' + UPPER(RTRIM(@p_SearchQuery)) + '%' OR
             -- Añadida la búsqueda por estatus
             UPPER(CASE IdEstatusGerencia WHEN 1 THEN 'Activo' WHEN 0 THEN 'Inactivo' END) LIKE '%' + UPPER(RTRIM(@p_SearchQuery)) + '%'
            )
    )
    -- Seleccionar los datos de la CTE con ordenamiento y paginación
    SELECT
        IdGerencia,
        NombreGerencia,
        ClaveGerencia,
        IdEstatusGerencia,
        Estatus,
        BorrarGerencia,
        TotalRecords
    FROM GerenciasCTE
    ORDER BY
        CASE WHEN @p_SortBy = 'NombreGerencia' AND @p_SortOrder = 'ASC' THEN NombreGerencia END ASC,
        CASE WHEN @p_SortBy = 'NombreGerencia' AND @p_SortOrder = 'DESC' THEN NombreGerencia END DESC,
        CASE WHEN @p_SortBy = 'ClaveGerencia' AND @p_SortOrder = 'ASC' THEN ClaveGerencia END ASC,
        CASE WHEN @p_SortBy = 'ClaveGerencia' AND @p_SortOrder = 'DESC' THEN ClaveGerencia END DESC,
        CASE WHEN @p_SortBy = 'IdEstatusGerencia' AND @p_SortOrder = 'ASC' THEN IdEstatusGerencia END ASC,
        CASE WHEN @p_SortBy = 'IdEstatusGerencia' AND @p_SortOrder = 'DESC' THEN IdEstatusGerencia END DESC
    OFFSET (@p_PageNumber - 1) * @p_PageSize ROWS
    FETCH NEXT @p_PageSize ROWS ONLY;

END