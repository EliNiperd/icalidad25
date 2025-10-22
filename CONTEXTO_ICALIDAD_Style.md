# 📘 Contexto del Proyecto iCalidad - Sistema de Gestión de Calidad

## 🎯 Información General del Proyecto

**Nombre:** iCalidad - Sistema de Gestión de Calidad  
**Framework:** Next.js 14 (App Router)  
**Estilización:** Tailwind CSS v4  
**Gestión de Temas:** next-themes  
**Ubicación:** La Trinidad, Guanajuato, MX  
**Fecha de Inicio:** Octubre 2024

---

## 🎨 Sistema de Diseño y Tema

### Paleta de Colores Definida

#### Colores Primarios
```css
--color-primary-50: #eef3f5;
--color-primary-100: #cde0e7;
--color-primary-200: #a5cbdb;
--color-primary-300: #75b9d5;
--color-primary-400: #4bafd7;
--color-primary-500: #2da9dc;
--color-primary-600: #199ed4;  /* Color principal del sistema */
--color-primary-700: #1185b5;
--color-primary-800: #0b6b93;
--color-primary-900: #065170;
--color-primary-950: #034059;
```

#### Colores Secundarios
```css
--color-secondary-50: #a1c1cc;
--color-secondary-100: #7cb2c4;
--color-secondary-200: #53a3be;
--color-secondary-300: #3398ba;
--color-secondary-400: #218cb1;
--color-secondary-500: #167ea1;
--color-secondary-600: #0c6e8e;
--color-secondary-700: #085b77;
--color-secondary-800: #044960;
--color-secondary-900: #013547;
--color-secondary-950: #002836;
```

#### Colores Semánticos
```css
--color-success: #059669;  /* Verde para estados positivos */
--color-warning: #f59e0b;  /* Amarillo para advertencias */
--color-error: #ef4444;    /* Rojo para errores */
--color-info: #2196c5;     /* Azul para información */
```

### Variables de Tema (Light/Dark)

#### Tema Claro (Default)
```css
--color-bg-primary: #fafbfc;      /* Fondo principal */
--color-bg-secondary: #f3f5f7;    /* Fondo secundario */
--color-text-primary: #1e2328;    /* Texto principal */
--color-text-secondary: #46505a;  /* Texto secundario */
--color-border-default: #c8d2dc;  /* Bordes */
```

#### Tema Oscuro
```css
/* Se aplican en :root.dark */
--color-bg-primary: #12161c;
--color-bg-secondary: #192028;
--color-text-primary: #f0f2f5;
--color-text-secondary: #c8cdd2;
--color-border-default: #3c4855;
```

### Cómo Usar los Colores en Tailwind

```jsx
// Fondos
className="bg-bg-primary"           // Fondo principal
className="bg-bg-secondary"         // Fondo secundario
className="bg-primary-600"          // Color primario

// Textos
className="text-text-primary"       // Texto principal
className="text-text-secondary"     // Texto secundario

// Bordes
className="border-border-default"   // Borde default

// Semánticos
className="text-success"            // Texto verde
className="bg-error/10"             // Fondo rojo con opacidad
```

---

## 🗂️ Estructura del Proyecto

### Archivo de Estilos Global (`globals.css`)

```css
@import "tailwindcss";

@theme {
  /* Definición de todas las variables de color */
}

@layer base {
  /* Sobrescritura de variables en modo oscuro */
  :root.dark {
    --color-bg-primary: #12161c;
    /* ... más variables */
  }

  body {
    @apply bg-bg-primary text-text-primary;
    transition: background-color 0.2s, color 0.2s;
  }
}
```

### Layout Principal (`app/icalidad/layout.tsx`)

**Estructura:**
```
<div class="flex h-screen overflow-hidden">
  <SideMenu />                    // Menú colapsable
  <div class="flex-1 flex flex-col min-w-0">
    <header />                    // Barra superior con usuario
    <section class="overflow-y-auto">
      {children}                  // Contenido de cada página
    </section>
  </div>
</div>
```

**Características:**
- Menú lateral colapsable (64px colapsado, 256px expandido)
- Header fijo con información del usuario y botón de cerrar sesión
- Área de contenido con scroll independiente
- ThemeSwitcher integrado

---

## 🧩 Componentes Principales

### 1. ThemeProvider (`app/providers/theme-provider.tsx`)

```typescript
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

**Uso en RootLayout:**
```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### 2. ThemeSwitcher (`app/components/ThemeSwitcher.tsx`)

**Características clave:**
- Usa `useState` con `mounted` para evitar errores de hidratación
- Renderiza placeholder durante SSR
- Iconos: Moon (modo claro) / Sun (modo oscuro)
- Se integra en el header del layout

```typescript
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return <Button disabled>...</Button>;
}
```

### 3. SideMenu (`app/components/SideMenu.tsx`)

**Características:**
- Colapsable (botón con iconos ChevronLeft/ChevronRight)
- Detección automática de ruta activa con `usePathname()`
- Items activos con fondo `bg-primary-600`
- Submenús expandibles con hover mejorado
- Transición suave de 300ms
- Scroll interno independiente

**Estados visuales:**
- **Activo:** Fondo azul, texto blanco, sombra
- **Hover:** Fondo azul claro (solo en items no activos)
- **Colapsado:** Solo iconos, tooltip al hacer hover

**Estructura de MenuItem:**
```typescript
interface MenuItem {
  id: number;
  nombre: string;
  ruta?: string;
  icono?: string;
  subMenus?: MenuItem[];
}
```

### 4. DataTable (`app/components/ui/data-table.tsx`)

**Características:**
- Tabla genérica con TypeScript
- Encabezados con fondo `bg-primary-600` y texto blanco
- Ordenamiento por columnas (asc/desc)
- Búsqueda integrada
- Paginación con controles
- Hover en todas las filas (no solo clickeables)
- Renderizado personalizado por columna (ej: badges de estado)

**Props principales:**
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  totalRecords: number;
  totalPages: number;
  pageSize: number;
  onRowClick?: (row: T) => void;
  renderActions?: (row: T) => React.ReactNode;
  showRowNumber?: boolean;
}
```

**Estilo de encabezados:**
```css
bg-primary-600           // Fondo azul
text-white               // Texto blanco
font-bold                // Negrita
hover:bg-primary-700     // Hover más oscuro (columnas ordenables)
```

### 5. Formularios (Ejemplo: GerenciaForm)

**Características:**
- Ancho máximo: `max-w-xl` (640px)
- Validación con `react-hook-form` + `zod`
- Mensajes de error con iconos
- Mensajes de éxito con opciones de acción
- Estados de carga animados
- Campos con placeholders informativos
- Labels con asterisco (*) para campos requeridos

**Estructura de mensajes:**
```jsx
// Error
<div className="bg-error/10 border-2 border-error rounded-lg p-4">
  <AlertCircle className="h-5 w-5 text-error" />
  <p className="font-semibold text-error">Error al guardar</p>
</div>

// Éxito
<div className="bg-success/10 border-2 border-success rounded-lg p-4">
  <CheckCircle2 className="h-5 w-5 text-success" />
  <p className="font-semibold text-success">¡Éxito!</p>
</div>
```

**Badges de estado:**
```jsx
<span className={`px-3 py-1 rounded-full text-xs font-semibold ${
  isActivo 
    ? 'bg-success/20 text-success border border-success/30' 
    : 'bg-error/20 text-error border border-error/30'
}`}>
  {isActivo ? 'Activo' : 'Inactivo'}
</span>
```

---

## 🎭 Patrones de Diseño Aplicados

### 1. Consistencia Visual

**Bordes:**
- `border` - Bordes normales (1px)
- `border-2` - Bordes importantes (headers, cards principales)
- `border-border-default` - Color de borde del tema

**Sombras:**
- `shadow-sm` - Sombra sutil (hover)
- `shadow-md` - Sombra media (cards)
- `shadow-lg` - Sombra pronunciada (modales, elementos flotantes)
- `shadow-xl` - Sombra extra (sidebar)

**Espaciado:**
- `space-y-2` - Elementos relacionados
- `space-y-4` - Secciones dentro de un componente
- `space-y-6` - Secciones principales
- `p-4` - Padding estándar
- `p-6` - Padding de contenedores principales

### 2. Estados Interactivos

```css
/* Transiciones suaves */
transition-all duration-200       // Cambios rápidos
transition-all duration-300       // Cambios moderados
transition-colors                 // Solo colores

/* Hover */
hover:bg-primary-100             // Fondo claro
dark:hover:bg-primary-900/30     // Fondo oscuro con opacidad
hover:shadow-sm                  // Sombra sutil

/* Active/Focus */
focus:ring-2 focus:ring-primary-500
focus:outline-none
```

### 3. Responsive Design

```jsx
// Ocultar en móviles
className="hidden md:inline"

// Ajustar tamaños
className="text-sm md:text-base"
className="w-32 md:w-36"

// Grid responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## 🔧 Solución de Problemas Comunes

### Error de Hidratación con next-themes

**Problema:** `Warning: Expected server HTML to contain matching <svg>`

**Solución:** Usar patrón de mounting en ThemeSwitcher
```typescript
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return <PlaceholderButton />;
}
```

### Scroll Anidado en Sidebar

**Problema:** Al expandir submenús, el sidebar genera scroll interno

**Solución:** Estructura correcta con flex y overflow
```jsx
<aside className="h-screen flex flex-col overflow-hidden">
  <div className="shrink-0">{/* Header */}</div>
  <div className="shrink-0">{/* Botón */}</div>
  <nav className="flex-1 overflow-y-auto">{/* Menú */}</nav>
</aside>
```

### Hover Recortado en Submenús

**Problema:** El fondo hover no cubre todo el texto

**Solución:** Agregar `w-full` a elementos y ajustar márgenes
```jsx
<li className="w-full">
  <Link className="flex items-center w-full">...</Link>
</li>
```

### Campos de Formulario Muy Anchos

**Problema:** Los inputs se estiran demasiado en pantallas grandes

**Solución:** Usar `max-w-xl` (640px) en el contenedor del formulario
```jsx
<div className="max-w-xl mx-auto">
  <form>...</form>
</div>
```

---

## 📋 Checklist de Componentes Nuevos

Cuando crees un nuevo componente, asegúrate de:

- [ ] Usar colores del tema (`bg-bg-primary`, `text-text-primary`, etc.)
- [ ] Agregar soporte para modo oscuro automático
- [ ] Incluir transiciones suaves (`transition-all duration-200`)
- [ ] Usar bordes consistentes (`border-2` para importantes)
- [ ] Agregar estados hover apropiados
- [ ] Incluir iconos de Lucide React cuando sea apropiado
- [ ] Manejar estados de carga con spinners
- [ ] Validar con TypeScript (tipos explícitos)
- [ ] Considerar responsive design (md:, lg:)
- [ ] Agregar mensajes de error/éxito claros

---

## 🎨 Convenciones de Estilo

### Nombrado de Clases
```jsx
// ✅ Correcto
className="bg-bg-primary text-text-primary"

// ❌ Incorrecto
className="bg-white text-black dark:bg-gray-900"
```

### Orden de Clases (Recomendado)
1. Layout (flex, grid, display)
2. Tamaño (w-, h-, max-w-)
3. Espaciado (p-, m-, space-)
4. Tipografía (text-, font-)
5. Colores (bg-, text-, border-)
6. Bordes y sombras (border-, rounded-, shadow-)
7. Estados (hover:, focus:, dark:)
8. Animaciones (transition-, animate-)

### Ejemplo Completo
```jsx
className="
  flex items-center justify-between
  w-full max-w-xl
  p-4 space-x-3
  text-sm font-medium
  bg-bg-secondary text-text-primary border-2 border-border-default
  rounded-lg shadow-md
  hover:bg-primary-100 dark:hover:bg-primary-900/30
  transition-all duration-200
"
```

---

## 📦 Librerías y Dependencias Importantes

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "tailwindcss": "4.x",
    "next-themes": "^0.2.x",
    "lucide-react": "latest",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "zod": "^3.x"
  }
}
```

---

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint

# Formatear código
npm run format
```

---

## 📝 Notas Adicionales

### Restricciones de Tailwind v4
- **NO usar** clases personalizadas fuera de @theme
- **Usar solo** clases core de Tailwind
- **NO compilar** clases dinámicas en runtime

### Variables CSS vs Clases Tailwind
```css
/* ❌ No funciona automáticamente */
--color-light-bg-primary: #fafbfc;
className="bg-light-bg-primary"

/* ✅ Funciona con @theme */
--color-bg-primary: #fafbfc;
className="bg-bg-primary"
```

### Next.js 14 App Router
- Usar `'use client'` solo cuando sea necesario
- Server Components por defecto
- Layouts anidados para estructura
- No usar páginas del directorio `/pages`

---

## 🔮 Próximos Pasos Sugeridos

1. **Componentes pendientes:**
   - Modal/Dialog reutilizable
   - Toast/Notifications system
   - Breadcrumbs navigation
   - Loading skeletons

2. **Mejoras:**
   - Guardar estado del sidebar en localStorage
   - Agregar animaciones más complejas
   - Sistema de permisos visuales
   - Dark mode automático por hora

3. **Optimizaciones:**
   - Lazy loading de iconos
   - Memoización de componentes grandes
   - Virtual scrolling para tablas largas

---

## 📞 Información de Contacto del Proyecto

**Sistema:** iCalidad - Niperd  
**Descripción:** Sistema de gestión de calidad  
**Stack Principal:** Next.js 14 + Tailwind v4 + TypeScript

---

**Documento generado:** Octubre 2024  
**Última actualización:** Octubre 22, 2025  
**Versión:** 1.0

---

## 🎯 Tips Rápidos para Consultas Futuras

Cuando agregues nuevas funcionalidades, recuerda:

1. **Colores:** Usa siempre `bg-bg-primary`, `text-text-primary`, etc.
2. **Iconos:** Importa de `lucide-react`
3. **Tema:** El cambio de tema es automático con las variables CSS
4. **Formularios:** Ancho máximo `max-w-xl` para mejor UX
5. **Tablas:** Encabezados con `bg-primary-600 text-white`
6. **Hover:** Siempre incluye `transition-all duration-200`
7. **Mensajes:** Usa badges con `bg-success/20` o `bg-error/20`
8. **Layouts:** Scroll independiente por sección
9. **Botones:** Iconos a la izquierda, gap de `gap-2`
10. **Spacing:** `space-y-4` para secciones relacionadas

---

¡Este documento te servirá como referencia completa para mantener la consistencia del proyecto! 🚀