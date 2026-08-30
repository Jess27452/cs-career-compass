import { CategoryPage } from "@/components/category-page";
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <CategoryPage slug="projects" subcategory={slug} />; }
