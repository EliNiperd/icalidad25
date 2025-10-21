'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MenuItem } from "@/lib/utils/menu-builder";
import * as LucideIcons from 'lucide-react';

interface SideMenuProps {
  menuItems: MenuItem[];
}

const getLucideIcon = (iconName: string | undefined) => {
  if (!iconName) return null;
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
};

const MenuItemComponent: React.FC<{ item: MenuItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasSubMenus = item.subMenus && item.subMenus.length > 0;
  const Icon = getLucideIcon(item.icono);
  const DefaultIcon = <LucideIcons.FileText className="h-5 w-5 text-gray-500" />;

  const toggleSubMenu = () => {
    if (hasSubMenus) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <li>
      {/* CAMBIO CRÍTICO: Priorizar submenús sobre ruta */}
      {hasSubMenus ? (
        // Si tiene submenús, renderizar como div clickeable
        <div
          onClick={toggleSubMenu}
          className="flex items-center justify-between p-2 text-gray-700 hover:bg-gray-200 rounded-md cursor-pointer"
        >
          <span className="flex items-center">
            <span className="mr-2 flex items-center">
              {Icon ? (
                Icon
              ) : (
                <>
                  {DefaultIcon}
                  <span className="ml-1 text-xs text-gray-500">(s/i)</span>
                </>
              )}
            </span>
            {item.nombre}
          </span>
          <LucideIcons.ChevronRight 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} 
          />
        </div>
      ) : item.ruta ? (
        // Si NO tiene submenús pero tiene ruta, renderizar como Link
        <Link href={item.ruta} className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md">
          <span className="mr-2 flex items-center">
            {Icon ? (
              Icon
            ) : (
              <>
                {DefaultIcon}
                <span className="ml-1 text-xs text-gray-500">(s/i)</span>
              </>
            )}
          </span>
          {item.nombre}
        </Link>
      ) : (
        // Si NO tiene ni submenús ni ruta, renderizar como div simple
        <div className="flex items-center p-2 text-gray-500 rounded-md">
          <span className="mr-2 flex items-center">
            {Icon ? (
              Icon
            ) : (
              <>
                {DefaultIcon}
                <span className="ml-1 text-xs text-gray-500">(s/i)</span>
              </>
            )}
          </span>
          {item.nombre}
        </div>
      )}

      {/* Renderizar submenús cuando isOpen es true */}
      {hasSubMenus && isOpen && (
        <ul className="ml-4 mt-2 space-y-2 border-l-2 border-gray-300 pl-2">
          {item.subMenus?.map(subItem => (
            <MenuItemComponent key={subItem.id} item={subItem} />
          ))}
        </ul>
      )}
    </li>
  );
};

const SideMenu: React.FC<SideMenuProps> = ({ menuItems }) => {
  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <div className="text-xl font-bold text-gray-800 mb-4">Menú</div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map(item => (
            <MenuItemComponent key={item.id} item={item} />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SideMenu;