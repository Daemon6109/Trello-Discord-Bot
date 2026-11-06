import { test } from 'node:test';
import assert from 'node:assert/strict';
test('query fetches every Notion page with correct version and cursor', async () => {
 let mod; try { mod = await import('../src/notion.js'); } catch {}
 assert.ok(mod, 'Notion query implementation must exist');
 const requests=[]; const fetcher=async (url, init)=>{requests.push([url,init]); return {ok:true,json:async()=>requests.length===1?{results:[{id:'1'}],has_more:true,next_cursor:'next'}:{results:[{id:'2'}],has_more:false,next_cursor:null}}};
 const pages=await mod.queryTasks({token:'test', dataSourceId:'source', fetcher});
 assert.deepEqual(pages.map(x=>x.id),['1','2']);
 assert.match(requests[0][0],/data_sources\/source\/query$/);
 assert.equal(requests[0][1].headers['Notion-Version'],'2025-09-03');
 assert.equal(JSON.parse(requests[1][1].body).start_cursor,'next');
});
