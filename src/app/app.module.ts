import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveFormsModule } from '@angular/forms';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { DataTableComponent } from './data-table/data-table.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';

import { RoomPageComponent } from './room-page/room-page.component';
import { JoinRoomComponent } from './join-room/join-room.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { ShareRoomComponent } from './share-room/share-room.component';

import { NgxMaskModule } from 'ngx-mask';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateRoomComponent,
    LandingPageComponent,
    JoinRoomComponent,
    DataTableComponent,
    RoomPageComponent,
    ShareRoomComponent,
    ConfirmationModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    NgxMaskModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatBottomSheetModule,
  ],
  providers: [MatSnackBar, MatBottomSheet],
  bootstrap: [AppComponent],
})
export class AppModule {}
