import assert from "node:assert/strict";
import test from "node:test";
import { normalizeUrl, resourceSubmissionSchema, applicationSchema } from "../lib/validation.ts";

test("normalizes safe http and https URLs", () => {
  assert.equal(normalizeUrl("https://example.com/path#fragment"), "https://example.com/path");
  assert.throws(() => normalizeUrl("javascript:alert(1)"));
  assert.throws(() => normalizeUrl("data:text/html,test"));
});

test("resource submissions enforce lengths and required fields", () => {
  const valid = resourceSubmissionSchema.safeParse({
    title: "A useful documentation site", url: "https://example.com/",
    category: "Projects", subcategory: "Software Engineering",
    description: "A practical guide with clear examples for beginners.", tags: "Web, Projects",
  });
  assert.equal(valid.success, true);
  assert.equal(resourceSubmissionSchema.safeParse({}).success, false);
});

test("application tracker rejects unknown stages", () => {
  assert.equal(applicationSchema.safeParse({ company: "Example", position: "Intern", stage: "hired" }).success, false);
});
