-- Script para actualizar los iconos de los catálogos en Gen_TMenu

-- Gerencias
UPDATE Gen_TMenu
SET Icono = 'Building'
WHERE Menu = 'Gerencias';

-- Departamentos
UPDATE Gen_TMenu
SET Icono = 'Blocks'
WHERE Menu = 'Departamentos';

-- Puestos
UPDATE Gen_TMenu
SET Icono = 'Briefcase'
WHERE Menu = 'Puestos';

-- Empleados
UPDATE Gen_TMenu
SET Icono = 'Users'
WHERE Menu = 'Empleados';

-- Confirmación (opcional, para verificar los cambios)
SELECT Menu, Icono FROM Gen_TMenu WHERE Menu IN ('Gerencias', 'Departamentos', 'Puestos', 'Empleados');
