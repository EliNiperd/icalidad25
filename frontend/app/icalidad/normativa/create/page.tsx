import CreateEditForm from "@/app/ui/normativas/create-edit";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

export default async function NormativaCreatePage() {
    
  return (
    <main>
      <Breadcrumb>
        <BreadcrumbItem >
          <BreadcrumbLink href="/icalidad/normativa">Normativas</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <CreateEditForm />
    </main>
  );
}