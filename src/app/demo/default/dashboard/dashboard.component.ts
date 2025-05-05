import { AuthService } from '../../services/auth/auth.service';
// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MonthlyBarChartComponent } from './monthly-bar-chart/monthly-bar-chart.component';
import { IncomeOverviewChartComponent } from './income-overview-chart/income-overview-chart.component';
import { AnalyticsChartComponent } from './analytics-chart/analytics-chart.component';
import { SalesReportChartComponent } from './sales-report-chart/sales-report-chart.component';

// icons
import { IconService } from '@ant-design/icons-angular';
import { FallOutline, FileOutline, FileTextOutline, GiftOutline, MessageOutline, RiseOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { TopBarChartComponent } from "./top-bar-chart/top-bar-chart.component";
import { ApiService } from '../../services/api/api.service';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../../services/ws/web-socket-service.service';
import { SharedService } from '../../services/shared/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MonthlyBarChartComponent,
    IncomeOverviewChartComponent,
    SalesReportChartComponent,
    TopBarChartComponent,
  ],

  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DefaultComponent {
  AnalyticLog: AnalyticItem[] = [];
  transaction: any = [];
  // constructor
  private messageSubscription!: Subscription;
  public messages: any[] = [];
  log: any[] = [];
  recentRows: any[] = [];
  state = 0
  // Constructor
  constructor(
    private iconService: IconService,
    private authService: AuthService,
    private apiService: ApiService,
    private webSocketService: WebSocketService,
    private sharedService: SharedService,
    private toastr: ToastrService
  ) {
    this.iconService.addIcon(...[RiseOutline, FallOutline, SettingOutline, GiftOutline, MessageOutline,FileTextOutline,FileOutline]);
  }

  async ngOnInit() {
    try {
      await this.apiService.getAnalyticLog().then(
         (res)=>{this.AnalyticLog = res.analytics || [];  // Extract the analytics array
          }
      )
      await this.apiService.recentRows().then(
        (recentRows)=>{this.recentRows = recentRows;} // Log the data}
      ).catch(
        ()=>this.recentRows = []
      );
      this.transaction = [];
      this.apiService.getRecentTransactions().then(
        (res)=>{
          this.transaction = Array.isArray(res.transaction) ? res.transaction : [];
        }
      ).catch(
        (err)=>{this.transaction = [] ;throw err}
      );
      const token = this.authService.getToken() || '';
      if (token !== '') {
        this.webSocketService.connect(token);
        this.messageSubscription = this.webSocketService.getJsonMessage().subscribe(async (message) => {
          this.toastr.success('Received ' + message.type + '!', 'Success');
          this.recentRows = await this.apiService.recentRows();
          console.log("recentRows after WebSocket update:", this.recentRows);
          this.state++; 
          this.changeData();
          this.messages.push(message);
        });
      }
    } catch (error) {
      console.error("Error during ngOnInit:", error);
    }
  }
  changeData() {
    this.sharedService.updateData();
  }
  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }


  // Update or add new log entry
  updateLog(updatedLog: any) {
    const index = this.log.findIndex((log) => log.id === updatedLog.id);
    if (index !== -1) {
      this.log[index] = updatedLog; // Update existing log
    } else {
      this.log.push(updatedLog); // Add new log if not found
    }
  }

  


  
}
export interface AnalyticItem {
  title: string;
  amount: string;
  background: string;
  border: string;
  icon: string;
  percentage: string;
  color: string;
  number: string;
}