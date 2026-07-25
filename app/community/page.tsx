import type { Metadata } from "next"; import { CommunityExplorer } from "@/components/explorers";
export const metadata:Metadata={title:"Community",description:"Career questions and practical answers from students."}; export default function Page(){return <CommunityExplorer/>}
