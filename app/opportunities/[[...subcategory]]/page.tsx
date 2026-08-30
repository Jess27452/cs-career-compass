import { CategoryPage } from "@/components/category-page";
export default async function Page({ params }: { params: Promise<{ subcategory?: string[] }> }) { const { subcategory } = await params; return <CategoryPage slug="opportunities" subcategory={subcategory?.[0]} />; }
