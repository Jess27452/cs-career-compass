import type { Metadata } from "next"; import { ResourcesExplorer } from "@/components/explorers";
export const metadata:Metadata={title:"Resource Library",description:"Trusted resources for CS learning and recruiting."}; export default function Page(){return <ResourcesExplorer/>}
