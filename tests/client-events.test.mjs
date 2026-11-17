import {test} from 'node:test';
import assert from 'node:assert/strict';

test('upcoming section appears for future events and hides after the last event expires', async () => {
  const previousDocument = globalThis.document, previousFetch = globalThis.fetch;
  const nodes = {'#upcoming': {innerHTML:''}, '#past': {innerHTML:''}, '#upcoming-section': {hidden:true}};
  let events = [];
  globalThis.document = {querySelector: selector => nodes[selector] ?? null};
  globalThis.fetch = async () => ({ok:true,json:async()=>events});
  try {
    const {refreshEvents} = await import('../src/client.js');
    await refreshEvents();
    assert.equal(nodes['#upcoming-section'].hidden,true);
    const appearance = {eventName:'Test event',startDate:'2099-01-01',endDate:'2099-01-01',sessionTitle:'Session',speakers:['Speaker']};
    events = [appearance];
    await refreshEvents();
    assert.equal(nodes['#upcoming-section'].hidden,false);
    assert.match(nodes['#upcoming'].innerHTML,/Test event/);
    events = [{...appearance,startDate:'2000-01-01',endDate:'2000-01-01'}];
    await refreshEvents();
    assert.equal(nodes['#upcoming-section'].hidden,true);
    assert.equal(nodes['#upcoming'].innerHTML,'');
    assert.match(nodes['#past'].innerHTML,/Test event/);
  } finally {
    globalThis.document = previousDocument;
    globalThis.fetch = previousFetch;
  }
});
