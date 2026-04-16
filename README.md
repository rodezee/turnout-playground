[![Turnout Playground](https://turnout-playground.netlify.app/turnout-playground.png)](https://turnout-playground.netlify.app)
# Turnout Playground

A lightweight, zero-dependency, HTML/CSS/JS playground with instant syntax highlighting and live preview.

**Turnout Playground** was designed to demonstrate the project [Alpine Turnout](https://gitub.com/rodezee/alpine-turnout), but can be used for developers who want a fast, "no-nonsense" environment to sketch out front-end ideas. Unlike heavy editors, it uses `Prism.js` highlighted layer, ensuring perfect highlight without the overhead of a virtual DOM.

## 🚀 Kickstart
### LIVE: Turnout Playground Example
[![Turnout Playground Example](https://alpine-turnout.netlify.app/images/playground-1.png)](https://turnout-playground.netlify.app/?code=PCFET0NUWVBFIGh0bWw-CjxodG1sPgo8aGVhZD4KICA8dGl0bGU-QWxwaW5lIFR1cm5vdXQ8L3RpdGxlPgogIDxzY3JpcHQgc3JjPSIvL3VucGtnLmNvbS9hbHBpbmUtdHVybm91dCIgZGVmZXI-PC9zY3JpcHQ-CiAgPHNjcmlwdCBzcmM9Ii8vdW5wa2cuY29tL2FscGluZWpzIiBkZWZlcj48L3NjcmlwdD4KPC9oZWFkPgo8Ym9keSB4LWRhdGE-CiAgPG5hdj4KICAgIDxhIGhyZWY9Ii8iPkFscGluZTwvYT4gfCAKICAgIDxhIGhyZWY9Ii90dXJub3V0Ij5UdXJub3V0PC9hPiB8CiAgICA8YiB4LXRleHQ9IiRzdG9yZS50dXJub3V0LnRpdGxlIj48L2I-CiAgPC9uYXY-CgogIDxkaXYgeC1yb3V0ZT0iLyIgeC10aXRsZT0iQWxwaW5lIEhvbWUiPgogICAgPHA-Q2xpY2sgdGhyb3VnaCB0aGUgbWVudS48L3A-CiAgPC9kaXY-CgogIDxkaXYgeC1yb3V0ZT0iL3R1cm5vdXQiIHgtdGl0bGU9IlR1cm5vdXQgUm91dGUiPgogICAgPHA-V2UganVzdCB0dXJuZWQgb3V0IHRvIGJlIGhlcmUuPC9wPgogIDwvZGl2Pgo8L2JvZHk-CjwvaHRtbD4)


## ✨ Features

-   **HTML/CSS/JS Highlighting**: Uses `Prism` layer to highlight your code.
    
-   **Live Preview**: Debounced iframe updates with an automatic **Title Watcher** that keeps your browser tab/toolbar in sync.
    
-   **Base64 Sharing**: Share your entire project via a single URL safe Base64 string.
    
-   **Lightweight**: No `npm install`, no build steps. Just pure HTML, CSS, and Vanilla JS.
    

## 🛠️ Tech Stack

-   **Prism.js**: For high-performance syntax highlighting.
    
-   **Vanilla JavaScript**: Custom synchronization logic and debounced preview rendering.
    
-   **CSS Grid/Absolute Stacking**: A specialized layout to handle dual-layer text overlay.
    

## 🚀 Installation

Since this is a vanilla project, getting started is almost as simple as opening a file.

1.  **Clone the repository:**

```bash
git clone https://github.com/rodezee/turnout-playground.git
cd turnout-playground
python3 -m http.server

```
    
2.  **Open `http://localhost:8000` in any browser.**
    

Alternatively, you can host it instantly using [Netlify](https://netlify.app), [Github Pages](https://docs.github.com/en/pages) or use any static file server (like `npx vite`).
    

## 🔗 Sharing Your Code

The playground encodes your current work into a URL-safe Base64 string.

-   Click **Share** to copy the link to your clipboard.
    
-   The state is also automatically saved to your browser's `localStorage`, so your work is safe even if you refresh.
    

## 🤝 Contributing

Contributions are welcome! If you have ideas for improving the synchronization engine or adding features:

1.  Fork the Project
    
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
    
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
    
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
    
5.  Open a Pull Request
    

## 📜 License

Distributed under the MIT License.

