export default class CustomChart {

    constructor(id) {
        this.chartCanv = document.getElementById(id);
        this.chart = new Chart(this.chartCanv, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                animation: {
                    duration: 0
                },
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'xy'
                        },
                        zoom: { 
                            enabled: true,
                            mode: 'xy',
                        }
                    }
                }
            }
        });
        this.chartCanv.style.display = 'none';
    }

    init(N) {
        this.chartCanv.style.display = 'block';
        this.chart.data.labels = Array.from({length: N}, (v, i) => i+1);
        this.chart.update();
        console.log(this.chart.data.labels)
        let pi = [];
        for (let i = 0; i < N; i++) {
            pi[i] = Math.PI;
        }
        this.addNewDataSet(pi, 'rgba(255,0,0,1)', 'PI');
    }

    addNewDataSet(dataArray, colorString, label) {
        console.log(`addNewDataSet is called: ${
            dataArray[0]
        } + ${colorString} + ${label}`);
        this.chart.data.datasets.push({
            label: label,
            lineTension: 0.1,
            backgroundColor: colorString,
            borderColor: colorString,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            borderWidth: 3,
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "rgba(255,0,0,1)",
            pointBorderWidth: 0,
            pointHoverRadius: 1,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 1,
            pointRadius: 0,
            pointHitRadius: 5,
            data: dataArray,
            fill: false
        });

        this.chart.update();
    }

    resetChart(){
        this.chart.data.datasets = [];
        this.chartCanv.style.display = 'none';
        this.chart.resetZoom();
    }

}
