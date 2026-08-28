ALTER PROCEDURE [dbo].[PF_Gen_TGerencia] 
    @p_ClaveGerencia        nvarchar(50) = '%'
    , @p_NombreGerencia     nvarchar(100) = '%'
    , @p_IdEstatus          nvarchar(5) = '%'
AS
BEGIN
    SET NOCOUNT ON;

    SELECT IdGerencia
        , RTRIM(NombreGerencia) AS NombreGerencia
        , RTRIM(ClaveGerencia) AS ClaveGerencia
        , IdEstatusGerencia
        , CASE IdEstatusGerencia
            WHEN 1 THEN 'Activo'
            WHEN 0 THEN 'Inactivo'
            END As Estatus
        , CASE WHEN (SELECT COUNT(*) FROM Gen_TDepartamento WHERE Gen_TDepartamento.IdGerencia = Gen_TGerencia.IdGerencia AND Gen_TDepartamento.ClaveDepartamento = Gen_TGerencia.ClaveGerencia ) > 0 THEN 'NoBorrar' ELSE '' END BorrarGerencia
    FROM  Gen_TGerencia
    WHERE (IdEstatusGerencia LIKE @p_IdEstatus )
        AND (
                (RTRIM(UPPER(NombreGerencia)) LIKE '%' + UPPER(RTRIM(@p_NombreGerencia) + '%'))
                OR
                (UPPER(ClaveGerencia) LIKE '%' + RTRIM(UPPER(@p_ClaveGerencia) + '%'))
            )
    ORDER BY RTRIM(NombreGerencia)

END