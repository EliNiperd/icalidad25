'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuItem } from '@/lib/utils/menu-builder';
import * as LucideIcons from 'lucide-react';

interface SideMenuProps {
  menuItems: MenuItem[];
}

const getLucideIcon = (iconName: string | undefined) => {
  if (!iconName) return null;
  const IconComponent = (LucideIcons as any)[iconName];
  
  return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
};

const MenuItemComponent: React.FC<{ 
  item: MenuItem;
  isCollapsed: boolean;
}> = ({ item, isCollapsed }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const hasSubMenus = item.subMenus && item.subMenus?.length > 0;
  const Icon = getLucideIcon(item.icono);
  const DefaultIcon = <LucideIcons.FileText className="h-5 w-5" />;
  
  const isActive = item.ruta && pathname === item.ruta;
  const hasActiveSubmenu = hasSubMenus && item.subMenus?.some(
    subItem => subItem.ruta && pathname === subItem.ruta
  );

  const toggleSubMenu = () => {
    if (hasSubMenus && !isCollapsed) setIsOpen(!isOpen);
  };

  const baseClasses = 'flex items-center justify-between p-3 rounded-lg transition-all duration-200 w-full';
  const activeClasses = isActive ? 'bg-primary-600 text-white shadow-md' : '';
  const hoverClasses = !isActive ? 'hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:shadow-sm' : '';
  const textClasses = isActive ? 'text-white' : 'text-text-primary hover:text-primary-700 dark:hover:text-primary-300';

  const renderContent = () => (
    <>
      <span className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
        <span className={isActive ? 'text-white' : 'text-text-secondary'}>
          {Icon || DefaultIcon}
        </span>
        {!isCollapsed && (
          <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
            {item.nombre}
          </span>
        )}
      </span>
      {!isCollapsed && hasSubMenus && (
        <LucideIcons.ChevronRight
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-90' : ''
          } ${isActive ? 'text-white' : 'text-text-secondary'}`}
        />
      )}
    </>
  );

  return (
    <li className="w-full">
      {hasSubMenus ? (
        <div
          onClick={toggleSubMenu}
          className={`${baseClasses} ${activeClasses} ${hoverClasses} ${textClasses} cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? item.nombre : undefined}
        >
          {renderContent()}
        </div>
      ) : item.ruta ? (
        <Link
          href={item.ruta}
          className={`${baseClasses} ${activeClasses} ${hoverClasses} ${textClasses} ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? item.nombre : undefined}
        >
          {renderContent()}
        </Link>
      ) : (
        <div 
          className={`${baseClasses} text-text-secondary cursor-not-allowed opacity-60 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? item.nombre : undefined}
        >
          {renderContent()}
        </div>
      )}

      {!isCollapsed && hasSubMenus && (isOpen || hasActiveSubmenu) && (
        <ul className="mt-2 space-y-1 border-l-2 border-primary-300 dark:border-primary-700 pl-3 ml-3 w-full">
          {item.subMenus!.map(subItem => (
            <MenuItemComponent key={subItem.id} item={subItem} isCollapsed={false} />
          ))}
        </ul>
      )}
    </li>
  );
};

const SideMenu: React.FC<SideMenuProps> = ({ menuItems }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } h-screen flex flex-col bg-bg-secondary border-r-2 border-border-default shadow-xl transition-all duration-300 overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        {/* Header del menú */}
        <div className={`p-4 pb-4 border-b-2 border-border-default shrink-0 ${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed ? (
            <>
              <h2 className="text-2xl font-bold text-primary-600">
                iCalidad
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Sistema de Gestión
              </p>
            </>
          ) : (
            <h2 className="text-2xl font-bold text-primary-600">
              iC
            </h2>
          )}
        </div>

        {/* Botón de colapsar/expandir */}
        <div className="p-4 shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors flex items-center justify-center"
            title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {isCollapsed ? (
              <LucideIcons.ChevronRight className="h-5 w-5 text-primary-600" />
            ) : (
              <LucideIcons.ChevronLeft className="h-5 w-5 text-primary-600" />
            )}
          </button>
        </div>

        {/* Navegación con scroll */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <MenuItemComponent key={item.id} item={item} isCollapsed={isCollapsed} />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default SideMenu;