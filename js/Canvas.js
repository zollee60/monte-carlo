export default class Canvas {

    constructor(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");
        this.numOfAll = [];
        this.numOfIn = [];
        this.pi = [];
        this.charts = [];
        this.closestValues = 0;
    }

    drawCircleQuadrant() {
        let r = this.canvas.width;
        this.ctx.strokeStyle = 'rgb(255,0,0)';
        this.ctx.fillStyle = 'rgb(255,0,0)';
        this.ctx.beginPath();
        this.ctx.arc(0, canvas.height, r, 1.5 * Math.PI, 0);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, this.canvas.height);
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.lineTo(0, 0);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();
        this.startingImgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    checkIfIsInside(i, x, y) {
        const red = y * (this.canvas.width * 4) + x * 4;
        const indices = [
            red,
            red + 1,
            red + 2,
            red + 3
        ];

        if (this.startingImgData.data[indices[0]] === 255 && this.startingImgData.data[indices[1]] === 0 && this.startingImgData.data[indices[2]] === 0) {
            this.numOfIn[i]++;
        }
    }

    calcPiApprox(i) {
        return 4 * (this.numOfIn[i] * (this.canvas.width * this.canvas.height) / this.numOfAll[i]) / Math.pow(this.canvas.width, 2);
    }

    genRandomNonRedColor() {
        let red = Math.floor(Math.random() * Math.floor(100));
        let blue = Math.floor(Math.random() * Math.floor(255));
        let green = Math.floor(Math.random() * Math.floor(255));

        return `rgb(${red}, ${green}, ${blue})`;
    }

    getClosestApprox(arr) {
        return arr.reduce((prev, curr) => {
            return (Math.abs(curr.y - Math.PI) < Math.abs(prev.y - Math.PI) ? curr : prev)
        });
    }

    genNewRandom(D, N) {
        this.pi = [];
        this.numOfAll = Array.from({length: D},(v) => 0);
        this.numOfIn = Array.from({length: D},(v) => 0);
        let colorstrings = Array.from({length: D}, (v) => this.genRandomNonRedColor());
        for (let i = 0; i < N; i++) {
            let tmpPI = [];
            for (let j = 0; j < D; j++) {
                this.ctx.fillStyle = colorstrings[j];
                let rx = Math.floor(Math.random() * Math.floor(this.canvas.width));
                let ry = Math.floor(Math.random() * Math.floor(this.canvas.height));

                this.numOfAll[j]++;
                this.checkIfIsInside(j, rx, ry);
                tmpPI.push(this.calcPiApprox(j));
                this.ctx.fillRect(rx - 1, ry - 1, 2, 2);
            }
            this.pi.push({x: i, y: this.getClosestApprox(tmpPI)});
        }

        this.fire(this.pi, 'rgb(0,0,255)', 'Átlagolt közelítés');
        this.closestValues = this.getClosestApprox(this.pi).y;

    }

    resetCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.pi = [];
        this.numOfAll = [];
        this.numOfIn = [];
        this.charts = [];
        this.closestValues = 0;
    }

    subscribe(chart) {
        this.charts.push(chart);
    }

    fire(da, cs, l) {
        this.charts.forEach(c => c.addNewDataSet(da, cs, l));
    }
}
