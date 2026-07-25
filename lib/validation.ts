import { z } from "zod";

export const safeUrlSchema = z.string().trim().max(2048).refine((raw) => {
  try { return ["http:","https:"].includes(new URL(raw).protocol); } catch { return false; }
}, "Only valid http and https links are allowed").transform((raw) => {
  const parsed = new URL(raw);
  parsed.hash = "";
  if ((parsed.protocol === "http:" && parsed.port === "80") || (parsed.protocol === "https:" && parsed.port === "443")) parsed.port = "";
  return parsed.toString();
});

export const resourceSubmissionSchema = z.object({
  title: z.string().trim().min(3).max(120),
  url: safeUrlSchema,
  category: z.string().min(1).max(80),
  shortDescription: z.string().trim().min(20).max(280),
  usefulFor: z.string().trim().min(10).max(240),
  pricingType: z.enum(["free", "paid", "freemium"]),
  resourceFormat: z.string().min(1).max(50),
  detailedDescription: z.string().trim().max(3000).optional(),
  tags: z.string().max(240).optional(),
});

export const applicationSchema = z.object({
  company: z.string().trim().min(1).max(100),
  position: z.string().trim().min(1).max(120),
  stage: z.enum(["interested","preparing","applied","online_assessment","recruiter_screen","technical_interview","behavioral_interview","final_round","offer","rejected","withdrawn","closed"]),
  jobUrl: z.union([safeUrlSchema,z.literal("")]).optional(),
  nextAction: z.string().trim().max(280).optional(),
  nextActionDate: z.string().optional(),
});

export const authSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
});

export function normalizeUrl(raw:string) {
  const result=safeUrlSchema.safeParse(raw);
  if(!result.success) throw new Error("Enter a safe http or https URL");
  return result.data;
}
