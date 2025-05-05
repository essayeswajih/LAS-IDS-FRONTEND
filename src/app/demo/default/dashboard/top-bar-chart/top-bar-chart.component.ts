import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexChart,
  ApexDataLabels,
  ApexAxisChartSeries,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexTheme,
  ApexGrid,
  ApexTooltip,
  NgApexchartsModule,
  ApexLegend,
  ApexPlotOptions,
} from 'ng-apexcharts';
import { ApiService } from 'src/app/demo/services/api/api.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  xaxis: ApexXAxis;
  colors: string[];
  stroke: ApexStroke;
  theme: ApexTheme;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-top-bar-chart',
  standalone: true,
  templateUrl: './top-bar-chart.component.html',
  imports: [SharedModule, NgApexchartsModule],
  styleUrls: ['./top-bar-chart.component.scss'],
})
export class TopBarChartComponent implements OnInit {
  constructor(private apiService: ApiService) {}
  @ViewChild('chart') chart!: ChartComponent;
  @Input() state!: number;
  chartOptions!: Partial<ChartOptions>;
  activeCategory = 'Paths';
  categories = ['Paths', 'IPs', 'Methods', 'Protocols', 'Users'];

  // Data for each category
  apacheData = {
    Paths: [1200, 1500, 1700, 2000, 2500, 3000, 3200],
    IPs: [100, 150, 200, 250, 300, 350, 400],
    Methods: [150, 100, 0, 0, 0, 0, 0],
    Protocols: [160, 65, 0, 0, 0, 0, 0],
    Users: [500],
  };

  apacheCategories = {
    Paths: ['/home', '/about', '/contact', '/products', '/services', '/login', '/signup'],
    IPs: ['192.168.1.1', '192.168.1.2', '192.168.1.3', '192.168.1.4', '192.168.1.5', '192.168.1.6', '192.168.1.7'],
    Methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE'],
    Protocols: ['HTTP', 'HTTPS', 'FTP', 'SSH', 'SMTP', 'IMAP', 'POP3'],
    Users: ['-'],
  };

  async ngOnInit() {
    await this.initData();
    this.initChart();
  }
  async ngOnChanges(changes: SimpleChanges) {
    if (changes['state']) {
      if(changes['state'].currentValue>0){
        await this.initData();
        this.initChart();
      }
    } 
  }

  async initData() {
    const topPaths = await this.apiService.topPaths();
    const topIps = await this.apiService.topIps();
    const topMethods = await this.apiService.topMethods();
    const topProtocols = await this.apiService.topProtocols();
    const topUsers = await this.apiService.topUsers();

    const { keys: pathKeys, values: pathValues } = this.extractData(topPaths);
    this.apacheCategories['Paths'] = this.urlFilter(pathKeys);
    this.apacheData['Paths'] = pathValues;

    console.log(pathKeys, pathValues); 

    console.log(topIps);
    const { keys: ipKeys, values: ipValues } = this.extractData(topIps);
    this.apacheCategories['IPs'] = ipKeys;
    this.apacheData['IPs'] = ipValues;

    console.log(topMethods);
    const { keys: methodKeys, values: methodValues } = this.extractData(topMethods);
    this.apacheCategories['Methods'] = methodKeys;
    this.apacheData['Methods'] = methodValues;

    console.log(topProtocols);
    const { keys: protocolKeys, values: protocolValues } = this.extractData(topProtocols);
    this.apacheCategories['Protocols'] = protocolKeys;
    this.apacheData['Protocols'] = protocolValues;

    console.log(topUsers);
    const { keys: userKeys, values: userValues } = this.extractData(topUsers);
    this.apacheCategories['Users'] = userKeys;
    this.apacheData['Users'] = userValues;
  }

  initChart(): void {
    this.chartOptions = {
      chart: {
        height: 450,
        type: 'bar',
        toolbar: { show: false },
        background: 'transparent',
      },
      plotOptions: {
        bar: {
          columnWidth: '10%',  // Adjust width for columns
          borderRadius: 10,    // Rounded corners for bars
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#fff'], // White text for data labels
        },
        offsetY: -10,
        formatter: (val: number) => `${val}`,
      },
      colors: ['#096DD9'], // Color for bars
      series: [
        {
          name: this.activeCategory,
          data: this.apacheData[this.activeCategory],
        },
      ],
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        categories: this.apacheCategories[this.activeCategory],
        labels: {
          style: {
            colors: '#8c8c8c',
            fontSize: '12px',
            fontWeight: 500,
          },
        },
        axisBorder: {
          show: true,
          color: '#f0f0f0',
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#8c8c8c',
          },
        },
      },
      grid: {
        show: true,
        borderColor: '#e0e0e0',
        strokeDashArray: 5,
      },
      theme: {
        mode: 'light',
      },
      tooltip: {
        enabled: true,
        shared: true,
        followCursor: true,
        theme: 'light',
        x: { show: true },
        y: {
          formatter: (val: number) => `${val}`,
        },
      },
    };
  }

  toggleActive(category: string): void {
    this.activeCategory = category;

    // Update chart options based on the selected category
    Object.assign(this.chartOptions, {
      series: [{ name: category, data: this.apacheData[category] }],
      xaxis: { categories: this.apacheCategories[category] },
    });
  }

  extractData(data: any[]) {
    let keys = [];
    let values = [];

    for (let i = 0; i < data.length; i++) {
      const entry = data[i];
      const key = Object.keys(entry)[0];  // Get the key (e.g., path, IP, method, etc.)
      const value = entry[key];           // Get the value (count)

      keys.push(key);
      values.push(value);
    }

    return { keys, values };  // Return an object with keys and values
  }
  urlFilter(list:any[]){
    let res = [];
    for(let word of list){
      word = word.substring(word.indexOf('/') );
      //word = word.substring(word.indexOf('/') + 1); 
      if (word.length > 30) {
        word = word.substring(0, 20) + '...';
      }
      res.push(word);
    }
    return res;
  }
}
