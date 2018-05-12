import { NgModule, Injectable } from '@angular/core';
import { RouterModule, Routes, CanActivate, Router } from '@angular/router';
import { HelloComponent } 		from '../components/hello/hello.component';
import { HomeComponent } 		  from '../components/home/home.component';
import { CreateEventComponent }       from '../components/createEvent/createEvent.component';
import { ViewEventComponent }       from '../components/viewEvent/viewEvent.component';
import { AuthService } 			  from '../services/auth.service';

import { EmailVerificationComponent } from '../components/email-verification/email-verification.component';
import { UserComponent } from '../components/user/user.component';
import { UserListComponent } from '../components/user/user-list.component';
import { UserEditComponent } from '../components/user/user-edit.component';
import { EventEditComponent } from '../components/event-edit/event-edit.component';
import { EventListComponent } from '../components/event-list/event-list.component';
import { UserEditImageComponent } from '../components/user/user-edit-image.component';
import { UserSearchComponent } from "../components/user/user-search.component";
import { WishListComponent } from '../components/wishlist/wishlist.component';
import { ChatComponent } from "../components/chat/chat.component";
import { ExportEventsPlanComponent } from "../components/export-events-plan/export-events-plan.component";
import { UserEditPasswordComponent } from "../components/user/user-edit-password/user-edit-password.component";
import { PersonalPlanSettingComponent } from "../components/personal-plan-setting/personal-plan-setting.component";
import { RecoverPasswordComponent } from '../components/recover-password/recover-password.component';
import { RecoverLoginComponent } from '../components/recover-login/recover-login.component';
import { ChangePasswordComponent } from '../components/change-password/change-password.component';
import { RootFolderComponent } from "../components/folders/rootFolder/rootFolder.component"
import { CreateNoteComponent } from "../components/notes/createNote/createNote.component"
import { FolderComponent } from "../components/folders/folder/folder.component"
import {UserSettingsComponent} from "../components/user/user-settings/user-settings.component";

@Injectable()
export class OnlyLoggedInUsersGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {};

  canActivate() {
    if (!this.auth.authenticated) {
      this.router.navigateByUrl('/hello');
      return false;
    }
    return true;
  }
}

const routes: Routes = [
  { path: '', redirectTo: '/hello', pathMatch: 'full' },
  { path: 'hello',
  	component: HelloComponent },
  { path: 'email-verification/:token',
    component: EmailVerificationComponent },
  { path: 'recover/password',
    component: RecoverPasswordComponent },
  { path: 'recover/login',
    component: RecoverLoginComponent },
  { path: 'recover-password/:token',
    component: ChangePasswordComponent },
  { path: 'home',
    component: HomeComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'event/create',
    component: CreateEventComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'events/list',
      component: EventListComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'event/:id',
    component: ViewEventComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'users',
    component: UserListComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'wishlist',
    component: WishListComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'users/:id',
    component: UserComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'users/:id/wishlist',
    component: WishListComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'users/:id/edit',
    component: UserEditComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'users/:id/settings',
    component: UserSettingsComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'event/:id/edit',
    component: EventEditComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'users/:id/updateImage',
    component: UserEditImageComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'changePassword',
    component: UserEditPasswordComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'searchUsers',
    component: UserSearchComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'event/:id/chats/withCreator',
    component: ChatComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'event/:id/chats/withoutCreator',
    component: ChatComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'events/export',
    component: ExportEventsPlanComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'users/setting/plan',
    component: PersonalPlanSettingComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'folders/rootFolder',
    component: RootFolderComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'folders/rootFolder/folder/:id',
    component: FolderComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: 'note/create',
    component: CreateNoteComponent,
    canActivate: [ OnlyLoggedInUsersGuard ] },
  { path: '**', redirectTo: '/hello', pathMatch: 'full'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [ OnlyLoggedInUsersGuard,
               AuthService ]
})
export class AppRoutingModule {}
