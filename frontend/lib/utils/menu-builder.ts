import { RawMenuItem } from "@/lib/data/menu";

export interface MenuItem {
  id: number;
  nombre: string;
  icono: string;
  ruta: string;
  idPadre: number;
  orden: number;
  subMenus?: MenuItem[];
}

export function buildMenuTree(flatMenuItems: RawMenuItem[]): MenuItem[] {
  const menuMap = new Map<number, MenuItem>();
  const menuTree: MenuItem[] = [];

  // Paso 1: Inicializar el mapa con todos los items
  flatMenuItems.forEach(item => {
    menuMap.set(item.id, { ...item, subMenus: [] });
  });

  // Paso 2: Encontrar el ID del root (donde idPadre === id)
  const idRoot = flatMenuItems.find(item => item.idPadre === item.id)?.id;

  //console.log('ID Root encontrado:', idRoot);

  // Paso 3: Construir el árbol
  flatMenuItems.forEach(item => {
    const currentItem = menuMap.get(item.id)!;
    
    // Saltar el elemento root mismo (no lo agregamos al árbol)
    /*
    if (item.id === idRoot) {
      console.log('Saltando elemento root:', item.nombre);
      return;
    }
      */

    // Si el padre es el root, es un elemento de primer nivel
    if (item.idPadre === idRoot) {
      //console.log('Agregando al nivel superior:', item.nombre);
      menuTree.push(currentItem);
    } else {
      // Es un submenú, agregarlo al padre correspondiente
      const parent = menuMap.get(item.idPadre);
      if (parent) {
        //console.log(`Agregando "${item.nombre}" como hijo de "${parent.nombre}"`);
        parent.subMenus?.push(currentItem);
      } else {
        console.warn(`⚠️ No se encontró el padre (ID: ${item.idPadre}) para el item: ${item.nombre}`);
      }
    }
  });

  // Paso 4: Ordenar recursivamente
  const sortMenuItems = (items: MenuItem[]) => {
    items.sort((a, b) => a.orden - b.orden);
    items.forEach(item => {
      if (item.subMenus && item.subMenus.length > 0) {
        sortMenuItems(item.subMenus);
      }
    });
  };

  sortMenuItems(menuTree);

  // ⚠️ Debug info
  /*
  console.log('=== ÁRBOL FINAL ===');
  console.log('menuTree:', JSON.stringify(menuTree, null, 2));
  
  // Verificar que los submenús existen
  menuTree.forEach(item => {
    console.log(`${item.nombre} tiene ${item.subMenus?.length || 0} submenús`);
  });
  */
  
  return menuTree;
}