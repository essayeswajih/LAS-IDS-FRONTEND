import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { SharedModule } from "../../../theme/shared/shared.module";
import { ApiService } from './../../services/api/api.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [SharedModule, FormsModule], // ✅ Add FormsModule here
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export default class FilterComponent {
  constructor(private ApiService: ApiService) {}

  AllLogs: any = [];
  selectedFile: number = null;
  logFile: any = null;
  logFileRows: any = [];
  currentPage: number = 1;
  skip: number = 0;
  limit: number = 10;

  StatusFiltreChoises = ['Ignore', 'Include', 'Exclude'];
  StatusFiltreValues = ['All', '1xx Informational', '2xx Success', '3xx Redirection', '4xx Client Error', '5xx Server Error'];
  IPFiltreChoises = ['Ignore', 'Include', 'Exclude', 'Include (Regex)', 'Exclude (Regex)', 'Unique IP\'s'];
  MethodFiltreChoises = this.StatusFiltreChoises;
  MethodFiltreValues = ['All', 'GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE', 'Others'];
  PathFiltreChoises = ['Ignore', 'Include', 'Exclude', 'Include (Regex)', 'Exclude (Regex)', 'Unique Path\'s'];
  RequestFiltreChoises = ['Ignore', 'Include', 'Exclude', 'Include (Regex)', 'Exclude (Regex)', 'Unique Requests'];
  UserAgentFiltreChoises = ['Ignore', 'Include', 'Exclude', 'Include (Regex)', 'Exclude (Regex)', 'Unique User Agents'];
  ReferrerFiltreChoises = ['Ignore', 'Include', 'Exclude', 'Include (Regex)', 'Exclude (Regex)', 'Unique Referrers'];

  ModuleFiltreChoises = ['Ignore', 'Include', 'Exclude', 'Include (Regex)', 'Exclude (Regex)', 'Unique Module\'s'];
  
  LevelFiltreChoises = this.StatusFiltreChoises;
  LevelFiltreValues = ['All','Info','Notice','Debug','Error','Emerg','Alert','Crit','Warn']
  MessageFiltreChoises = ['Ignore', 'Include', 'Exclude', 'Include (Regex)', 'Exclude (Regex)', 'Unique Message\'s'];
  PidFiltreChoises = ['Ignore', 'Include', 'Exclude', 'Include (Regex)', 'Exclude (Regex)', 'Unique PID\'s'];
  TidFiltreChoises = ['Ignore', 'Include', 'Exclude', 'Include (Regex)', 'Exclude (Regex)', 'Unique TID\'s'];

  statusOption = this.StatusFiltreChoises[0];
  statusValue = this.StatusFiltreValues[0];
  ipsOption = this.IPFiltreChoises[0];
  ipsValue = "";
  methodOption = this.MethodFiltreChoises[0];
  methodValue = this.MethodFiltreValues[0];
  pathOption = this.PathFiltreChoises[0];
  pathValue = "";
  requestOption = this.RequestFiltreChoises[0];
  requestValue = "";
  userAgentOption = this.UserAgentFiltreChoises[0];
  userAgentValue = "";
  referrerOption = this.ReferrerFiltreChoises[0];
  referrerValue = "";
  moduleOption = this.ModuleFiltreChoises[0];
  moduleValue = "";
  levelOption = this.LevelFiltreChoises[0];
  levelValue = this.LevelFiltreValues[0];
  messageOption = this.MessageFiltreChoises[0];
  messageValue = "";
  pidOption = this.PidFiltreChoises[0];
  pidValue = "";
  tidOption = this.TidFiltreChoises[0];
  tidValue = "";

  selectedFileId: number = null;

  async ngOnInit() {
    this.AllLogs = await this.ApiService.allLogsByUser();
    console.log(this.AllLogs);
    this.selectedFile = this.AllLogs[0]?.id || null;
    this.logFile = this.selectedFile ? await this.ApiService.getLogFileById(this.selectedFile) : null;
    this.applyFilter();
    console.log(this.logFile);
    this.clearFilter();
  }

  async applyFilter() {
    let filter = {
      id: this.selectedFile,
      statusOption: this.statusOption,
      statusValue: this.statusValue,
      ipsOption: this.ipsOption,
      ipsValue: this.ipsValue,
      methodOption: this.methodOption,
      methodValue: this.methodValue,
      pathOption: this.pathOption,
      pathValue: this.pathValue,
      requestOption: this.requestOption,
      requestValue: this.requestValue,
      userAgentOption: this.userAgentOption,
      userAgentValue: this.userAgentValue,
      referrerOption: this.referrerOption,
      referrerValue: this.referrerValue,
      moduleOption:this.moduleOption,
      moduleValue: this.moduleValue,
      levelOption: this.levelOption,
      levelValue: this.levelValue,
      messageOption: this.messageOption,
      messageValue: this.messageValue,
      pidOption: this.pidOption,
      pidValue: this.pidValue,
      tidOption: this.tidOption,
      tidValue: this.tidValue
    };
    console.log(filter);
    let getFiltredRows = await this.ApiService.getFiltredRows(filter, this.skip, this.limit);
    console.log(getFiltredRows);
    this.logFileRows = [];
    this.logFileRows = [...getFiltredRows];
  }
  async fileChange(){
    //set the new log file
    for(let log of this.AllLogs){
      if(log.id == this.selectedFile){
        this.logFile = log;
        await this.applyFilter();
      }
    }
  }
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.skip = (this.currentPage - 1) * this.limit;
      this.applyFilter();
    }
  }

  nextPage(): void {
    if (this.currentPage * this.limit < this.logFile.rows_count) {
      this.currentPage++;
      this.skip = this.currentPage * this.limit - this.limit;
      this.applyFilter();
    }
  }


  clearFilter() {
    this.statusOption = this.StatusFiltreChoises[0];
    this.statusValue = this.StatusFiltreValues[0];
    this.ipsOption = this.IPFiltreChoises[0];
    this.ipsValue = "";
    this.methodOption = this.MethodFiltreChoises[0];
    this.methodValue = this.MethodFiltreValues[0];
    this.pathOption = this.PathFiltreChoises[0];
    this.pathValue = "";
    this.requestOption = this.RequestFiltreChoises[0];
    this.requestValue = "";
    this.userAgentOption = this.UserAgentFiltreChoises[0];
    this.userAgentValue = "";
    this.referrerOption = this.ReferrerFiltreChoises[0];
    this.referrerValue = "";
    this.moduleOption = this.ModuleFiltreChoises[0];
    this.moduleValue = "";
    this.levelOption = this.LevelFiltreChoises[0];
    this.levelValue = this.LevelFiltreValues[0]
    this.messageOption = this.MessageFiltreChoises[0];
    this.messageValue = "";
    this.pidOption = this.PidFiltreChoises[0];
    this.pidValue = "";
    this.tidOption = this.TidFiltreChoises[0];
    this.tidValue = "";
  }
}