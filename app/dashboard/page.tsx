import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar para el menú */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 text-xl font-bold text-gray-800">Menú</div>
        <nav className="mt-4">
          {/* Aquí se cargará el menú dinámico */}
          <ul className="space-y-2">
            <li><a href="#" className="block p-2 text-gray-700 hover:bg-gray-200">Opción 1</a></li>
            <li><a href="#" className="block p-2 text-gray-700 hover:bg-gray-200">Opción 2</a></li>
            <li><a href="#" className="block p-2 text-gray-700 hover:bg-gray-200">Opción 3</a></li>
          </ul>
        </nav>
      </aside>

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
