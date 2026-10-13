import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { getRawMenuItems } from "@/lib/data/menu";
import { buildMenuTree, MenuItem } from "@/lib/utils/menu-builder";
import SideMenu from "@/app/components/SideMenu";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { APP_VERSION, APP_NAME } from "@/lib/constants";

export default async function IcalidadLayout({
  children,
}: { 
  children: React.ReactNode 
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  let menuTree: MenuItem[] = [];
  try {
    const rawMenuItems = await getRawMenuItems();
    menuTree = buildMenuTree(rawMenuItems);
  } catch (error) {
    console.error("Error building menu tree:", error);
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

        {/* Footer global inferior fijo */}
        <footer className="bg-bg-secondary border-t border-border-default px-6 py-2 flex justify-between items-center text-xs text-text-secondary shrink-0 select-none">
          <div className="flex items-center space-x-2">
            <span>© {new Date().getFullYear()} {APP_NAME}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Sistema de Gestión de Calidad</span>
          </div>
          <div className="flex items-center space-x-2 font-mono">
            <span className="font-semibold text-text-primary">{APP_VERSION}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}