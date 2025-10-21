import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { getRawMenuItems } from "@/lib/data/menu";
import { buildMenuTree, MenuItem } from "@/lib/utils/menu-builder";
import SideMenu from "@/app/components/SideMenu";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch menu items
  const idEmpleado = parseInt(session.user.id); // Assuming user.id is IdEmpleado
  const idRol = session.user.idRol; // Assuming user.idRol is available in session

  let menuTree: MenuItem[] = [];
  if (idEmpleado && idRol) {
    const rawMenuItems = await getRawMenuItems(idEmpleado, idRol, null); // Fetch top-level menus
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
          <h1 className="text-2xl font-bold text-gray-800">iCalidad Dashboard</h1>
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

        {/* Área de contenido dinámico */}
        <section className="flex-1 p-6 overflow-auto">
          {children}
        </section>
      </main>
    </div>
  );
}
