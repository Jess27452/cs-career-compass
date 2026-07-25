import type { Metadata } from "next"; import { CareersExplorer } from "@/components/explorers";
export const metadata:Metadata={title:"Career Paths",description:"Compare fourteen computer science career paths."}; export default function Page(){return <CareersExplorer/>}
