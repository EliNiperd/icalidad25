import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { getRawMenuItems } from "@/lib/data/menu";
import { buildMenuTree, MenuItem } from "@/lib/utils/menu-builder";
import SideMenu from "@/app/components/SideMenu"; // Importar el nuevo componente SideMenu

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Obtener idEmpleado y idRol de la sesión
  const idEmpleado = parseInt(session.user.id); // Asumiendo que user.id es el IdEmpleado
  const idRol = session.user.idRol; // Asumiendo que user.idRol está disponible en la sesión

  let menuTree: MenuItem[] = [];
  if (idEmpleado && idRol) {
    // Obtener todos los elementos del menú en formato plano (sin filtrar por padre aquí)
    const rawMenuItems = await getRawMenuItems(idEmpleado, idRol, null); 
    // Construir el árbol jerárquico del menú
    menuTree = buildMenuTree(rawMenuItems);
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar para el menú */}
      <SideMenu menuItems={menuTree} />

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col">
        {/* Barra superior con información del usuario */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {session.user && (
              <span className="text-gray-700">Bienvenido, {session.user.name || session.user.username}</span>
            )}
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Cerrar Sesión
              </button>
            </form>
          </div>
        </header>

        {/* Área de contenido del dashboard */}
        <section className="flex-1 p-6">
          <h2 className="text-xl font-semibold text-gray-800">Contenido Principal del Dashboard</h2>
          <p className="mt-4 text-gray-600">Aquí irá el contenido específico de cada sección.</p>
        </section>
      </main>
    </div>
  );
}
