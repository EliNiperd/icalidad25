import { getPuestosList } from "@/lib/data/puestos"; 
import { getRolesList } from "@/lib/data/roles";
//import CreateEditForm from "@/app/ui/empleados/create-edit-form";
import CreateEditFormMejorado from "@/app/ui/empleados/create-edit";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

export default async function CreateEmpleadoPage() {
  // Obtener la lista de gerencias
  const puestos = await getPuestosList();
  // Obtener la lista de roles
  const roles = await getRolesList();

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbItem >
          <BreadcrumbLink href="/icalidad/empleado">Empleados</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <CreateEditFormMejorado puestos={puestos} roles={roles} />
    </main>
  );
}