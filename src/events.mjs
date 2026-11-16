export function partitionEvents(events, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  return {
    upcoming: events.filter(e => e.endDate >= today).sort((a,b) => a.startDate.localeCompare(b.startDate)),
    past: events.filter(e => e.endDate < today).sort((a,b) => b.startDate.localeCompare(a.startDate))
  };
}
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(date + 'T12:00:00Z'));
}
export function validateEvents(events) {
  for (const e of events) {
    for (const key of ['eventName','startDate','endDate','sessionTitle']) if (!e[key]) throw new Error(`Missing ${key}`);
    for (const key of ['startDate','endDate']) if (!/^\d{4}-\d{2}-\d{2}$/.test(e[key]) || new Date(e[key]).toISOString().slice(0,10) !== e[key]) throw new Error(`Invalid ${key}`);
    if (e.endDate < e.startDate || !Array.isArray(e.speakers) || !e.speakers.length) throw new Error('Invalid event range or speakers');
    if (e.eventUrl && !/^https:\/\//.test(e.eventUrl)) throw new Error('Event URL must use HTTPS');
  }
}
