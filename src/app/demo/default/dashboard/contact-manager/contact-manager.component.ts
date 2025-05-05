import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/demo/services/api/api.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-contact-manager',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './contact-manager.component.html',
  styleUrl: './contact-manager.component.scss'
})

export default class ContactManagerComponent  implements OnInit {
    contacts: any[] = [];
    filteredContacts: any[] = [];
    searchTerm: string = '';
  
    constructor(private apiService: ApiService) {}
  
    ngOnInit() {
      this.fetchContacts();
    }
  
    async fetchContacts() {
      try {
        this.contacts = await this.apiService.getAllContacts();
        this.filteredContacts = this.contacts;
      } catch (error) {
        console.error('Error fetching contacts:', error);
        if (error?.detail === 'Authentication failed.') {
          alert('You must be an admin to view contacts.');
        }
      }
    }
  
    filterContacts() {
      const term = this.searchTerm.toLowerCase();
      this.filteredContacts = this.contacts.filter(
        (contact) =>
          (contact.name?.toLowerCase() || '').includes(term) ||
          (contact.email?.toLowerCase() || '').includes(term) ||
          (contact.subject?.toLowerCase() || '').includes(term) ||
          (contact.message?.toLowerCase() || '').includes(term)
      );
    }
  
    async deleteContact(id: number) {
      if (confirm('Are you sure you want to delete this contact?')) {
        try {
          await this.apiService.deleteContact(id);
          this.contacts = this.contacts.filter((c) => c.id !== id);
          this.filterContacts();
        } catch (error) {
          console.error('Error deleting contact:', error);
          alert('Failed to delete contact.');
        }
      }
    }
  }