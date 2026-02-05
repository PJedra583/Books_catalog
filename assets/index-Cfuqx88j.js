(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function l(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(e){if(e.ep)return;e.ep=!0;const n=l(e);fetch(e.href,n)}})();const h="favorites";function v(){return JSON.parse(localStorage.getItem(h))||[]}function g(d){localStorage.setItem(h,JSON.stringify(d))}function y(){const d=document.querySelector(".favorites .cards"),i=document.querySelector(".favorites .state"),l=v();if(d.innerHTML="",l.length===0){i.style.display="block";return}i.style.display="none",l.forEach(a=>{d.innerHTML+=`
      <div class="card">
        <div class="card__cover">
          ${a.cover_i?`<img src="https://covers.openlibrary.org/b/id/${a.cover_i}.jpg">`:"No cover"}
        </div>
        <div class="card__title">${a.title}</div>
        <div class="card__author">${a.author}</div>
        <div class="card__year">${a.year||"-"}</div>
        <button class="card__button card__button--remove" data-key="${a.key}">
          Remove
        </button>
      </div>
    `})}document.addEventListener("DOMContentLoaded",()=>{const d=document.querySelector("#theme-toggle"),i=localStorage.getItem("theme")||"dark";document.documentElement.setAttribute("data-theme",i),d.addEventListener("click",()=>{const r=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",r),localStorage.setItem("theme",r)});const l=document.querySelector(".search__input"),a=document.querySelector(".search__button"),e=document.querySelector(".results .cards");document.querySelector(".favorites .cards").addEventListener("click",t=>{if(!t.target.classList.contains("card__button--remove"))return;const r=t.target.dataset.key;let s=v();s=s.filter(c=>c.key!==r),g(s),y()}),e.addEventListener("click",t=>{if(!t.target.classList.contains("card__button"))return;const r=t.target.closest(".card"),s=t.target.dataset.key,c=r.querySelector(".card__title").textContent,u=r.querySelector(".card__author").textContent,m=r.querySelector(".card__year").textContent,_=r.querySelector("img"),S=_?_.src.match(/\/b\/id\/(\d+)/)?.[1]:null;let f=v();f.some(C=>C.key===s)||(f.push({key:s,title:c,author:u,year:m,cover_i:S}),g(f),y())});const o=document.querySelector(".results .state");function p(t,r=6){t.innerHTML="";for(let s=0;s<r;s++)t.innerHTML+=`
        <div class="card skeleton">
          <div class="skeleton-cover"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text short"></div>
          <div class="skeleton-button"></div>
        </div>
      `}function L(t,r){const s=v();t.innerHTML="",r.forEach(c=>{const u=s.some(m=>m.key===c.key);t.innerHTML+=`
      <div class="card">
        <div class="card__cover">
          ${c.cover_i?`<img src="https://covers.openlibrary.org/b/id/${c.cover_i}-M.jpg">`:'<div class="no-cover">No cover</div>'}
        </div>
        <div class="card__title">${c.title}</div>
        <div class="card__author">${c.author_name?c.author_name.join(", "):"Unknown"}</div>
        <div class="card__year">${c.first_publish_year||"-"}</div>
        <button class="card__button" data-key="${c.key}" ${u?"disabled":""}>
          ${u?"In Favorites":"Add to Favorites"}
        </button>
      </div>
    `})}a.addEventListener("click",async()=>{const t=l.value.trim();if(console.log("CLICK, QUERY =",t),!t){o.textContent="Enter a query",o.className="state state--info",e.innerHTML="";return}p(e),o.textContent="Loading...",o.className="state state--loading";try{const s=await(await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(t)}`)).json();if(console.log("FETCH DATA:",s),!s.docs||s.docs.length===0){e.innerHTML="",o.textContent="Nothing found",o.className="state state--error";return}L(e,s.docs.slice(0,12)),o.textContent=""}catch(r){console.error(r),e.innerHTML="",o.textContent="Network error",o.className="state state--error"}}),y()});
