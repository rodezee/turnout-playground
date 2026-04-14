const editor = document.getElementById('code');
const highlightContent = document.getElementById('highlight-content');

/**
 * INITIALIZATION
 */
function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedCode = urlParams.get('code');
    const savedCode = localStorage.getItem('turnout_playground_code');

    if (sharedCode) {
        try {
            let base64 = sharedCode.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) { base64 += '='; }
            const decoded = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            editor.value = decoded;
        } catch (e) {
            console.error("Failed to decode shared code", e);
            editor.value = savedCode || getDefaultTemplate();
        }
    } else {
        editor.value = savedCode || getDefaultTemplate();
    }

    // Initialize both layers
    syncHighlight();
    updatePreview();
}

function getDefaultTemplate() {
    return `<!DOCTYPE html>\n<html>\n<head>\n  <title>Turnout Playground</title>\n</head>\n<body>\n  Enjoy!\n</body>\n</html>`;
}

/**
 * SYNCHRONOUS UI UPDATES (Fast)
 * This runs immediately on every keystroke
 */
function syncHighlight() {
    let code = editor.value;
    // Fix for Prism newline behavior
    if(code[code.length-1] === "\n") code += " ";
    
    highlightContent.textContent = code;
    Prism.highlightElement(highlightContent);
}

/**
 * ASYNC PREVIEW UPDATES (Debounced)
 * This reloads the heavy iframe
 */
function updatePreview() {
    const code = editor.value;
    localStorage.setItem('turnout_playground_code', code);
    
    const container = document.getElementById('preview-container');
    const ptitle = document.getElementById('preview-title');
    const oldIframe = document.getElementById('display');
    
    if (oldIframe) { oldIframe.remove(); }
    
    const newIframe = document.createElement('iframe');
    newIframe.id = 'display';
    container.appendChild(newIframe);
    
    const target = newIframe.contentWindow.document;
    target.open();
    target.write(code);
    target.close();
    
    ptitle.innerHTML = target.title || "";

    const observer = new MutationObserver(() => {
        ptitle.innerHTML = newIframe.contentWindow.document.title || "";
    });

    observer.observe(newIframe.contentWindow.document.querySelector('title') || newIframe.contentWindow.document.head, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

/**
 * SHARING & RESET
 */
function shareCode() {
    const code = editor.value;
    try {
        const base64 = btoa(encodeURIComponent(code).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) { return String.fromCharCode('0x' + p1); }));
        const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        const shareUrl = window.location.origin + window.location.pathname + '?code=' + urlSafeBase64;
        navigator.clipboard.writeText(shareUrl).then(() => { alert("Shareable link copied!"); });
    } catch (e) { alert("Encoding failed."); }
}

function resetDefault() {
    if(confirm("Reset playground?")) {
        localStorage.removeItem('turnout_playground_code');
        window.location.href = window.location.origin + window.location.pathname;
    }
}

/**
 * EVENT LISTENERS
 */
editor.addEventListener('scroll', () => {
    const layer = document.getElementById('highlight-layer');
    layer.scrollTop = editor.scrollTop;
    layer.scrollLeft = editor.scrollLeft;
});

// The secret sauce: Update text colors INSTANTLY, delay the IFRAME
editor.addEventListener('input', () => {
    syncHighlight(); // Immediate visual feedback
    
    clearTimeout(window.saveTimer);
    window.saveTimer = setTimeout(updatePreview, 800); // Delayed heavy lifting
});

init();
