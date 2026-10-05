// Cursor pagination prevents dispatch, history and metrics silently stopping at 25 rows.
export async function collectRows<T extends { $id: string }>(
  fetchPage: (cursor?: string) => Promise<{ rows: T[] }>,
  pageSize = 100,
): Promise<{ rows: T[] }> {
  const rows: T[] = [];
  const cursors = new Set<string>();
  let cursor: string | undefined;
  for (;;) {
    const page = await fetchPage(cursor);
    rows.push(...page.rows);
    if (page.rows.length < pageSize) return { rows };
    const next = page.rows.at(-1)?.$id;
    if (!next || cursors.has(next)) throw new Error("Pagination cursor did not advance");
    cursors.add(next);
    cursor = next;
  }
}
