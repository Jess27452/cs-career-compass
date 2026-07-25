import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migration = await readFile(new URL("../supabase/migrations/202607250001_initial_schema.sql", import.meta.url), "utf8");

test("private applications are owner-only", () => {
  assert.match(migration, /own applications only[\s\S]*user_id=auth\.uid\(\)/);
});
test("resources enforce owner and administrator policies", () => {
  assert.match(migration, /owners edit resources[\s\S]*submitted_by=auth\.uid\(\)/);
  assert.match(migration, /admins manage resources[\s\S]*public\.is_admin\(\)/);
});
test("duplicate votes and bookmarks use composite primary keys", () => {
  assert.match(migration, /resource_votes[\s\S]*primary key\(user_id,resource_id\)/);
  assert.match(migration, /resource_bookmarks[\s\S]*primary key\(user_id,resource_id\)/);
});
test("hidden resources are excluded from public reads", () => {
  assert.match(migration, /visible resources[\s\S]*visibility_status='visible' and deleted_at is null/);
});
