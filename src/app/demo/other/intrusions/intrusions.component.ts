import { Component, OnInit } from '@angular/core';
import { ApiService, PaginatedIntrusions } from '../../services/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-intrusions',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './intrusions.component.html',
  styleUrl: './intrusions.component.scss'
})
export default class IntrusionsComponent implements OnInit {
  intrusions: any[] = []; // Initialize as empty array
  reportId: number | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  total: number = 0;
  totalPages: number = 0;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reportId = Number(this.route.snapshot.paramMap.get('reportId'));
    if (this.reportId) {
      this.loadIntrusions();
    }
  }

  async loadIntrusions(): Promise<void> {
    if (!this.reportId) return;

    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      const response: PaginatedIntrusions = await this.apiService.getIntrusionsByReportId(
        this.reportId,
        this.currentPage,
        this.pageSize
      );
      // Ensure intrusions is an array, even if response.intrusions is undefined
      this.intrusions = Array.isArray(response.intrusions) ? response.intrusions : [];
      this.total = response.total || 0;
      this.totalPages = response.total_pages || 0;
    } catch (error: any) {
      this.errorMessage = error.detail || 'Error loading intrusions';
      this.intrusions = []; // Reset to empty array on error
    } finally {
      this.isLoading = false;
    }
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.loadIntrusions();
    }
  }

  goBack(): void {
    this.router.navigate(['/reports']);
  }
}