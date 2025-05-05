import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ApiService } from '../../services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export default class ReportsComponent implements OnInit {

  reports: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadReports();
  }

  async loadReports(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      this.reports = await this.apiService.getReports(this.currentPage, this.pageSize);
    } catch (error: any) {
      this.errorMessage = error.detail || 'Error loading reports';
    } finally {
      this.isLoading = false;
    }
  }

  async deleteReport(reportId: number): Promise<void> {
    if (confirm('Are you sure you want to delete this report?')) {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        await this.apiService.deleteReport(reportId);
        this.reports = this.reports.filter((report) => report.id !== reportId);
        await this.loadReports();
      } catch (error: any) {
        this.errorMessage = error.detail || 'Error deleting report';
      } finally {
        this.isLoading = false;
      }
    }
  }

  changePage(newPage: number): void {
    this.currentPage = newPage;
    this.loadReports();
  }
  openIntrusions(reportId: any) {
    this.router.navigate(['/intrusions', reportId]);
  }
}
export interface Intrusion {
  id: number;
  description: string;
  detected_attack: string | null;
  severity: string | null;
  timestamp: string;
  report_id: number;
}

export interface Report {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
  intrusions: Intrusion[];
}
