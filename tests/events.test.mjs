import {test} from 'node:test';
import assert from 'node:assert/strict';
import {partitionEvents,formatDate,validateEvents} from '../src/events.mjs';
const event=(startDate,endDate=startDate)=>({eventName:'Example',startDate,endDate,sessionTitle:'Example session',speakers:['Speaker']});
test('an event stays upcoming throughout its last UTC calendar day',()=>{
 const e=event('2026-11-15','2026-11-16');
 assert.equal(partitionEvents([e],new Date('2026-11-16T23:59:59Z')).upcoming.length,1);
 assert.equal(partitionEvents([e],new Date('2026-11-17T00:00:00Z')).past.length,1);
});
test('offset timestamps produce the same UTC boundary',()=>{
 assert.equal(partitionEvents([event('2026-11-16')],new Date('2026-11-16T20:00:00-05:00')).past.length,1);
 assert.equal(formatDate('2024-05-02'),'May 2, 2024');
});
test('sorts upcoming ascending, past descending',()=>{
 const list=[event('2026-12-02'),event('2024-01-01'),event('2026-12-01'),event('2025-01-01')];
 const g=partitionEvents(list,new Date('2026-11-16T12:00Z'));
 assert.deepEqual(g.upcoming.map(e=>e.startDate),['2026-12-01','2026-12-02']);
 assert.deepEqual(g.past.map(e=>e.startDate),['2025-01-01','2024-01-01']);
});
test('rejects malformed dates, reversed ranges, and unsafe URLs',()=>{
 assert.throws(()=>validateEvents([event('2024-02-30')]));
 assert.throws(()=>validateEvents([event('2024-02-02','2024-02-01')]));
 assert.throws(()=>validateEvents([{...event('2024-02-02'),eventUrl:'javascript:alert(1)'}]));
});
