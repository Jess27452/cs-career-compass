import type { Metadata } from "next"; import { RoadmapExplorer } from "@/components/explorers";
export const metadata:Metadata={title:"Roadmaps",description:"Practical, milestone-based CS career roadmaps."}; export default function Page(){return <RoadmapExplorer/>}
