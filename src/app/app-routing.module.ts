import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './features/landing/landing.component';
import { DisposalComponent } from './features/disposal/disposal.component';
import { AboutComponent } from './features/about/about.component';
const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'dispose/:method',
    component: DisposalComponent
  },
  {
  path: 'about',
  component: AboutComponent
},
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}