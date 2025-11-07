import { getProcesoById } from "@/lib/data/procesos";
import { getEmpleadosList } from "@/lib/data/empleados";
import CreateEditForm from "@/app/ui/procesos/create-edit-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";

export default async function EditProceso({ params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);

    const [proceso, empleados] = await Promise.all([
        getProcesoById(id),
        getEmpleadosList(),
    ]);

    if (!proceso) {
        notFound();
    }

    return (
        <>
            <main>
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/icalidad/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/icalidad/proceso">Procesos</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Editar</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <CreateEditForm proceso={proceso} empleados={empleados} />
            </main>
        </>
    );
}