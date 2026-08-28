import { getGerenciasList } from "@/lib/data/gerencias"; // Importar la nueva función
import CreateEditForm from "@/app/ui/departamentos/create-edit-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

export default async function CreateDepartamentoPage() {
  // Obtener la lista de gerencias
  const gerencias = await getGerenciasList();

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbItem >
          <BreadcrumbLink href="/icalidad/departamento">Departamentos</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <CreateEditForm gerencias={gerencias} />
    </main>
  );
}