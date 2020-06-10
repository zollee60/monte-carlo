import Canvas from './Canvas.js';
import CustomChart from './CustomChart.js';
import {loadPIResults, resetResults} from './ResultLoader.js'

let canvas = new Canvas('canvas');
canvas.drawCircleQuadrant();

let cc = new CustomChart('chart');


document.getElementById('calc').addEventListener("click", () => {
    canvas.resetCanvas();
    canvas.drawCircleQuadrant();
    
    const S = parseFloat(document.getElementById('S').value);
    const D = parseFloat(document.getElementById('D').value);
    const N = parseFloat(document.getElementById('N').value);
    
    cc.init(N);
    cc.show();
    canvas.subscribe(cc);
    canvas.genNewRandom(D,N,S,S,0);
    loadPIResults(canvas.closestValues,'results');
});

document.getElementById('reset').addEventListener("click", () => {
    canvas.resetCanvas();
    canvas.drawCircleQuadrant();
    cc.resetChart();
    resetResults('results');
});

