
USE [iCalidadCCMSLP22]
GO

/****** Object:  Table [dbo].[Gen_TGerencia]    Script Date: 20/10/2025 09:35:18 p. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Gen_TGerencia](
	[IdGerencia] [int] IDENTITY(1,1) NOT NULL,
	[ClaveGerencia] [nvarchar](40) NULL,
	[NombreGerencia] [nvarchar](100) NULL,
	[IdEstatusGerencia] [bit] NULL,
	[FechaBorrado] [smalldatetime] NULL,
	[IdEmpleadoBorra] [int] NULL,
	[IdEmpleadoAlta] [int] NULL,
	[FechaAlta] [smalldatetime] NULL,
	[IdEmpleadoActualiza] [int] NULL,
	[FechaActualiza] [smalldatetime] NULL,
 CONSTRAINT [PK_Gen_TGerencia] PRIMARY KEY CLUSTERED 
(
	[IdGerencia] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Gen_TGerencia] ADD  CONSTRAINT [DF__TGERENCIA__]  DEFAULT ((1)) FOR [IdEstatusGerencia]
GO

ALTER TABLE [dbo].[Gen_TGerencia] ADD  CONSTRAINT [DF_Gen_TGerencia_FechaAlta]  DEFAULT (getdate()) FOR [FechaAlta]
GO


USE [iCalidadCCMSLP22]
GO
/****** Object:  StoredProcedure [dbo].[PF_Gen_TGerencia]    Script Date: 20/10/2025 09:16:42 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Elí Rodríguez
-- Create date: Febrero 2009
-- Description:	Recupera las Área o Gerencias
-- =============================================
ALTER PROCEDURE [dbo].[PF_Gen_TGerencia] 
	@p_ClaveGerencia		nvarchar(50) = '%'
	, @p_NombreGerencia		nvarchar(100) = '%'
	, @p_IdEstatus				nvarchar(5) = '%'
AS
BEGIN
	SET NOCOUNT ON;
	--delete from Sis_TPrueba
	--select * from Sis_TPrueba
/*	Insert into Sis_TPrueba (Texto, FechaHora)
	SELECT @p_ClaveGerencia, GETDATE()
	UNION
	SELECT @p_NombreGerencia, GETDATE()
	*/
	SELECT IdGerencia
		, RTRIM(NombreGerencia) AS NombreGerencia
		, RTRIM(ClaveGerencia) AS ClaveGerencia
--		, RTRIM(NombreGerencia) AS NombreGerencia
		, IdEstatusGerencia
		, CASE IdEstatusGerencia
			WHEN 1 THEN 'Activo'
			WHEN 0 THEN 'Inactivo'
			END As Estatus
		, CASE WHEN (SELECT COUNT(*) FROM Gen_TDepartamento WHERE Gen_TDepartamento.IdGerencia = Gen_TGerencia.IdGerencia AND Gen_TDepartamento.ClaveDepartamento = Gen_TGerencia.ClaveGerencia ) > 0 THEN 'NoBorrar' ELSE '' END BorrarGerencia
    FROM  Gen_TGerencia
    WHERE (IdEstatusGerencia LIKE @p_IdEstatus )
        AND (RTRIM(UPPER(NombreGerencia)) LIKE '%' + UPPER(RTRIM(@p_NombreGerencia) + '%'))
        AND (UPPER(ClaveGerencia) LIKE '%' + RTRIM(UPPER(@p_ClaveGerencia) + '%'))
    ORDER BY RTRIM(NombreGerencia)

END
USE [iCalidadCCMSLP22]
GO
/****** Object:  StoredProcedure [dbo].[PFK_Gen_TGerencia]    Script Date: 20/10/2025 09:17:10 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Elí Rodríguez
-- Create date: Mayo 2023
-- Description:	Recupera una gerencia para ser editada
-- =============================================
ALTER PROCEDURE [dbo].[PFK_Gen_TGerencia] 
	@p_IdGerencia int
AS
BEGIN
	SET NOCOUNT ON;

	-- PFK_Gen_TGerencia 5
	SELECT IdGerencia
		, NombreGerencia
		, ClaveGerencia		
		, IdEstatusGerencia			
    FROM  Gen_TGerencia
    WHERE IdGerencia = @p_IdGerencia    
END


USE [iCalidadCCMSLP22]
GO
/****** Object:  StoredProcedure [dbo].[PI_Gen_TGerencia]    Script Date: 20/10/2025 09:14:17 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[PI_Gen_TGerencia]
	  @p_NombreGerencia		nvarchar(50)
	, @p_ClaveGerencia	nvarchar(100)
	, @p_IdEmpleadoAlta int = 0	
AS
	DECLARE @v_result INT = 0
		, @v_mensaje nvarchar(50) = ''
	
	SELECT @v_result = COUNT(*)
	FROM Gen_TGerencia
    WHERE (UPPER(RTRIM(LTRIM(NombreGerencia))) = UPPER(RTRIM(LTRIM(@p_NombreGerencia)))
		OR UPPER(RTRIM(LTRIM(ClaveGerencia))) = UPPER(RTRIM(LTRIM(@p_ClaveGerencia))))
        AND IdEstatusGerencia = 1
        
       
        IF @v_result > 0 
		BEGIN
            SET @v_result = -1;
			SET @v_mensaje = 'Ya existe registro';
		END
        ELSE
		BEGIN
			BEGIN TRANSACTION

				INSERT INTO Gen_TGerencia(NOMBREGERENCIA, CLAVEGERENCIA, IdEmpleadoAlta, FechaAlta)
				VALUES (@p_NombreGERENCIA, @p_CLAVEGerencia, @p_IdEmpleadoAlta, GETDATE())

				SET @v_result = ISNULL(@@IDENTITY, 0);
				SET @v_mensaje = 'Creación exitosa';
				
			COMMIT TRANSACTION
        END
            
        SELECT @v_result AS Resultado
			 , @v_mensaje as Mensaje

	RETURN

    USE [iCalidadCCMSLP22]
GO
/****** Object:  StoredProcedure [dbo].[PU_Gen_TGerencia]    Script Date: 20/10/2025 09:16:12 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Elí Rodríguez
-- Create date: Febrero 2009
-- Update date: March 2023
-- Description Update:  se actualiza para enviar el registro actualizado y el 
-- mensaje que se ha generado
-- Description:	Actualiza los datos de la Gerencia
-- =============================================

ALTER PROCEDURE [dbo].[PU_Gen_TGerencia]
	      @p_IdGerencia		INT
		, @p_NombreGerencia nvarchar(100)
		, @p_ClaveGerencia	nvarchar(50)
		, @p_IdEstatusGerencia bit
		, @p_IdEmpleadoActualiza int = 0
AS
	SET NOCOUNT ON;
-- PU_Gen_TGerencia 16, 'A Prueba', '2', 1
	DECLARE @v_Result			INT
		, @v_Mensaje nvarchar(50) = ''
    DECLARE @v_NombreGerencia	nvarchar(100)
    DECLARE @v_ClaveGerencia	nvarchar(100)
    
    IF EXISTS  -- Verifica la existencia del algun registro
	(
		SELECT IdGerencia 
		FROM Gen_TGerencia 
		WHERE IdGerencia <> @p_IdGerencia 
			AND (UPPER(ClaveGerencia) = UPPER(@p_ClaveGerencia) 
				OR UPPER(NombreGerencia) = UPPER(@p_NombreGerencia))
		UNION ALL
		SELECT IdDepartamento
		FROM Gen_TDepartamento 
		WHERE (UPPER(ClaveDepartamento) = UPPER(@p_ClaveGerencia)
			OR	UPPER(NombreDepartamento) = UPPER(@p_NombreGerencia))
			AND IdGerencia <> @p_IdGerencia 
	)
	BEGIN
        SET @v_Result = -1;
		SET @v_Mensaje = 'Ya existe registro' ;
	END
    ELSE
		BEGIN
			UPDATE Gen_TGerencia 
				SET NOMBREGERENCIA = @p_NombreGerencia
				, ClaveGerencia = @p_ClaveGerencia
				, IdEstatusGerencia = @p_IdEstatusGerencia
				, IdEmpleadoActualiza = @p_IdEmpleadoActualiza
				, FechaActualiza = GETDATE()
			WHERE IdGerencia = @p_IdGerencia
			SELECT @v_Result = @@IDENTITY
				, @v_Mensaje  = 'Actualización exitosa'
        END 
        
      SELECT @v_Result as Resultado  
		, @v_Mensaje as Mensaje

	RETURN

USE [iCalidadCCMSLP22]
GO

/****** Object:  StoredProcedure [dbo].[PD_Gen_TGerencia]    Script Date: 20/10/2025 09:45:09 p. m. ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Elí Rodriguez
-- Create date: Febrero 2009
-- Description:	Eliminar una Gerencia
-- =============================================
CREATE PROCEDURE [dbo].[PD_Gen_TGerencia] 
	@p_IdGerencia Int
AS
BEGIN
	SET NOCOUNT ON;

    DELETE FROM Gen_TGerencia
	WHERE IdGerencia = @p_IdGerencia


END
GO

