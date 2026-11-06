export async function queryTasks({token, dataSourceId, fetcher = fetch, baseUrl = 'https://api.notion.com/v1'}) {
  let cursor; const pages = []; const seen = new Set();
  do {
    const response = await fetcher(`${baseUrl}/data_sources/${encodeURIComponent(dataSourceId)}/query`, {
      method: 'POST', headers: {Authorization: `Bearer ${token}`, 'Notion-Version': '2025-09-03', 'Content-Type': 'application/json'},
      body: JSON.stringify({page_size: 100, ...(cursor ? {start_cursor: cursor} : {})}), signal: AbortSignal.timeout(15000)
    });
    let data; try { data = await response.json(); } catch { throw new Error(`Notion returned invalid JSON (HTTP ${response.status})`); }
    if (!response.ok) throw new Error(`Notion request failed (HTTP ${response.status}; ${data.code || 'unknown_error'})`);
    if (!Array.isArray(data.results)) throw new Error('Notion returned an invalid results list');
    pages.push(...data.results);
    if (!data.has_more) break;
    cursor = data.next_cursor;
    if (!cursor || seen.has(cursor)) throw new Error('Notion returned an invalid pagination cursor');
    seen.add(cursor);
  } while (true);
  return pages;
}
