import { getDepartamentosList } from "@/lib/data/departamentos";
import CreateEditForm from "@/app/ui/puestos/create-edit-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

export default async function CreatePuestoPage() {
  const departamentos = await getDepartamentosList();

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/icalidad/puesto">Puestos</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <CreateEditForm departamentos={departamentos} />
    </main>
  );
}