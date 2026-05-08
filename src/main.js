import ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import './mode-nbcl.js';
import NBCLWorker from './worker.js?worker';

// State & Selectors
let worker;
let runTimeout;
const main = document.querySelector('main');
const output = document.getElementById('output');
const runBtn = document.getElementById('run-btn');
const stopBtn = document.getElementById('stop-btn');

// Editor Setup
const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/nbcl");
editor.setOptions({
    fontSize: "18px",
    fontFamily: "Consolas, 'Courier New', monospace",
    showPrintMargin: false,
    enableBasicAutocompletion: true,
});

// Examples Loader
const example_files = import.meta.glob('./examples/*.nbl', { query: '?raw', import: 'default', eager: true });
const examples = Object.entries(example_files).reduce((acc, [path, content]) => {
    acc[path.split('/').pop().replace('.nbl', '')] = content;
    return acc;
}, {});

// Layout & Tab Management
function setViewMode(mode) {
    main.classList.remove('layout-horizontal', 'layout-tabbed');
    main.classList.add(`layout-${mode}`);
    if (mode === 'tabbed') main.classList.add('show-editor');
    editor.resize();
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
    main.classList.remove('show-editor', 'show-output');
    main.classList.add(`show-${tabName === 'editor' ? 'editor' : 'output'}`);
    editor.resize();
}

// Worker Logic
function initWorker() {
    if (worker) worker.terminate();
    worker = new NBCLWorker();
    worker.onmessage = (e) => {
        const { type, result, error } = e.data;
        if (type === 'ready') {
            runBtn.disabled = false;
            runBtn.textContent = 'Run';
        } else if (type === 'result') {
            handleResult(result);
        } else if (type === 'error') {
            showOutput(error, 'error');
            resetUI();
        }
    };
}

function run() {
    const source = editor.getValue();
    if (!source.trim()) return;
    runBtn.disabled = true;
    stopBtn.disabled = false;
    showOutput('Running...', '');
    worker.postMessage({ type: 'run', source });
}

function stop() {
    initWorker();
    resetUI();
    output.textContent += '\n[Process Stopped]';
}

const resetUI = () => {
    runBtn.disabled = false;
    stopBtn.disabled = true;
    runBtn.textContent = 'Run';
};

function handleResult(res) {
    resetUI();
    if (res.ok) {
        const text = (res.output ? res.output + '\n' : '') + (res.result !== undefined ? `=> ${JSON.stringify(res.result)}` : '=> ()');
        showOutput(text, 'success');
    } else {
        showOutput(res.error, 'error');
    }
}

function showOutput(text, className) {
    output.textContent = text;
    output.className = className;
}

// Dropdown Management
function setupCustomSelect(id, callback) {
    const el = document.getElementById(id);
    const trigger = el.querySelector('.select-trigger');

    trigger.onclick = (e) => {
        e.stopPropagation();
        document.querySelectorAll('.custom-select').forEach(s => s !== el && s.classList.remove('active'));
        el.classList.toggle('active');
    };

    el.querySelectorAll('.option').forEach(opt => {
        opt.onclick = () => {
            const val = opt.dataset.value;
            el.querySelector('span').textContent = opt.textContent;
            el.classList.remove('active');
            callback(val);
        };
    });
}

// Initializers
window.addEventListener('click', () => document.querySelectorAll('.custom-select').forEach(s => s.classList.remove('active')));
runBtn.onclick = run;
stopBtn.onclick = stop;

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => switchTab(btn.dataset.tab);
});

setupCustomSelect('theme-select-custom', val => editor.setTheme(val));
setupCustomSelect('example-select-custom', val => editor.setValue(examples[val] || '', -1));
setupCustomSelect('view-select-custom', val => setViewMode(val));

editor.commands.addCommand({
    name: 'runCode',
    bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
    exec: run
});

// Auto-detect mobile and load default tabbed view
window.onload = () => {
    const isMobile = window.innerWidth <= 768;
    setViewMode(isMobile ? 'tabbed' : 'horizontal');
    if (isMobile) document.querySelector('#view-select-custom span').textContent = 'Tabbed';

    editor.setValue(examples.hello || '', -1);
    initWorker();
};