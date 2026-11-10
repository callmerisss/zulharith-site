// Shared by login, notegen, timetable and projects.
const SB_URL="https://mesaszwdqcrzlpwnlhzf.supabase.co",SB_KEY="sb_publishable_ufV3JHtv5IZXw3UqZlLLXw_Qqv_NnME";
const AI_API="https://zulharith-ai.YOUR-SUBDOMAIN.workers.dev"; // <- your AI worker URL (see steps)
const sb=supabase.createClient(SB_URL,SB_KEY),$=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const NEXT=["/tools","/notegen","/timetable","/projects"],safeNext=n=>NEXT.includes(n)?n:"/tools"; // only these may be redirect targets

// Weekly logout: stay signed in until a new week (Sunday) starts AND the user has been idle for 30 minutes.
const IDLE=30*60*1000,wk=t=>Math.floor((t-new Date(t).getTimezoneOffset()*6e4-2592e5)/6048e5); // week number, weeks start Sunday
const rd=k=>{try{return+localStorage.getItem(k)||0}catch(e){return 0}},wr=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const lastAct=()=>Math.max(rd("ua"),rd("lastActive")); // "lastActive" is written by the admin pages (common.js)
const mark=()=>{wr("ua",Date.now());wr("lastActive",Date.now());wr("uw",wk(Date.now()))}; // "active now, in this week"
function out(){
  const done=()=>{try{Object.keys(localStorage).filter(k=>/^sb-.*-auth-token/.test(k)||k==="ua"||k==="uw"||k==="lastActive").forEach(k=>localStorage.removeItem(k))}catch(e){}location.replace("/login")};
  Promise.race([sb.auth.signOut({scope:"local"}),new Promise(r=>setTimeout(r,1500))]).catch(()=>{}).then(done);
}
async function guard(title,start){
  const path=location.pathname.replace(/\.html$/,""),{data}=await sb.auth.getSession();
  if(!data.session){location.replace("/login?next="+encodeURIComponent(path));return}
  const now=Date.now(),la=lastAct();
  if(la&&now-la>IDLE&&wk(now)>rd("uw")){out();return} // idle AND a new week began
  mark();
  let t=0;const act=()=>{const n=Date.now();if(n-t>10000){t=n;mark()}};
  ["pointerdown","keydown","scroll","touchstart"].forEach(e=>addEventListener(e,act,{passive:true}));
  setInterval(()=>{const n=Date.now();if(n-lastAct()>IDLE&&wk(n)>rd("uw"))out()},30000);
  sb.auth.onAuthStateChange(e=>{if(e==="SIGNED_OUT")location.replace("/login")});
  $("bar").innerHTML=`<div><a class="back" href="/tools">← Tools</a><h1>${esc(title)}</h1></div><button class="btn sm" id="out">Log out</button>`;
  $("out").onclick=out;$("m").hidden=false;
  start(data.session.user);
}
