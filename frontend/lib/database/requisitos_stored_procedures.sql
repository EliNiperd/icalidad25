-- ===================================================================
-- PLANTILLAS DE STORED PROCEDURES PARA EL CATÁLOGO DE REQUISITOS
-- ===================================================================

-- =============================================
-- PI_Gen_TRequisito (INSERT)
-- =============================================
CREATE PROCEDURE PI_Gen_TRequisito
    @p_ClaveRequisito NVARCHAR(50),
    @p_NombreRequisito NVARCHAR(250),
    @p_IdNormativa INT,
    @p_IdEmpleadoAlta INT
AS
BEGIN
    -- Lógica para insertar un nuevo requisito.
    -- Devuelve: { Resultado, Mensaje }
END
GO

-- =============================================
-- PU_Gen_TRequisito (UPDATE)
-- =============================================
CREATE PROCEDURE PU_Gen_TRequisito
    @p_IdRequisito INT,
    @p_ClaveRequisito NVARCHAR(50),
    @p_NombreRequisito NVARCHAR(250),
    @p_IdNormativa INT,
    @p_IdEstatusRequisito BIT,
    @p_IdEmpleadoActualiza INT
AS
BEGIN
    -- Lógica para actualizar un requisito existente.
    -- Devuelve: { Resultado, Mensaje }
END
GO

-- =============================================
-- PFK_Gen_TRequisito (SELECT BY ID)
-- =============================================
CREATE PROCEDURE PFK_Gen_TRequisito
    @p_IdRequisito INT
AS
BEGIN
    -- Lógica para seleccionar un requisito por su ID.
    SELECT * FROM Gen_TRequisito WHERE IdRequisito = @p_IdRequisito;
END
GO

-- ... (Aquí irían los SPs para borrado y listado si los necesitas) ...
