import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/demo/services/api/api.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-user-managment',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-managment.component.html',
  styleUrl: './user-managment.component.scss'
})
export default class UserManagmentComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  selectedUser: User = new User();
  isEditMode: boolean = false;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.apiService.getAuthorizedUserUser().then(
      (res)=>{
        if(res.role != 'admin'){
          this.router.navigate(['/']);
        }else{
          this.loadUsers();
        }
      }
    )

  }

  async loadUsers() {
    try {
      this.users = await this.apiService.getUsers();
      this.filteredUsers = [...this.users];
    } catch (error: any) {
      this.toastr.error(error.message, 'Error loading users');
    }
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      (user.username?.toLowerCase().includes(this.searchTerm.toLowerCase()) || false) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (user.firstName?.toLowerCase().includes(this.searchTerm.toLowerCase()) || false) ||
      (user.lastName?.toLowerCase().includes(this.searchTerm.toLowerCase()) || false)
    );
  }

  openAddUserModal() {
    this.isEditMode = false;
    this.selectedUser = new User();
    this.showModal();
  }

  openEditUserModal(user: User) {
    this.isEditMode = true;
    this.selectedUser = { ...user };
    this.showModal();
  }

  async saveUser() {
    try {
      if (this.isEditMode) {
        // Exclude password on update unless explicitly changed (optional enhancement)
        const updateData = { ...this.selectedUser };
        if (!updateData.hashed_password) delete updateData.hashed_password;
        const updatedUser = await this.apiService.updateUser(this.selectedUser.id!, updateData);
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.toastr.success('User updated successfully', 'Success');
      } else {
        const newUser = await this.apiService.createUser(this.selectedUser);
        this.users.push(newUser);
        this.toastr.success('User created successfully', 'Success');
      }
      this.filteredUsers = [...this.users];
      this.hideModal();
    } catch (error: any) {
      this.toastr.error(error.message, 'Error saving user');
    }
  }

  async deleteUser(userId: number | null) {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await this.apiService.deleteUser(userId!);
        this.users = this.users.filter(user => user.id !== userId);
        this.filteredUsers = [...this.users];
        this.toastr.success('User deleted successfully', 'Success');
      } catch (error: any) {
        this.toastr.error(error.message, 'Error deleting user');
      }
    }
  }

  private showModal() {
    const modalElement = document.getElementById('userModal');
    if (modalElement && (window as any).bootstrap) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Bootstrap modal not initialized. Ensure Bootstrap JS is loaded.');
    }
  }

  private hideModal() {
    const modalElement = document.getElementById('userModal');
    if (modalElement && (window as any).bootstrap) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
}

export class User {
  id: number | null = null;
  username: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  company: string | null = null;
  role: string = 'user'; // Default to 'user' as per RoleEnum.user
  email: string;
  roomName: string | null = null;
  hashed_password: string | null = null; // Add password field

  constructor() {
    this.email = ''; // Initialize required field
  }
}