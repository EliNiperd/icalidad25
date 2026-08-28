import { getEmpleadoById } from "@/lib/data/empleados";
import { getPuestosList } from "@/lib/data/puestos";
import { getRolesList } from "@/lib/data/roles";
//import CreateEditForm from "@/app/ui/empleados/create-edit-form";
import CreateEditForm from "@/app/ui/empleados/create-edit";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";

export default async function EditEmpleadoPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);

  const [empleado, puestos, roles] = await Promise.all([
    getEmpleadoById(id),
    getPuestosList(),
    getRolesList(),
  ]);

  if (!empleado) {
    notFound();
  }

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/icalidad/empleado">Empleados</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <CreateEditForm empleado={empleado} puestos={puestos} roles={roles} />
    </main>
  );
}