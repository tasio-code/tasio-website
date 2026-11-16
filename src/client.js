import {partitionEvents,formatDate} from './events.mjs';
const root = new URL('.', import.meta.url);
const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function refreshEvents(){
 const response = await fetch(new URL('data/events.json',root));
 if(!response.ok) return;
 const groups = partitionEvents(await response.json());
 const card = e => `<article class="event"><div class="event-date"><time datetime="${escape(e.startDate)}">${formatDate(e.startDate)}</time>${e.startDate!==e.endDate?`<span>to ${formatDate(e.endDate)}</span>`:''}</div><div><p class="eyebrow">${escape(e.eventName)}</p><h3>${escape(e.sessionTitle)}</h3><p>${escape(e.speakers.join(' & '))}${e.location?' · '+escape(e.location):''}</p>${e.description?`<p>${escape(e.description)}</p>`:''}${e.eventUrl?`<a href="${escape(e.eventUrl)}">Event details ↗</a>`:''}</div></article>`;
 document.querySelector('#upcoming').innerHTML = groups.upcoming.length ? groups.upcoming.map(card).join('') : '<div class="empty"><span class="small-orbit" aria-hidden="true">↗</span><div><h3>A little room for what’s next.</h3><p>No upcoming appearances are scheduled. We’ll share new dates here as they’re confirmed.</p></div></div>';
 document.querySelector('#past').innerHTML = groups.past.map(card).join('');
}
if(document.querySelector('#upcoming')) refreshEvents().catch(()=>{}); // Keep the built HTML on network failure.
const form = document.querySelector('#contact-form');
if(form){
 const button = form.querySelector('button'), status = document.querySelector('#form-status');
 const configured = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(form.action) && !form.action.includes('YOUR_FORM_ID');
 if(configured){button.disabled=false;document.querySelector('#form-note').textContent='All fields are required.';}
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!configured || !form.reportValidity()) return;
  if(!form.elements.namedItem('name').value.trim() || !form.elements.namedItem('message').value.trim()){status.textContent='Please enter your name and a message.';status.focus();return;}
  if(form.elements._gotcha.value) return;
  button.disabled=true;status.textContent='Sending your message…';
  try{
   const response = await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
   if(!response.ok) throw new Error('Request failed');
   form.reset();status.textContent='Thank you. Your message has been sent.';
  }catch{status.textContent='Your message could not be sent. Please try again. Your entries have been kept.';}
  finally{button.disabled=false;status.focus();}
 });
}
