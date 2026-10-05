import test from 'node:test';
import assert from 'node:assert/strict';
import { customerTimeline } from '../src/lib/tracking-events.ts';
test('timeline excludes private incidents, other deliveries and other owners and strips notes', () => {
  const base = {delivery_id:'d', status:'assigned',created_at:'2026-10-05T12:00:00Z',$permissions:['read("user:c")'],note:'private phone',actor_id:'admin'};
  const rows = [{...base,$id:'2'}, {...base,$id:'1',status:'requested',created_at:'2026-10-05T11:00:00Z'}, {...base,$id:'private',$permissions:[]}, {...base,$id:'other',delivery_id:'other'}, {...base,$id:'wrongOwner',$permissions:['read("user:x")']}, {...base,$id:'badDate',created_at:'invalid'}];
  assert.deepEqual(customerTimeline(rows,'d','c'), [{id:'1',status:'requested',createdAt:'2026-10-05T11:00:00Z'},{id:'2',status:'assigned',createdAt:'2026-10-05T12:00:00Z'}]);
});
