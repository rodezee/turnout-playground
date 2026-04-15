const editor = document.getElementById('code');
const highlightContent = document.getElementById('highlight-content');
const highlightLayer = document.getElementById('highlight-layer');

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
        } finally {
            // cleanup the url, ready for edit save and refresh
            history.pushState(null, null, "/");
        }
    } else {
        editor.value = savedCode || getDefaultTemplate();
    }

    syncHighlight();
    updatePreview();
}

/**
 * SHARING
 * Encodes the current editor content into a URL-safe Base64 string.
 */
function shareCode() {
    const code = editor.value;
    try {
        // We use encodeURIComponent + a replacement regex to safely handle 
        // Unicode characters before converting to Base64
        const base64 = btoa(encodeURIComponent(code).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));

        // Make the Base64 URL-friendly (replaces +, / and removes =)
        const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        
        const shareUrl = window.location.origin + window.location.pathname + '?code=' + urlSafeBase64;

        // Copy to clipboard and notify user
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert("Shareable link copied to clipboard!");
        });
    } catch (e) {
        console.error("Encoding failed", e);
        alert("Sorry, failed to generate a share link for this code.");
    }
}

function getDefaultTemplate() {
    return `<!DOCTYPE html>\n<html>\n<head>\n  <title>Turnout Playground</title>\n</head>\n<body>\n  <h1>Enjoy!</h1>\n</body>\n</html>`;
}

function saveCode() {
    const code = editor.value;
    localStorage.setItem('turnout_playground_code', code);
}

function resetDefault() {
    if(confirm("Reset playground?")) {
        localStorage.removeItem('turnout_playground_code');
        location.reload();
    }
}

/**
 * SYNCHRONOUS UI UPDATES
 * We treat the Textarea as the absolute master.
 */
function syncHighlight() {
    let code = editor.value;
    // Prevent the last-line jump
    if (code[code.length - 1] === "\n") code += " ";
    
    highlightContent.textContent = code;
    Prism.highlightElement(highlightContent);

    // 1. Temporarily shrink to measure content
    editor.style.height = 'auto';
    editor.style.width = 'auto';
    
    // 2. Measure exactly how much space the text occupies
    const contentWidth = editor.scrollWidth + "px";
    const contentHeight = editor.scrollHeight + "px";

    // 3. Force both layers to that exact size so they match pixel-for-pixel
    [editor, highlightLayer].forEach(el => {
        el.style.width = contentWidth;
        el.style.height = contentHeight;
    });
}

// Remove scroll listeners—the wrapper handles it natively now!

// Ensure we sync when the window changes size
window.addEventListener('resize', syncHighlight);

/**
 * ASYNC PREVIEW UPDATES (Debounced)
 */
function updatePreview() {
    const code = editor.value;

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

    // Initial title set
    ptitle.innerHTML = (target.title || "") + " - " + newIframe.contentWindow.location.pathname;

    // onClick check change of title and pathname
    newIframe.contentWindow.addEventListener("click", () => {
      setTimeout(() => {
        ptitle.textContent = (newIframe.contentWindow.document.title || "") + " - " + newIframe.contentWindow.location.pathname;
      });
    });
}

/**
 * EVENT LISTENERS
 */

// Typing
editor.addEventListener('input', () => {
    syncHighlight();
    clearTimeout(window.saveTimer);
    window.saveTimer = setTimeout(updatePreview, 800);
});

// Keep the cursor in view when typing
editor.addEventListener('keyup', () => {
    const wrapper = document.querySelector('.editor-wrapper');
    
    // Check if the cursor position is outside the current view
    // This is a simple version; if you find it jumpy, 
    // the wrapper's native 'overflow: auto' usually handles 90% of this.
    if (document.activeElement === editor) {
        // You can add logic here to ensure the cursor stays centered
    }
});

// Tab Key Support
editor.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = this.value.substring(0, start) + "    " + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 4;
        syncHighlight();
    }
});

init();
