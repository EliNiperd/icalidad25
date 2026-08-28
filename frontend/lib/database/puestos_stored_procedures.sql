-- ===================================================================
-- NOTA: ESTE ARCHIVO CONTIENE PLANTILLAS PARA LOS STORED PROCEDURES.
-- DEBES AJUSTARLOS A LA ESTRUCTURA EXACTA DE TU TABLA Gen_TPuesto.
-- ===================================================================

-- =============================================
-- Plantilla para PI_Gen_TPuesto (INSERT)
-- =============================================
CREATE PROCEDURE PI_Gen_TPuesto
    @p_NombrePuesto NVARCHAR(100),
    @p_IdDepartamento INT,
    @p_IdEmpleadoAlta INT
AS
BEGIN
    -- Lógica para insertar un nuevo puesto y devolver { Resultado, Mensaje }
END
GO

-- =============================================
-- Plantilla para PU_Gen_TPuesto (UPDATE)
-- =============================================
CREATE PROCEDURE PU_Gen_TPuesto
    @p_IdPuesto INT,
    @p_NombrePuesto NVARCHAR(100),
    @p_IdDepartamento INT,
    @p_IdEstatusPuesto BIT,
    @p_IdEmpleadoActualiza INT
AS
BEGIN
    -- Lógica para actualizar un puesto existente y devolver { Resultado, Mensaje }
END
GO

-- =============================================
-- Plantilla para PD_Gen_TPuesto (DELETE)
-- =============================================
CREATE PROCEDURE PD_Gen_TPuesto
    @p_IdPuesto INT
AS
BEGIN
    -- Lógica para eliminar (lógicamente) un puesto y devolver { Resultado, Mensaje }
END
GO

-- =============================================
-- Plantilla para PFK_Gen_TPuesto (SELECT BY ID)
-- =============================================
CREATE PROCEDURE PFK_Gen_TPuesto
    @p_IdPuesto INT
AS
BEGIN
    -- Lógica para seleccionar un puesto por su ID
    SELECT * FROM Gen_TPuesto WHERE IdPuesto = @p_IdPuesto;
END
GO

-- =============================================
-- Plantilla para PF_Gen_TPuesto (SELECT con filtros y paginación)
-- =============================================
CREATE PROCEDURE PF_Gen_TPuesto
    @p_SearchQuery NVARCHAR(100) = NULL,
    @p_PageNumber INT = 1,
    @p_PageSize INT = 10,
    @p_SortBy NVARCHAR(50) = 'NombrePuesto',
    @p_SortOrder NVARCHAR(4) = 'ASC'
AS
BEGIN
    -- Lógica similar a PF_Gen_TGerencia para buscar, ordenar y paginar puestos.
    -- Asegúrate de hacer JOIN con la tabla de Departamentos para mostrar el nombre del departamento.
END
GO
