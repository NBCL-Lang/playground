let wasm_ready = false;
let nbcl;

async function init() {
    nbcl = await import('/pkg/nbcl.js');
    await nbcl.default();
    wasm_ready = true;
    self.postMessage({ type: 'ready' });
}

self.onmessage = async (e) => {
    if (e.data.type === 'run') {
        if (!wasm_ready) {
            self.postMessage({ type: 'error', error: 'WASM not ready yet' });
            return;
        }

        try {
            const raw = nbcl.run(e.data.source);
            const result = JSON.parse(raw);
            self.postMessage({ type: 'result', result });
        } catch (err) {
            self.postMessage({ type: 'error', error: err.message });
        }
    }
};

init();