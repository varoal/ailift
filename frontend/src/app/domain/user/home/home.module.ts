import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    NgChartsModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
      },
    ]),
  ],
})
export class HomeModule {}
