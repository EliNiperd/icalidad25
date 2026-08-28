import { getNormativaById } from "@/lib/data/normativas";
import CreateEditForm from "@/app/ui/normativas/create-edit";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";

export default async function NormativaEditPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);

    // Obtener los datos de la normativa
    const normativa = await getNormativaById(id);

    if (!normativa) {
        notFound();
    }

    return (
        <main >
            <Breadcrumb>
                <BreadcrumbItem >
                    <BreadcrumbLink href="/icalidad/normativa">Normativas</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <CreateEditForm normativa={normativa} />
        </main>

    )
}