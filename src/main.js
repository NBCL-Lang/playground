import ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

import './mode-nbcl.js';
import NBCLWorker from './worker.js?worker';
let worker;

const runBtn = document.getElementById('run-btn');
const stopBtn = document.getElementById('stop-btn');
const themeSelect = document.getElementById('theme-select');
const exampleSelect = document.getElementById('example-select');
const output = document.getElementById('output');
const example_files = import.meta.glob('./examples/*.nbl', { 
    query: '?raw', 
    import: 'default', 
    eager: true 
});

const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/nbcl");

editor.setOptions({
    fontSize: "18px",
    fontFamily: "Consolas, 'Courier New', monospace",
    showPrintMargin: false,
    enableBasicAutocompletion: true,
});

// Keybinding: Ctrl+Enter
editor.commands.addCommand({
    name: 'runCode',
    bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
    exec: run,
    readOnly: true
});

const examples = Object.entries(example_files).reduce((acc, [path, content]) => {
    const name = path.split('/').pop().replace('.nbl', '');
    acc[name] = content;
    return acc;
}, {});

function initWorker() {
    if (worker) worker.terminate();
    
    worker = new NBCLWorker();

    worker.onmessage = (e) => {
        const { type } = e.data;
        if (type === 'ready') {
            runBtn.disabled = false;
            runBtn.textContent = 'Run';
        } else if (type === 'result') {
            clearTimeout(runTimeout);
            handleResult(e.data.result);
        } else if (type === 'error') {
            clearTimeout(runTimeout);
            showOutput(e.data.error, 'error');
            runBtn.disabled = false;
            stopBtn.disabled = true;
        }
    };

    worker.onerror = (err) => {
        showOutput(`Worker Error: ${err.message}`, 'error');
        stop();
    };
}

let runTimeout;

function run() {
    const source = editor.getValue();
    if (!source.trim()) return;

    runBtn.disabled = true;
    stopBtn.disabled = false;
    showOutput('Running...', '');

    worker.postMessage({ type: 'run', source });
}

function stop() {
    clearTimeout(runTimeout);
    worker.terminate();
    initWorker();
    runBtn.disabled = false;
    stopBtn.disabled = true;
    runBtn.textContent = 'Run';
    output.textContent += '\n[Process Stopped]';
}

function handleResult(result) {
    runBtn.disabled = false;
    stopBtn.disabled = true;
    runBtn.textContent = 'Run';
    
    if (result.ok) {
        let text = '';
        if (result.output) text += result.output + '\n';
        if (result.result !== undefined) text += '=> ' + JSON.stringify(result.result);
        showOutput(text || '=> ()', 'success');
    } else {
        showOutput(result.error, 'error');
    }
}

function showOutput(text, className) {
    output.textContent = text;
    output.className = className;
}

// Dropdowns
function setupCustomSelect(containerId, onChange) {
    const container = document.getElementById(containerId);
    const trigger = container.querySelector('.select-trigger');
    const triggerText = trigger.querySelector('span');
    const options = container.querySelectorAll('.option');

    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
        document.querySelectorAll('.custom-select').forEach(cs => {
            if(cs !== container) cs.classList.remove('active');
        });
        container.classList.toggle('active');
        e.stopPropagation();
    });

    // Select option
    options.forEach(opt => {
        opt.addEventListener('click', () => {
            const value = opt.getAttribute('data-value');
            triggerText.textContent = opt.textContent;
            container.classList.remove('active');
            onChange(value);
        });
    });
}

// Event Listeners 
runBtn.addEventListener('click', run);
stopBtn.addEventListener('click', stop);

// Close dropdowns when clicking outside
window.addEventListener('click', () => {
    document.querySelectorAll('.custom-select').forEach(cs => cs.classList.remove('active'));
});

setupCustomSelect('theme-select-custom', (val) => {
    editor.setTheme(val);
});

setupCustomSelect('example-select-custom', (val) => {
    if (examples[val]) {
        editor.setValue(examples[val], -1);
    }
});

window.onload = function() {
    editor.setValue(examples.hello, -1);
};

// Initialize on load
initWorker();