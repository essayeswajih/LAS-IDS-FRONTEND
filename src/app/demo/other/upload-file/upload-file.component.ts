import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ToastrService } from 'ngx-toastr';
import { StripeService } from '../../stripe/stripe/stripe.service';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss',
})
export class UploadFileComponent {

  selectedFile: File | null = null;
  @Output() messageEvent = new EventEmitter<number>();
  @Output() alertEvent = new EventEmitter<string>();
  private counter = 0;
  stripePromise = loadStripe(environment.stripePublicKey);

  fileType: string = 'Apache';
  logType: string = 'Access';
  logPattern: string = ""
  subscribeIsLoading = false
  isSubscribed = false 
  isAdmin = false
  constructor(private apiService: ApiService, private toastr: ToastrService, private paymentService: StripeService) {}
  ngOnInit(){
    this.checkSubscriptionStatus()
    this.isAdminf()
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
 
  sendMessage() {
    this.counter++;
    this.messageEvent.emit(this.counter);
  }
  async headOfFile(): Promise<string> {
    if (this.selectedFile) {
      const text = await this.selectedFile.text(); // Attendre la lecture du fichier
      return text.split("\n").slice(0, 10).join("\n"); // Extraire les 10 premières lignes
    }
    return "";
  }
  
  async detectPattern() {
    const lines = await this.headOfFile(); // Attendre la lecture complète du fichier
  
    if (lines !== "") {
      this.apiService.getPattern(lines)
        .then((res) => {
          console.log(res);
          this.logPattern = res?.regex_pattern;
        })
        .catch(() => {
          this.logPattern = "Can't generate pattern for this file";
        });
    }
  }
  sendAlert(alert:string) {
    this.alertEvent.emit(alert);
  }
  checkForAlerts() {
    if (this.fileType =='Windows'){
      this.sendAlert('Use this command to generate a security log file in JSON format: "Get-WinEvent -LogName Security -MaxEvents 1000 |Select-Object TimeCreated, EntryType, ProviderName, Id, Message, ComputerName, TaskDisplayName, LevelDisplayName, UserName, RunAsUser |ConvertTo-Json -Depth 10 | Out-File C:\SecurityLogs.json"');
      this.logType = 'Security';
    }
    else if(this.fileType == 'Linux'){
      this.logType = 'Syslog';
      this.sendAlert('')
    }else if(this.fileType == 'Any'){
      this.logType ='Custom'
      this.sendAlert('Custom log format can be deteceted using AI');
    }
    else{
      this.sendAlert('')
    }
  }

  onUpload(): void {
      if (this.selectedFile) {
        console.log('Filetype:', this.fileType);
        console.log('logType:', this.logType);
        if(this.fileType != 'Any'){
        
        this.apiService.uploadLogFile(this.selectedFile,this.fileType,this.logType).then((response) => {
          this.toastr.success('File uploaded successfully', 'Success');
          this.sendMessage();  
        })
      }else if( this.fileType == 'Any'&& this.logType == 'Custom'){
        this.apiService.uploadCustomLogFile(this.selectedFile,this.fileType,this.logType,this.logPattern).then((response) => {
          this.toastr.success('File uploaded successfully', 'Success');
          this.sendMessage();  
        });
      }
    } else {
      this.toastr.error("Aucun fichier sélectionné")
    }
  }
  onDragOver(event: DragEvent) {
    event.preventDefault(); // Important: Prevent default behavior to allow dropping
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault(); // Prevent browser from opening the file

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }
  clearFile(event: Event) {
    event.stopPropagation(); // Prevents triggering file selection when clicking delete
    this.selectedFile = null;
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = ''; // Clears the file input field
    }
  }
  async checkSubscriptionStatus() {
    this.subscribeIsLoading = true; // Start loading
    try {
      const res = await this.paymentService.checkSubscription();
      this.isSubscribed = res.subscribed;
    } catch (error) {
      console.error('Subscription check error:', error);
      this.isSubscribed = false;
    } finally {
      this.subscribeIsLoading = false; // Stop loading
    }
  }
  async redirectToCheckout() {
    try {
      const res = await this.paymentService.createCheckoutSession();
      if (res.id) {
        const stripe = await this.stripePromise;
        await stripe?.redirectToCheckout({ sessionId: res.id });
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  }
  async isAdminf(){
    await this.apiService.getAuthorizedUserUser().then(
      (response) => {
        if(response.role == 'admin'){
          this.isAdmin = true;
        }
      }
    ).catch(
      () =>this.isAdmin = false
    );
  }
}
