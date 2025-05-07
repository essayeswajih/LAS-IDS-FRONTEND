import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { AuthService } from '../auth/auth.service';
import { ContactForm } from 'src/app/demo/other/contact/contact.component';
import { Intrusion } from '../../other/reports/reports.component';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private auth: AuthService) {}

  //private baseUrl: any = "http://localhost:8000/api/v1/";
  private baseUrl: any = "https://las-ids-backend-1.onrender.com/api/v1/";
  private headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.auth.getToken()
  };

  private logFileId: any = null;

  async setDefaultFileId() {
    let storedLogFileId = localStorage.getItem('logFileId');

    if (storedLogFileId && storedLogFileId !== "") {
        console.log("Log File ID:", storedLogFileId);
        this.logFileId = storedLogFileId;

        try {
            const response = await axios.get(this.baseUrl + 'users/logs', { headers: this.headers });
            if (Array.isArray(response.data)) {
              for(let log of response.data){
                if (log.id == this.logFileId) return this.logFileId;
              }
            }
        } catch (error) {
            console.warn("Error checking existing log file:", error?.response?.data || error?.message);
        }
    }

    // Fetch new log file ID if the existing one is invalid or not found
    try {
        console.log('setDefaultFileId', 'Fetching log file ID...');
        const response = await axios.get(this.baseUrl + 'users/logs', { headers: this.headers });

        console.log('setDefaultFileId Response:', response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
            this.logFileId = response.data[0].id;
            localStorage.setItem('logFileId', this.logFileId);
            return this.logFileId;
        } else {
            throw new Error("No log files available.");
        }
    } catch (error) {
        throw error?.response?.data || error?.message;
    }
}

async recentRows() {
    try {
        const response = await axios.get(`${this.baseUrl}logs/get/recentrows`, {
            headers: this.headers
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || error?.message;
    }
}

  async topPaths () {
    if (!this.logFileId) {
      this.logFileId = await this.setDefaultFileId(); 
    }

    try {
      const response = await axios.get(this.baseUrl + 'logs/' + this.logFileId + '/toppaths', {
        headers:this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error?.message;
    }
  }
  async topStatusCodes () {
    if (!this.logFileId) {
      this.logFileId = await this.setDefaultFileId(); 
    }

    try {
      const response = await axios.get(this.baseUrl + 'logs/' + this.logFileId + '/topstatuscodes', {
        headers:this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error?.message;
    }
  }
  async topIps() {
    if (!this.logFileId) {
      this.logFileId = await this.setDefaultFileId(); 
    }
    
    try {
      const response = await axios.get(this.baseUrl + 'logs/' + this.logFileId + '/topips', {
        headers:this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error?.message;
    }
  }
  async topUserAgents() {
    if (!this.logFileId) {
      this.logFileId = await this.setDefaultFileId(); 
    }

    try {
      const response = await axios.get(this.baseUrl + 'logs/' + this.logFileId + '/topuseragents', {
        headers:this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error?.message;
    }
  }
  async topUsers() {
    if (!this.logFileId) {
      this.logFileId = await this.setDefaultFileId(); 
    }

    try {
      const response = await axios.get(this.baseUrl + 'logs/' + this.logFileId + '/topusers', {
        headers:this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error?.message;
    }
  }
  async topProtocols() {
    if (!this.logFileId) {
      this.logFileId = await this.setDefaultFileId(); 
    }
    try {
      const response = await axios.get(this.baseUrl + 'logs/' + this.logFileId + '/topprotocols', {
        headers:this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error?.message;
    }
  }
  async topMethods() {
    if (!this.logFileId) {
      this.logFileId = await this.setDefaultFileId(); 
    }
    try {
      const response = await axios.get(this.baseUrl + 'logs/' + this.logFileId + '/topmethods', {
        headers:this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error?.message;
    }
  }
  async weekOverview(){
    if (!this.logFileId) {
      this.logFileId = await this.setDefaultFileId(); 
    }
    try {
      const response = await axios.get(this.baseUrl + 'logs/' + this.logFileId + '/weekoverview', {
        headers:this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error?.message;
    }
  }
  async allLogsByUser(){
    try {
      const response = await axios.get(this.baseUrl + 'users/logs', {
        headers:this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error?.message;
    }
  }
  async deleteLog(id: any) {
    try {
      const response = await axios.delete(this.baseUrl + 'logs/' + id, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error?.message;
    }
  }
  async uploadLogFile(selectedFile: File, logOf: string, fileType: string) {
    try {
        const formData = new FormData();
        formData.append("file", selectedFile);  // Append the file to the FormData
        formData.append("logOf", logOf);
        formData.append("fileType", fileType);
        console.log(logOf);
        console.log(fileType);

        // Make the POST request with FormData
        const response = await axios.post(this.baseUrl + 'logs/upload', formData, {
            headers: {
                ...this.headers,       // Include any additional headers if necessary
                "Content-Type": "multipart/form-data"  // Set the appropriate content type
            }
        });

        return response.data; // Return the response data
    } catch (error) {
        // Handle error responses properly
        throw error.response?.data || error?.message;
    }
  }
  async uploadCustomLogFile(selectedFile: File, logOf: string, fileType: string, regexPattern:string) {
    try {
        const formData = new FormData();
        formData.append("file", selectedFile);  // Append the file to the FormData
        formData.append("logOf", logOf);
        formData.append("fileType", fileType);
        formData.append("regexPattern", regexPattern);
        console.log(logOf);
        console.log(fileType);

        // Make the POST request with FormData
        const response = await axios.post(this.baseUrl + 'logs/upload_custom_file', formData, {
            headers: {
                ...this.headers,       // Include any additional headers if necessary
                "Content-Type": "multipart/form-data"  // Set the appropriate content type
            }
        });

        return response.data; // Return the response data
    } catch (error) {
        // Handle error responses properly
        throw error.response?.data || error?.message;
    }
  }
  async getLogFileById(id: number) {
    try {
      const response = await axios.get(this.baseUrl + 'logs/' + id, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error?.message;
    }
  }
  async getFiltredRows(request: any, skip: number, limit: number) {
    try {
      const response = await axios.post(
        `${this.baseUrl}logs/simpleApacheAccessLogFilter?skip=${skip}&limit=${limit}`,
        request,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error?.message;
    }
}
  async getNotifications(){
    try{
      const response = await axios.get(this.baseUrl + 'notifications', {
        headers: this.headers
      });
      return response.data;
    }catch(error){
      throw error.response?.data || error?.message;
    }
  }
  async setSeenNotification(id:number){
    try{
      const response = await axios.get(this.baseUrl + 'notification/set_seen/' + id, {
        headers: this.headers
      });
      return response.data;
    }catch(error){
      throw error.response?.data || error?.message;
    }
  }
  async getPattern(rows: string){
    try {
      const response = await axios.post(this.baseUrl + 'ai/get_log_pattern', { rows },{
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du pattern:', error);
      throw error;
    }
  }
  async getAuthorizedUserUser(){
    try{
      const response = await axios.get(this.baseUrl + 'users/authorized_user',{
        headers: this.headers
      });
      return response.data;
    }
    catch(error){
      throw error.response?.data || error?.message;
    }
  }
  async getUsers() {
    try {
      const response = await axios.get(this.baseUrl + 'users/', {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async getUserById(id: number) {
    try {
      const response = await axios.get(this.baseUrl + `users/get_one_by_id/${id}`, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async deleteUser(id: number) {
    try {
      const response = await axios.delete(this.baseUrl + `users/${id}`, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async updateUser(id: number, userData: any) {
    try {
      const response = await axios.put(this.baseUrl + `users/${id}`, userData, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async createUser(userData: any) {
    try {
      const response = await axios.post(this.baseUrl + 'users/', userData, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
  async submitContact(contactData: any) {
    try {
      const response = await axios.post(this.baseUrl + 'contact', contactData, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
  
  async getAllContacts() {
    try {
      const response = await axios.get(this.baseUrl + 'contact', {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
  async deleteContact(id: number) {
    try {
      const response = await axios.delete(`${this.baseUrl}contact/${id}`, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
  async getAnalyticLog() {
    try {
      const response = await axios.get(this.baseUrl + 'AnalyticLog', {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
  async getReports(page: number, size: number): Promise<Report[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}reports?page=${page}&size=${size}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }

  async deleteReport(id: number): Promise<any> {
    try {
      const response = await axios.delete(
        `${this.baseUrl}reports/${id}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
  async getIntrusionsByReportId(reportId: number, page: number, size: number) {
    try {
      const response = await axios.get(
        `${this.baseUrl}reports/${reportId}/intrusions?page=${page}&size=${size}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
  async getChartData(period: string = 'week'): Promise<{ intrusions: number[], reports: number[], categories: string[] }> {
    try {
      const response = await axios.get(`${this.baseUrl}users/ChartData0`, {
        params: { period },
        headers: this.headers
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
  async getChartData1(period: string = 'week'): Promise<{ intrusions: number[], reports: number[], categories: string[] }> {
    try {
      const response = await axios.get(`${this.baseUrl}users/ChartData1`, {
        params: { period },
        headers: this.headers
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
  async getRecentTransactions() {
    try {
      const response = await axios.get(`${this.baseUrl}users/recent-transactions`, {  
        headers: this.headers
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
  async generateReport(id : Number){
    try {
      const response = await axios.get(`${this.baseUrl}logs/detect-intrusions/${id}`, {  
        headers: this.headers
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
  
}
export interface PaginatedIntrusions {
  intrusions: Intrusion[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}