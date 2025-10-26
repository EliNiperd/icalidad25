import { getRequisitoById } from "@/lib/data/requisitos";
import { getNormativasList } from "@/lib/data/normativas";
import CreateEditForm from "@/app/ui/requisitos/create-edit-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";
export default async function EditRequisito({ params }: { params: { id: string } }){
    const id = parseInt(params.id, 10);

    const [requisito, normativas] = await Promise.all([
        getRequisitoById(id),
        getNormativasList(),
      ]);
    
      if (!requisito) {
        notFound();
      }

    return(
        <>
        <main>
              <Breadcrumb className="mb-6">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/icalidad/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/icalidad/requisito">Requisitos</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Editar</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <CreateEditForm requisito={requisito} normativas={normativas} />
            </main>
        </>
    )
}