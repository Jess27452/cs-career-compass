import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);

async function render(path = "/") {
  const url = new URL(workerUrl);
  url.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(url.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the finished home page", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /CS Career Compass/);
  assert.match(html, /Turn your CS goals into a/);
  assert.match(html, /Explore Career Paths/);
  assert.doesNotMatch(html, /codex-preview|loading skeleton/i);
});

test("server-renders public directory routes", async () => {
  for (const path of ["/careers", "/projects", "/roadmaps", "/resources", "/community", "/recruiting", "/interview-prep"]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
  }
});
