/* Dark mode for every page. Add <script src="theme.js"></script> in each page's <head>. */
(function(){
  var KEY="theme",root=document.documentElement;
  function saved(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function current(){return saved()||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light")}
  function apply(t){
    root.setAttribute("data-theme",t);
    var m=document.querySelector('meta[name="theme-color"]');
    if(m)m.setAttribute("content",t==="dark"?"#14132b":"#f6f5ff");
  }
  apply(current()); // runs before the page paints, so there is no flash

  var css=`
html[data-theme=dark]{--bg:#14132b;--ink:#ecebff;--muted:#a9a8c9;--lilac:#383266;--mint:#1f4a3a;--sky:#1f3b5c;--peach:#5a3434;--butter:#554a1e;--rose:#582f49;--accent:#7b6ff2;color-scheme:dark}
html[data-theme=dark] body{background:linear-gradient(160deg,#14132b,#10201b 60%,#241615) fixed;color:var(--ink)}
html[data-theme=dark] .bgl::after{content:"";position:absolute;inset:0;background:#15142b;opacity:.88}
html[data-theme=dark] .card,html[data-theme=dark] .box,html[data-theme=dark] .trend{background:rgba(32,31,62,.82)}
html[data-theme=dark] .d,html[data-theme=dark] .u div,html[data-theme=dark] .step li{background:rgba(255,255,255,.09)}
html[data-theme=dark] .drop{background:rgba(255,255,255,.05)}
html[data-theme=dark] input,html[data-theme=dark] textarea,html[data-theme=dark] select{background:#1b1a35;border-color:#3c3a66;color:var(--ink)}
html[data-theme=dark] .btn.alt,html[data-theme=dark] .pk button{background:#24234a;color:var(--ink)}
html[data-theme=dark] .d:hover{background:var(--lilac)}
html[data-theme=dark] .del{color:#ff8a80}
html[data-theme=dark] .box .msg{color:#ff8a80}
html[data-theme=dark] .ev{border-bottom-color:rgba(255,255,255,.14)}
html[data-theme=dark] .tile::after{background:radial-gradient(220px circle at var(--x,50%) var(--y,50%),rgba(255,255,255,.16),transparent 70%)}
html.theme-anim *{transition:background-color .35s,color .35s,border-color .35s!important}
#themeBtn{position:fixed;top:12px;right:12px;z-index:50;display:inline-flex;align-items:center;gap:0;height:40px;padding:0 11px;border:0;border-radius:999px;font:500 14px "DM Sans",system-ui,sans-serif;color:#27264a;background:rgba(255,255,255,.9);box-shadow:0 4px 14px -4px rgba(39,38,74,.35),inset 0 0 0 1.5px #27264a;cursor:pointer;transition:transform .2s}
#themeBtn:hover{transform:translateY(-2px)}
#themeBtn .t{max-width:0;overflow:hidden;white-space:nowrap;opacity:0;transition:max-width .3s,opacity .3s,margin .3s}
#themeBtn:hover .t,#themeBtn:focus-visible .t{max-width:100px;opacity:1;margin-right:8px}
#themeBtn .i{position:relative;width:18px;height:18px;flex:none}
#themeBtn svg{position:absolute;inset:0;width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .45s cubic-bezier(.3,1.4,.5,1),opacity .3s}
#themeBtn .moon{transform:rotate(0)}
#themeBtn .sun{opacity:0;transform:rotate(-90deg) scale(.5)}
html[data-theme=dark] #themeBtn{color:#ecebff;background:rgba(36,35,74,.92);box-shadow:0 4px 14px -4px rgba(0,0,0,.6),inset 0 0 0 1.5px #ecebff}
html[data-theme=dark] #themeBtn .moon{opacity:0;transform:rotate(90deg) scale(.5)}
html[data-theme=dark] #themeBtn .sun{opacity:1;transform:none}
@media (max-width:1100px){html .wrap{padding-top:66px}}
@media (prefers-reduced-motion:reduce){#themeBtn,#themeBtn *{transition:none!important}}
`;
  var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);

  function build(){
    var b=document.createElement("button");
    b.id="themeBtn";b.type="button";
    b.innerHTML='<span class="t"></span><span class="i" aria-hidden="true">'+
      '<svg class="moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'+
      '<svg class="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></span>';
    function label(){
      var dark=root.getAttribute("data-theme")==="dark";
      b.querySelector(".t").textContent=dark?"Light mode":"Dark mode";
      b.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode");
      b.title=dark?"Light mode":"Dark mode";
    }
    label();
    b.onclick=function(){
      var next=root.getAttribute("data-theme")==="dark"?"light":"dark";
      root.classList.add("theme-anim");
      apply(next);label();
      try{localStorage.setItem(KEY,next)}catch(e){}
      setTimeout(function(){root.classList.remove("theme-anim")},450);
    };
    document.body.appendChild(b);
    // keep other open tabs in sync
    addEventListener("storage",function(e){if(e.key===KEY&&e.newValue){apply(e.newValue);label()}});
  }
  if(document.body)build();else document.addEventListener("DOMContentLoaded",build);
})();
