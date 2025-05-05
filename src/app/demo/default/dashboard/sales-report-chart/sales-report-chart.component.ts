// angular import
import { Component, ViewChild } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import {
  NgApexchartsModule,
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexGrid,
  ApexTooltip,
  ApexLegend,
  ApexDataLabels
} from 'ng-apexcharts';
import { ApiService } from 'src/app/demo/services/api/api.service';
import { ToastrService } from 'ngx-toastr';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  xaxis: ApexXAxis;
  colors: string[];
  stroke: ApexStroke;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-sales-report-chart',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './sales-report-chart.component.html',
  styleUrl: './sales-report-chart.component.scss'
})
export class SalesReportChartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  chartOptions: Partial<ChartOptions> | undefined;
  total = 0;
  isLoading = true;

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadChartData();
  }

  loadChartData() {
    this.isLoading = true;
    this.apiService.getChartData('week') 
      .then((data: any) => {
        console.log('API Response:', data); // Log the full response for debugging
  
        // Defensive check for data and intrusions
        if (!data || !Array.isArray(data.intrusions) || !Array.isArray(data.categories)) {
          throw new Error('Invalid API response: intrusions or categories missing or not arrays');
        }
  
        const intrusions = data.intrusions;
        const categories = data.categories;
  
        // Calculate severity split (Critical = 60%, High = 40%)
        const criticalData = intrusions.map((count: number) => Math.round(count * 0.6));
        const highData = intrusions.map((count: number) => Math.round(count * 0.4));
  
        this.total = intrusions.reduce((sum: number, count: number) => sum + count, 0);
  
        this.chartOptions = {
          chart: {
            type: 'bar',
            height: 430,
            toolbar: {
              show: false
            },
            background: 'transparent'
          },
          plotOptions: {
            bar: {
              columnWidth: '30%',
              borderRadius: 4
            }
          },
          stroke: {
            show: true,
            width: 8,
            colors: ['transparent']
          },
          dataLabels: {
            enabled: false
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            show: true,
            fontFamily: `'Public Sans', sans-serif`,
            offsetX: 10,
            offsetY: 10,
            labels: {
              useSeriesColors: false
            },
            markers: {
              width: 10,
              height: 10,
              radius: 50
            },
            itemMargin: {
              horizontal: 15,
              vertical: 5
            }
          },
          series: [
            {
              name: 'Critical',
              data: criticalData
            },
            {
              name: 'High',
              data: highData
            }
          ],
          xaxis: {
            categories: categories,
            labels: {
              style: {
                colors: Array(categories.length).fill('#222')
              }
            }
          },
          tooltip: {
            theme: 'light'
          },
          colors: ['#1677ff', '#faad14'], // Blue for Critical, Orange for High
          grid: {
            borderColor: '#f5f5f5'
          }
        };
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error in loadChartData:', error); // Log the error for debugging
        this.toastr.error('Error loading intrusion data');
        const emptyData = Array(7).fill(0);
        const categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
        this.chartOptions = {
          chart: {
            type: 'bar',
            height: 430,
            toolbar: {
              show: false
            },
            background: 'transparent'
          },
          plotOptions: {
            bar: {
              columnWidth: '30%',
              borderRadius: 4
            }
          },
          stroke: {
            show: true,
            width: 8,
            colors: ['transparent']
          },
          dataLabels: {
            enabled: false
          },
          legend: {
            position: 'top',
            horizontalAlign: 'right',
            show: true,
            fontFamily: `'Public Sans', sans-serif`,
            offsetX: 10,
            offsetY: 10,
            labels: {
              useSeriesColors: false
            },
            markers: {
              width: 10,
              height: 10,
              radius: 50
            },
            itemMargin: {
              horizontal: 15,
              vertical: 5
            }
          },
          series: [
            {
              name: 'Critical',
              data: emptyData
            },
            {
              name: 'High',
              data: emptyData
            }
          ],
          xaxis: {
            categories: categories,
            labels: {
              style: {
                colors: Array(categories.length).fill('#222')
              }
            }
          },
          tooltip: {
            theme: 'light'
          },
          colors: ['#1677ff', '#faad14'],
          grid: {
            borderColor: '#f5f5f5'
          }
        };
        this.isLoading = false;
      });
  }
}