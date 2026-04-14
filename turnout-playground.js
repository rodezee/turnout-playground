const editor = document.getElementById('code');
const display = document.getElementById('display');

// 1. Load from localStorage on startup
const savedCode = localStorage.getItem('turnout_playground_code');
if (savedCode) {
    editor.value = savedCode;
    updatePreview();
} else {
    // Default starter template for the user
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

// 2. Update the iframe and save to localStorage
function updatePreview() {
    const code = editor.value;
    localStorage.setItem('turnout_playground_code', code);
    
    // 1. Target the iframe's document
    const target = display.contentWindow.document;

    // 2. Open the document for writing
    // This resets the iframe and clears the "opaque origin" security block
    target.open();

    // 3. Write your code into it
    target.write(code);

    // 4. Close it to tell the browser it's finished loading
    target.close();
}

function resetDefault() {
    if(confirm("Reset playground?")) {
        localStorage.removeItem('turnout_playground_code');
        location.reload();
    }
}
