import Canvas from './Canvas.js';
import Editor from './Editor.js';
import {loadAreaResults, resetResults} from './ResultLoader.js'

let canvas = new Canvas('canvas');
let editor = new Editor(canvas);

document.getElementById('upload').addEventListener("click", () => {
    editor.loadImage();
});

document.getElementById('move').addEventListener("click", () => {
    editor.setActiveTool('move');
})

document.getElementById('select').addEventListener("click", () => {
    editor.setActiveTool('select');
})

document.getElementById('bsSlider').addEventListener("input", (e) => {
    let value = parseFloat(e.target.value)
    let span = document.getElementById('bssValue');
    editor.burshSize = value;
    span.style.left = value + "%";
});