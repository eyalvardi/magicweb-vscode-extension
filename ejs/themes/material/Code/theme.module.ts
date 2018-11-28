import {NgModule} from '@angular/core';

import {
   MatButtonModule,
   MatMenuModule,
   MatToolbarModule,
   MatIconModule,
   MatCheckboxModule,

   MatCardModule, MatListModule, MatSliderModule,
   MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSnackBarModule,
   MatSortModule, MatTabsModule, MatStepperModule, MatPaginatorModule

} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MagicNoControlDirective} from '../nocontrol.magic.directive';
import {MagicFullControlDirective} from '../fullcontrol.magic.directive';
import {MagicDefaultValueAccessor, MagicFormControlNameDirective} from '../form-control-name.magic.directive';

import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      MatButtonModule,
      MatMenuModule,
      MatToolbarModule,
      MatIconModule,
      MatCardModule,
      MatListModule,
      MatSliderModule,
      MatCheckboxModule,
      MatSelectModule,
      MatSidenavModule,
      MatPaginatorModule,

      MatSlideToggleModule,
      MatSnackBarModule,
      MatSortModule,
      MatTabsModule,
      MatStepperModule,
      BrowserAnimationsModule

   ],
   exports: [
      MatButtonModule,
      MatMenuModule,
      MatToolbarModule,
      MatIconModule,
      MatCardModule,
      MatListModule,
      MatSliderModule,
      MatCheckboxModule,
      MatSelectModule,
      MatSidenavModule,
      MatSlideToggleModule,
      MatSnackBarModule,
      MatSortModule,
      MatTabsModule,
      MatStepperModule,
   ],
})
export class ThemeModule
{
   constructor() {}
}
