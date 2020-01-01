export default class Canvas {
    
    constructor(id){
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");
        this.points = [];
        this.numOfAll = 0;
        this.numOfIn = 0;
        this.valueChangeEvent = new CustomEvent('canvasDataChange', {detail: {in: this.numOfIn, all: this.numOfAll}});
    }

    drawCircle(r){
        this.ctx.strokeStyle = 'rgb(255,0,0)';
        this.ctx.fillStyle = 'rgb(255,0,0)';
        this.ctx.beginPath();
        this.ctx.arc(canvas.width/2,canvas.height/2,r,0,2*Math.PI);
        this.ctx.stroke();
        this.ctx.fill;
    }

    genRandomPoints(N){
        const currentImgData = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);

        for(let i = 0; i < N; i++){
            let rx = Math.floor(Math.random() * Math.floor(max));
            let ry = Math.floor(Math.random() * Math.floor(max));

            this.points.push([rx,ry]);
            this.numOfAll++;

            const red = y * (width * 4) + x * 4;
            const indices = [red, red + 1, red + 2, red + 3];
            
            if(currentImgData.data[indices[0]] === 255 &&
                currentImgData.data[indices[1]] === 0 &&
                currentImgData.data[indices[2]] === 0){
                this.numOfIn++;
            }

            window.dispatchEvent('canvasDataChange');

            this.ctx.fillStyle = 'rgba(0,0,255)' ;
            this.ctx.fillRect(rx,ry,1,1);
        }
    }

    clearCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    }


}