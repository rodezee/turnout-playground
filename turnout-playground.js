const editor = document.getElementById('code');

/**
 * INITIALIZATION
 * Decides what code to put in the editor on page load
 */
function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedCode = urlParams.get('code');
    const savedCode = localStorage.getItem('turnout_playground_code');

    if (sharedCode) {
        try {
            // 1. URL-Safe Base64 Fix (Swap chars back + add padding)
            let base64 = sharedCode.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) { base64 += '='; }

            // 2. Decode UTF-8 safely
            const decoded = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            editor.value = decoded;
        } catch (e) {
            console.error("Failed to decode shared code", e);
            // Fallback if decoding fails
            editor.value = savedCode || getDefaultTemplate();
        }
    } else {
        // No shared code, use local storage or the default
        editor.value = savedCode || getDefaultTemplate();
    }

    // Always run the preview once at startup
    updatePreview();
}

function getDefaultTemplate() {
    return `<!DOCTYPE html>
<html>
<head>
  <title>Turnout Playground</title>
</head>
<body>
  Enjoy!
</body>
</html>`;
}

/**
 * REFRESH / RUN LOGIC
 */
function updatePreview() {
    const code = editor.value;
    localStorage.setItem('turnout_playground_code', code);
    
    const container = document.getElementById('preview-container');
    const ptitle = document.getElementById('preview-title');
    const oldIframe = document.getElementById('display');
    
    if (oldIframe) {
        oldIframe.remove();
    }
    
    const newIframe = document.createElement('iframe');
    newIframe.id = 'display';
    container.appendChild(newIframe);
    
    const target = newIframe.contentWindow.document;
    target.open();
    target.write(code);
    target.close();
    
    // set and keep track of the preview title
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
 * SHARING LOGIC
 */
function shareCode() {
    const code = editor.value;
    try {
        // Robust UTF-8 to Base64
        const base64 = btoa(encodeURIComponent(code).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
            
        // Make URL-Safe
        const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            
        const shareUrl = window.location.origin + window.location.pathname + '?code=' + urlSafeBase64;
        
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert("Shareable link copied to clipboard!");
        });
    } catch (e) {
        console.error(e);
        alert("Encoding failed.");
    }
}

function resetDefault() {
    if(confirm("Are you sure you want to clear your code and reset to default?")) {
        localStorage.removeItem('turnout_playground_code');
        window.location.href = window.location.origin + window.location.pathname;
    }
}

// Listen for typing
editor.addEventListener('input', () => {
    clearTimeout(window.saveTimer);
    window.saveTimer = setTimeout(updatePreview, 800);
});

// Run init on load
init();
