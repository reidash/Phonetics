import { Chart } from 'chart.js';
import { Input, ViewChild, Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
    selector: 'component-line',
    templateUrl: 'line.component.html'
})

export class LineComponent implements AfterViewInit {
    @Input() public values: number[];

    private type: string = 'line';
    private thresholds: any = {
        good: .7,
        moderate: .5,
        bad: 0
    };
    private colours: any = {
        good: '#77ae79',
        moderate: '#ff8000',
        bad: '#b30000',
        background: '#f4f4f4'
    };
    private options: any = {
        'legend': {
            'display': true,
            'position': 'bottom'
        },
        'tooltips': {
            'enabled': false
        },
        'animation': {
            'animateScale': true,
            'animateRotate': false
        }
    };

    @ViewChild('line') line: ElementRef;

    constructor(public el: ElementRef) { }

    ngAfterViewInit() {

        let ctx = this.line.nativeElement.getContext('2d');

        let data = this.getGraphData(ctx);

        let chart = new Chart(
            ctx,
            {
                type: this.type,
                data: data,
                options: this.options
            }
        );
    }

    getGraphData(ctx: CanvasRenderingContext2D) {
        let gradient = ctx.createLinearGradient(0, 0, this.line.nativeElement.width, 0);
        let lastAdded = this.colours.background;
        let currColour = '';
        let labels: string[] = [];
        let dataPoints: number[] = [];

        for (let i = 0; i < this.values.length; i++) {
            if (this.values[i] < this.thresholds.moderate) {
                currColour = this.colours.bad;
            } else if (this.values[i] < this.thresholds.good) {
                currColour = this.colours.moderate;
            } else {
                currColour = this.colours.good;
            }

            if (currColour !== lastAdded) {
                gradient.addColorStop(i * (1 / this.values.length), currColour);
                lastAdded = currColour;
            }

            dataPoints.push(this.values[i] * 100);
            labels.push((i + 1).toString());
        }

        return {
            labels: labels,
            datasets: [
                {
                    label: "accuracy per set of 20 attempts",
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: this.colours.background,
                    borderColor: gradient,
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: dataPoints,
                    spanGaps: true
                }]
        };
    }
}
