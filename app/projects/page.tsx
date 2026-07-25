import type { Metadata } from "next"; import { ProjectsExplorer } from "@/components/explorers";
export const metadata:Metadata={title:"Project Ideas",description:"Career-specific computer science project briefs."}; export default function Page(){return <ProjectsExplorer/>}
