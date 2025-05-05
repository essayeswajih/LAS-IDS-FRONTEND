import { Component, SimpleChanges } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ApiService } from '../../services/api/api.service';
import { UploadFileComponent } from "../upload-file/upload-file.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [SharedModule, UploadFileComponent],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export default class LogsComponent {
  logs: any[] = [];
  isViewdetails: Boolean = false;
  state = 0
  alert : string=''

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  async ngOnInit() {
    try {
      const res = await this.apiService.allLogsByUser();
      console.log(res); 
      if (Array.isArray(res)) {
        this.logs = res;  
      } else {
        console.error("Expected an array but got:", res);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  }
  viewDetails(){
    this.isViewdetails = !this.isViewdetails
  }
  navigateToLog() {

  }
  receiveMessage(event: number) {
    this.state = event;
    this.ngOnInit();
  }
  handleAlert(alert: string) {
    this.alert = alert
  }

  async deleteLog(id: any) {
    try {
      const res = await this.apiService.deleteLog(id);
      this.toastr.success("log deleted")

      this.logs = this.logs.filter((log) => log.id !== id);
    } catch {
      this.toastr.error("Error")
    }
  }
  async generateReport(id:any){
  try{
      const res = await this.apiService.generateReport(id);
      this.toastr.success("Report generated")
  } catch {
      this.toastr.error("Error")
    }
  }
}