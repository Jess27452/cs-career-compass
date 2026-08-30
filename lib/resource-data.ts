export type ResourceStatus = "pending" | "approved" | "rejected";

export type Resource = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  subcategory: string;
  tags: string[];
  submittedBy: string;
  submittedById?: string;
  avatarUrl?: string;
  createdAt: string;
  upvotes: number;
  status: ResourceStatus;
};

export const categories = [
  { slug: "coding", name: "Coding", description: "LeetCode, algorithms, and system design resources.", subcategories: ["LeetCode", "Algorithm Roadmaps", "System Design"] },
  { slug: "recruiting", name: "Recruiting", description: "OAs, interviews, and company recruiting experiences.", subcategories: ["OA Questions", "Technical Interview Questions", "Behavioral Interview Questions", "Company Interview Experiences", "GitHub Interview Repositories"] },
  { slug: "projects", name: "Projects", description: "Ideas, tutorials, and examples that help you build proof.", subcategories: ["Software Engineering", "Machine Learning", "Product Management"] },
  { slug: "resume", name: "Resume", description: "Templates, guides, and examples for stronger applications.", subcategories: ["US Resume Templates", "China Resume Templates", "Resume Guides", "Example Resumes"] },
  { slug: "opportunities", name: "Opportunities", description: "Internship lists, new-grad roles, and job boards.", subcategories: ["Internship Lists", "New Grad Lists", "Job Boards", "GitHub Internship Repositories"] },
] as const;

export const seedResources: Resource[] = [
  { id: "seed-1", title: "代码随想录", description: "A structured Chinese roadmap for algorithms and LeetCode practice.", url: "https://programmercarl.com/", category: "Coding", subcategory: "LeetCode", tags: ["Algorithms", "LeetCode", "Chinese"], submittedBy: "Jessica", createdAt: "2026-08-18", upvotes: 128, status: "approved" },
  { id: "seed-2", title: "NeetCode 150", description: "A curated collection of common coding interview questions organized by pattern.", url: "https://neetcode.io/practice/practice/neetcode150", category: "Coding", subcategory: "LeetCode", tags: ["Algorithms", "Patterns", "Interview Prep"], submittedBy: "Maya", createdAt: "2026-08-14", upvotes: 114, status: "approved" },
  { id: "seed-3", title: "Tech Interview Handbook", description: "A comprehensive guide to coding interviews, behavioral rounds, resumes, and recruiting.", url: "https://www.techinterviewhandbook.org/", category: "Recruiting", subcategory: "Technical Interview Questions", tags: ["Interviews", "Resume", "Free"], submittedBy: "Daniel", createdAt: "2026-08-09", upvotes: 96, status: "approved" },
  { id: "seed-4", title: "Summer Internship GitHub List", description: "A community-maintained list of software engineering internships.", url: "https://github.com/SimplifyJobs/Summer2026-Internships", category: "Opportunities", subcategory: "Internship Lists", tags: ["Internships", "GitHub", "Summer 2026"], submittedBy: "Avery", createdAt: "2026-08-25", upvotes: 89, status: "approved" },
  { id: "seed-5", title: "System Design Primer", description: "An open-source guide to designing scalable systems and preparing for system design interviews.", url: "https://github.com/donnemartin/system-design-primer", category: "Coding", subcategory: "System Design", tags: ["System Design", "GitHub", "Architecture"], submittedBy: "Chris", createdAt: "2026-08-03", upvotes: 81, status: "approved" },
  { id: "seed-6", title: "Full Stack Open", description: "A modern, project-driven course covering React, Node.js, testing, and deployment.", url: "https://fullstackopen.com/en/", category: "Projects", subcategory: "Software Engineering", tags: ["Full Stack", "React", "Projects"], submittedBy: "Noah", createdAt: "2026-07-29", upvotes: 67, status: "approved" },
  { id: "seed-7", title: "Jake's Resume", description: "A concise, ATS-friendly LaTeX resume template popular with software engineering students.", url: "https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs", category: "Resume", subcategory: "US Resume Templates", tags: ["Resume", "LaTeX", "ATS"], submittedBy: "Priya", createdAt: "2026-07-24", upvotes: 61, status: "approved" },
  { id: "seed-8", title: "Blind 75", description: "A focused list of essential LeetCode problems for technical interview preparation.", url: "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions", category: "Coding", subcategory: "LeetCode", tags: ["LeetCode", "Algorithms", "Interview Prep"], submittedBy: "Eli", createdAt: "2026-07-19", upvotes: 58, status: "approved" },
];

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
