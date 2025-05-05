import { Component } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '../../../theme/shared/shared.module';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export default class ContactComponent {
  contactForm: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService
  ) {}

  async submitContactForm() {
    try {
      await this.apiService.submitContact(this.contactForm);
      this.toastr.success('Message sent successfully!', 'Success');
      this.resetForm();
    } catch (error: any) {
      this.toastr.error(error.detail || error, 'Error sending message');
    }
  }

  private resetForm() {
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}