import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '../../../theme/shared/shared.module';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export default class ProfileComponent implements OnInit {
  user: User | null = null;
  isEditMode: boolean = false;
  editedUser: User = new User();

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  async loadProfile() {
    try {
      this.user = await this.apiService.getAuthorizedUserUser();
      this.editedUser = { ...this.user }; // Clone for editing
    } catch (error: any) {
      this.toastr.error(error.detail || error, 'Error loading profile');
    }
  }

  openEditProfileModal() {
    if (this.user) {
      this.isEditMode = true;
      this.editedUser = { ...this.user }; // Clone current user data
      this.showModal();
    }
  }

  async saveProfile() {
    try {
      const updateData = { ...this.editedUser };
      if (!updateData.hashed_password) delete updateData.hashed_password; // Don’t update password unless changed
      const updatedUser = await this.apiService.updateUser(this.editedUser.id!, updateData);
      this.user = updatedUser; // Update displayed user
      this.toastr.success('Profile updated successfully', 'Success');
      this.hideModal();
      this.isEditMode = false;
    } catch (error: any) {
      this.toastr.error(error.detail || error, 'Error updating profile');
    }
  }

  private showModal() {
    const modalElement = document.getElementById('profileModal');
    if (modalElement && (window as any).bootstrap) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Bootstrap modal not initialized. Ensure Bootstrap JS is loaded.');
      this.toastr.error('Modal failed to open. Check console for details.');
    }
  }

  private hideModal() {
    const modalElement = document.getElementById('profileModal');
    if (modalElement && (window as any).bootstrap) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
}

// User model (adjusted for compatibility)
export class User {
  id: number | null = null;
  username: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  company: string | null = null;
  role: string = 'user';
  email: string = '';
  roomName: string | null = null;
  hashed_password: string | null = null; // Keep for password updates

  constructor() {}
}