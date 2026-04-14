const editor = document.getElementById('code');

// 1. Load from localStorage on startup
const savedCode = localStorage.getItem('turnout_playground_code');
if (savedCode) {
    editor.value = savedCode;
    updatePreview();
} else {
    // Default starter template
    editor.value = `<!DOCTYPE html>
<html>
<head>
  <title>Alpine Turnout</title>
  <script src="https://unpkg.com/alpine-turnout" defer></script>
  <script src="https://unpkg.com/alpinejs" defer></script>
</head>
<body x-data>
  <a href="/">alpine</a>
  <a href="/turnout">turnout</a>
  <div x-route="/">Alpine</div>
  <div x-route="/turnout" x-title="Turnout">Turnout</div>
</body>
</html>`;
    updatePreview();
}

// 2. The robust Update function
function updatePreview() {
    const code = editor.value;
    localStorage.setItem('turnout_playground_code', code);
    
    // Target the container and the current iframe
    const container = document.getElementById('preview-container');
    const oldIframe = document.getElementById('display');
    
    // Remove the old one to kill history/memory
    if (oldIframe) {
        oldIframe.remove();
    }
    
    // Create the brand new one
    const newIframe = document.createElement('iframe');
    newIframe.id = 'display';
    container.appendChild(newIframe);
    
    // Write the new content
    const target = newIframe.contentWindow.document;
    target.open();
    target.write(code);
    target.close();
}

// 3. Reset helper
function resetDefault() {
    if(confirm("Reset playground?")) {
        localStorage.removeItem('turnout_playground_code');
        location.reload();
    }
}

// 4. Typing listener
editor.addEventListener('input', () => {
    clearTimeout(window.saveTimer);
    window.saveTimer = setTimeout(updatePreview, 500);
});
