-- Script para actualizar los iconos de Gen_TMenu a nombres compatibles con Lucide-React

-- Acciones
UPDATE Gen_TMenu
SET Icono = 'Users'
WHERE Menu = 'Acciones';

-- Auditorías
UPDATE Gen_TMenu
SET Icono = 'ClipboardList'
WHERE Menu = 'Auditorías';

-- Carpetas
UPDATE Gen_TMenu
SET Icono = 'Folder'
WHERE Menu = 'Carpetas';

-- Catálogos (MdAdminPanelSettings)
UPDATE Gen_TMenu
SET Icono = 'Settings'
WHERE Menu = 'Catálogos' AND Icono = 'MdAdminPanelSettings'; -- Asegúrate de que esta condición sea específica si tienes varios 'Catálogos'

-- Catálogos (RiArchiveDrawerFill)
UPDATE Gen_TMenu
SET Icono = 'Archive'
WHERE Menu = 'Catálogos' AND Icono = 'RiArchiveDrawerFill'; -- Asegúrate de que esta condición sea específica si tienes varios 'Catálogos'

-- Configuración iCalidad
UPDATE Gen_TMenu
SET Icono = 'Settings'
WHERE Menu = 'Configuración iCalidad';

-- Documentos Admin
UPDATE Gen_TMenu
SET Icono = 'UserCog'
WHERE Menu = 'Documentos Admin';

-- iCalidad
UPDATE Gen_TMenu
SET Icono = 'Home'
WHERE Menu = 'iCalidad';

-- Normativas
UPDATE Gen_TMenu
SET Icono = 'Ruler'
WHERE Menu = 'Normativas';

-- Personal Competente
UPDATE Gen_TMenu
SET Icono = 'Users'
WHERE Menu = 'Personal Competente';

-- Poder Documental
UPDATE Gen_TMenu
SET Icono = 'MessageSquare'
WHERE Menu = 'Poder Documental';

-- Procesos
UPDATE Gen_TMenu
SET Icono = 'Layers'
WHERE Menu = 'Procesos';

-- Registros
UPDATE Gen_TMenu
SET Icono = 'ClipboardCheck'
WHERE Menu = 'Registros';

-- Reportes
UPDATE Gen_TMenu
SET Icono = 'FileText'
WHERE Menu = 'Reportes';

-- Requisitos
UPDATE Gen_TMenu
SET Icono = 'Notebook'
WHERE Menu = 'Requisitos';

-- Salir
UPDATE Gen_TMenu
SET Icono = 'LogOut'
WHERE Menu = 'Salir';

-- Solicitudes
UPDATE Gen_TMenu
SET Icono = 'CheckSquare'
WHERE Menu = 'Solicitudes';

-- Opcional: Limpiar iconos para IdEstatusMenu = 1 o donde no se desee icono
-- UPDATE Gen_TMenu
-- SET Icono = NULL -- O Icono = ''
-- WHERE IdEstatusMenu = 1;

-- Confirmación
SELECT Menu, Icono FROM Gen_TMenu WHERE Menu IN (
    'Acciones', 'Auditorías', 'Carpetas', 'Catálogos', 'Configuración iCalidad',
    'Documentos Admin', 'iCalidad', 'Normativas', 'Personal Competente',
    'Poder Documental', 'Procesos', 'Registros', 'Reportes', 'Requisitos',
    'Salir', 'Solicitudes'
);
