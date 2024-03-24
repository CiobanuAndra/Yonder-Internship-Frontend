import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRoomComponent } from './create-room/create-room.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { JoinRoomComponent } from './join-room/join-room.component';
import { RoomPageComponent } from './room-page/room-page.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'create-room-component',
    component: CreateRoomComponent,
  },
  {
    path: 'join-room-component',
    component: JoinRoomComponent,
  },
  {
    path: 'join-room-component/:id',
    component: JoinRoomComponent,
  },
  {
    path: 'room-page-component',

    component: RoomPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
