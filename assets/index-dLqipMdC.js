(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`fn fibonacci(n) {
    local a = 0
    local b = 1
    
    for i in 0..n { 
        print(a)
        
        local temp = a
        set a = b
        set b = temp + b
    }
}

fibonacci(10)`,t=`print("Hello, World!")`,n=`local x = 10
local y = 20
local result = (x + y) * 2
print(result)`,r=`Object "web_server" {
    port = 8080
    protocol = "https"
}`;function i(e){return new Worker(`/assets/worker-Ch8hIjH-.js`,{name:e?.name})}var a,o=document.getElementById(`run-btn`),s=document.getElementById(`stop-btn`);document.getElementById(`theme-select`),document.getElementById(`example-select`);var c=document.getElementById(`output`),l=Object.assign({"./examples/fibonacci.nbl":e,"./examples/hello.nbl":t,"./examples/math.nbl":n,"./examples/nodes.nbl":r}),u=ace.edit(`editor`);u.setTheme(`ace/theme/monokai`),u.session.setMode(`ace/mode/python`),u.setOptions({fontSize:`18px`,fontFamily:`Consolas, 'Courier New', monospace`,showPrintMargin:!1,enableBasicAutocompletion:!0}),u.commands.addCommand({name:`runCode`,bindKey:{win:`Ctrl-Enter`,mac:`Command-Enter`},exec:m,readOnly:!0});var d=Object.entries(l).reduce((e,[t,n])=>{let r=t.split(`/`).pop().replace(`.nbl`,``);return e[r]=n,e},{});function f(){a&&a.terminate(),a=new i,a.onmessage=e=>{let{type:t}=e.data;t===`ready`?(o.disabled=!1,o.textContent=`Run`):t===`result`?(clearTimeout(p),g(e.data.result)):t===`error`&&(clearTimeout(p),_(e.data.error,`error`),o.disabled=!1,s.disabled=!0)},a.onerror=e=>{_(`Worker Error: ${e.message}`,`error`),h()}}var p;function m(){let e=u.getValue();e.trim()&&(o.disabled=!0,s.disabled=!1,_(`Running...`,``),a.postMessage({type:`run`,source:e}))}function h(){clearTimeout(p),a.terminate(),f(),o.disabled=!1,s.disabled=!0,o.textContent=`Run`,c.textContent+=`
[Process Stopped]`}function g(e){if(o.disabled=!1,s.disabled=!0,o.textContent=`Run`,e.ok){let t=``;e.output&&(t+=e.output+`
`),e.result!==void 0&&(t+=`=> `+JSON.stringify(e.result)),_(t||`=> ()`,`success`)}else _(e.error,`error`)}function _(e,t){c.textContent=e,c.className=t}function v(e,t){let n=document.getElementById(e),r=n.querySelector(`.select-trigger`),i=r.querySelector(`span`),a=n.querySelectorAll(`.option`);r.addEventListener(`click`,e=>{document.querySelectorAll(`.custom-select`).forEach(e=>{e!==n&&e.classList.remove(`active`)}),n.classList.toggle(`active`),e.stopPropagation()}),a.forEach(e=>{e.addEventListener(`click`,()=>{let r=e.getAttribute(`data-value`);i.textContent=e.textContent,n.classList.remove(`active`),t(r)})})}o.addEventListener(`click`,m),s.addEventListener(`click`,h),window.addEventListener(`click`,()=>{document.querySelectorAll(`.custom-select`).forEach(e=>e.classList.remove(`active`))}),v(`theme-select-custom`,e=>{u.setTheme(e)}),v(`example-select-custom`,e=>{d[e]&&u.setValue(d[e],-1)}),window.onload=function(){u.setValue(d.hello,-1)},f();