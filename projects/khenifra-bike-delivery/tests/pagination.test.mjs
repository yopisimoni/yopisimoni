import test from "node:test";
import assert from "node:assert/strict";
import { collectRows } from "../src/lib/pagination.ts";

test("includes records after the first 25 and 100 rows without losing the final page", async () => {
  const source = Array.from({ length: 225 }, (_, i) => ({ $id: String(i) }));
  const cursors = [];
  const result = await collectRows(async (cursor) => {
    cursors.push(cursor);
    const start = cursor === undefined ? 0 : Number(cursor) + 1;
    return { rows: source.slice(start, start + 100) };
  });
  assert.equal(result.rows.length, 225);
  assert.deepEqual(result.rows, source);
  assert.deepEqual(cursors, [undefined, "99", "199"]);
});
test("empty tables terminate and a broken backend cursor cannot loop forever", async () => {
  assert.deepEqual(await collectRows(async () => ({ rows: [] })), { rows: [] });
  await assert.rejects(collectRows(async () => ({ rows: [{ $id: "repeated" }] }), 1), /did not advance/);
});
