// angular import
import { Component, OnInit, ViewChild } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import {
  NgApexchartsModule,
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexPlotOptions,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexGrid,
  ApexTooltip
} from 'ng-apexcharts';
import { ApiService } from 'src/app/demo/services/api/api.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  colors: string[];
  stroke: ApexStroke;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-income-overview-chart',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './income-overview-chart.component.html',
  styleUrl: './income-overview-chart.component.scss'
})
export class IncomeOverviewChartComponent implements OnInit {
  // public props
  @ViewChild('chart') chart!: ChartComponent;
  chartOptions!: Partial<ChartOptions>;
  total = 0;

  constructor(private apiService: ApiService) {}

  // life cycle hook
  async ngOnInit() {
    const weekOverview = await this.apiService.weekOverview();
    this.total = weekOverview?.counts.reduce((a, b) => a + b, 0);
    this.chartOptions = {
      chart: {
        type: 'bar',
        height: 365,
        toolbar: {
          show: false
        },
        background: 'transparent'
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: false
      },
      series: [
        {
          data: weekOverview?.counts
        }
      ],
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        categories: weekOverview?.days,
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: ['#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c']
          }
        }
      },
      yaxis: {
        show: false
      },
      colors: ['#5cdbd3'],
      grid: {
        show: false
      },
      tooltip: {
        theme: 'light'
      }
    };
  }
}
