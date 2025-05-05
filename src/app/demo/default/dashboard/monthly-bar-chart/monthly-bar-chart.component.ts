// angular import
import { Component, OnInit, ViewChild } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import {
  NgApexchartsModule,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexAxisChartSeries,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexTheme,
  ApexGrid
} from 'ng-apexcharts';
import { ApiService } from 'src/app/demo/services/api/api.service';
import { ToastrService } from 'ngx-toastr';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  colors: string[];
  stroke: ApexStroke;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  theme: ApexTheme;
};

@Component({
  selector: 'app-monthly-bar-chart',
  standalone: true,
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './monthly-bar-chart.component.html',
  styleUrl: './monthly-bar-chart.component.scss'
})
export class MonthlyBarChartComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  chartOptions: Partial<ChartOptions> | undefined; // Initially undefined to prevent rendering
  isLoading = true; // Add loading state to control rendering

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadChartData('week');
  }

  loadChartData(period: string) {
    this.isLoading = true; // Set loading state
    this.apiService.getChartData(period)
      .then((data: any) => {
        this.chartOptions = {
          chart: {
            height: 450,
            type: 'area',
            toolbar: { show: false },
            background: 'transparent'
          },
          dataLabels: { enabled: false },
          colors: ['#1677ff', '#0050b3'],
          series: [
            {
              name: 'Intrusions',
              data: data.intrusions
            },
            {
              name: 'Reports',
              data: data.reports
            }
          ],
          stroke: {
            curve: 'smooth',
            width: 2
          },
          xaxis: {
            categories: data.categories,
            labels: {
              style: {
                colors: Array(data.categories.length).fill('#8c8c8c')
              }
            },
            axisBorder: {
              show: true,
              color: '#f0f0f0'
            }
          },
          yaxis: {
            labels: {
              style: { colors: ['#8c8c8c'] }
            }
          },
          grid: {
            strokeDashArray: 0,
            borderColor: '#f5f5f5'
          },
          theme: { mode: 'light' }
        };

        // Update active class
        document.querySelector(`.chart-income.${period}`)?.classList.add('active');
        document.querySelector(`.chart-income.${period === 'week' ? 'month' : 'week'}`)?.classList.remove('active');
        this.isLoading = false; // Data loaded, allow rendering
      })
      .catch((error) => {
        this.toastr.error("Error loading chart data");
        const emptyData = period === 'week' 
          ? Array(7).fill(0) 
          : Array(12).fill(0);
        const categories = period === 'week'
          ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        this.chartOptions = {
          chart: {
            height: 450,
            type: 'area',
            toolbar: { show: false },
            background: 'transparent'
          },
          dataLabels: { enabled: false },
          colors: ['#1677ff', '#0050b3'],
          series: [
            {
              name: 'Intrusions',
              data: emptyData
            },
            {
              name: 'Reports',
              data: emptyData
            }
          ],
          stroke: {
            curve: 'smooth',
            width: 2
          },
          xaxis: {
            categories: categories,
            labels: {
              style: {
                colors: Array(categories.length).fill('#8c8c8c')
              }
            },
            axisBorder: {
              show: true,
              color: '#f0f0f0'
            }
          },
          yaxis: {
            labels: {
              style: { colors: ['#8c8c8c'] }
            }
          },
          grid: {
            strokeDashArray: 0,
            borderColor: '#f5f5f5'
          },
          theme: { mode: 'light' }
        };

        // Update active class
        document.querySelector(`.chart-income.${period}`)?.classList.add('active');
        document.querySelector(`.chart-income.${period === 'week' ? 'month' : 'week'}`)?.classList.remove('active');
        this.isLoading = false; // Error handled, allow rendering with fallback
      });
  }

  toggleActive(value: string) {
    this.loadChartData(value);
  }
}