import { AuthService } from '../../../../../demo/services/auth/auth.service';
// angular import
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party

// icon
import { IconService } from '@ant-design/icons-angular';
import {
  BellOutline,
  SettingOutline,
  GiftOutline,
  MessageOutline,
  PhoneOutline,
  CheckCircleOutline,
  LogoutOutline,
  EditOutline,
  UserOutline,
  ProfileOutline,
  WalletOutline,
  QuestionCircleOutline,
  LockOutline,
  CommentOutline,
  UnorderedListOutline,
  ArrowRightOutline,
  GithubOutline,
  AlertOutline,
  BugOutline
} from '@ant-design/icons-angular/icons';
import { ApiService } from 'src/app/demo/services/api/api.service';
import { SharedService } from 'src/app/demo/services/shared/shared.service';

@Component({
  selector: 'app-nav-right',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  @Input() styleSelectorToggle!: boolean;
  @Output() Customize = new EventEmitter();
  windowWidth: number;
  screenFull: boolean = true;
  notifications :any[any] = [];
  neverSeenCount = 0;
  initval = 0;
  user: any = {
    firstName: '',
    role:""
  }
  isLoading = false;
  constructor(
    private iconService: IconService,
    private auth:AuthService,
    private api: ApiService,
    private sharedService: SharedService
    ) {
    this.windowWidth = window.innerWidth;
    this.iconService.addIcon(
      ...[
        CheckCircleOutline,
        GiftOutline,
        MessageOutline,
        SettingOutline,
        PhoneOutline,
        LogoutOutline,
        UserOutline,
        EditOutline,
        ProfileOutline,
        QuestionCircleOutline,
        LockOutline,
        CommentOutline,
        UnorderedListOutline,
        ArrowRightOutline,
        BellOutline,
        GithubOutline,
        WalletOutline,
        AlertOutline,
        BugOutline
      ]
    );
  }
  async ngOnInit() {
    this.getUser()
    this.notifications = await this.api.getNotifications();
    this.neverSeenCount = this.notifications.filter((noti) => !noti.seen).length;
    console.log(this.notifications);

    // Fix subscription without async inside the callback
    this.sharedService.currentData.subscribe((updatedData) => {
      if(updatedData > this.initval){
        this.initval = updatedData
        this.ngOnInit(); // Re-call ngOnInit to handle updated data
      }

    });
  }
  profile = [
    {
      icon: 'edit',
      title: 'Edit Profile',
      link: '/profile'
    },
    {
      icon: 'user',
      title: 'View Profile',
      link: '/profile'
    },
    {
      icon: 'profile',
      title: 'Social Profile',
      link: '/social-profile'
    },
    {
      icon: 'wallet',
      title: 'Billing'
    }
  ];

  setting = [
    {
      icon: 'question-circle',
      title: 'Support'
    },
    {
      icon: 'user',
      title: 'Account Settings'
    },
    {
      icon: 'lock',
      title: 'Privacy Center'
    },
    {
      icon: 'comment',
      title: 'Feedback'
    },
    {
      icon: 'unordered-list',
      title: 'History'
    }
  ];
  logout(){
    this.auth.logout()
  }
  async set_seen(id : number){
    for (let noti of this.notifications) {
      if (noti.id == id && !noti.seen) {
        this.api.setSeenNotification(id).then((res) =>{
          this.notifications = res
          let count = 0
          for(let noti of this.notifications){
            if(!noti.seen) count++
          }
          this.neverSeenCount = count
        })
      }
    }
  }
  async getUser(){
    this.isLoading = true;
    this.api.getAuthorizedUserUser().then(
      (res) => {
        console.log(res)
        this.user = res
        this.isLoading = false;
      }
    ).catch(
      (err) => {
        throw err;
      }
    )
  }
}
