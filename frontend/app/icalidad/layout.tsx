import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { getRawMenuItems } from "@/lib/data/menu";
import { buildMenuTree, MenuItem } from "@/lib/utils/menu-builder";
import SideMenu from "@/app/components/SideMenu";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";

export default async function IcalidadLayout({
  children,
}: { 
  children: React.ReactNode 
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const idEmpleado = parseInt(session.user.id);
  const idRol = session.user.idRol;

  let menuTree: MenuItem[] = [];
  if (idEmpleado && idRol) {
    const rawMenuItems = await getRawMenuItems(idEmpleado, idRol, null);
    menuTree = buildMenuTree(rawMenuItems);
  }

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* Sidebar */}
      <SideMenu menuItems={menuTree} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-bg-secondary shadow-md p-4 flex justify-between items-center border-b-2 border-border-default shrink-0">
          <h1 className="text-2xl font-bold text-primary-600">iCalidad</h1>
          <div className="flex items-center space-x-4">
            <span className="text-text-secondary text-sm hidden md:inline">
              Bienvenido, <span className="font-semibold text-text-primary">{session.user.name || session.user.username}</span>
            </span>
            <ThemeSwitcher />
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button variant="destructive" size="sm" className="bg-error hover:bg-error/90">
                Cerrar Sesión
              </Button>
            </form>
          </div>
        </header>

        {/* Área de contenido con scroll independiente */}
        <section className="flex-1 overflow-y-auto bg-bg-primary">
          <div className="p-6 max-w-[1600px] mx-auto">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}