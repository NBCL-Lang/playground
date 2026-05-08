import init, { run } from '../pkg/nbcl.js';
import wasmUrl from '../pkg/nbcl_bg.wasm?url'; 

let wasm_ready = false;

async function start() {
    try {
        await init(wasmUrl); 
        wasm_ready = true;
        self.postMessage({ type: 'ready' });
    } catch (e) {
        self.postMessage({ type: 'error', error: 'WASM init failed: ' + e.message });
    }
}

self.onmessage = async (e) => {
    if (e.data.type === 'run') {
        if (!wasm_ready) return;
        try {
            const raw = run(e.data.source);
            self.postMessage({ type: 'result', result: JSON.parse(raw) });
        } catch (err) {
            self.postMessage({ type: 'error', error: err.toString() });
        }
    }
};

start();