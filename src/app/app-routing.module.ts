import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditExistingPageComponent } from './pages/edit-existing-page/edit-existing-page.component';
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { authGuardGuard } from "./guards/auth-guard.guard";
import { UploadPageComponent } from './pages/upload-page/upload-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePageComponent,
    canMatch: [authGuardGuard]
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'upload',
    canMatch: [authGuardGuard],
    component: UploadPageComponent
  },
  {
    path: 'edit',
    canMatch: [authGuardGuard],
    component: EditExistingPageComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
