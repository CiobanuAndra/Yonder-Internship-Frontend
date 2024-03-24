import { Component, ContentChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  NgControl,
  AbstractControl,
} from '@angular/forms';
import { IntegrationService } from '../integration.service';
import { RoomDetails } from '../room-details';
import { DataTransferService } from '../data-transfer.service';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent {
  constructor(
    private integrationService: IntegrationService,
    private dataTransferService: DataTransferService,
    private router: Router
  ) {}

  createRoomForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern('([a-zA-Z]{1,}\\d*){1,}'),
    ]),
    roomName: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(100),
      Validators.pattern('([a-zA-Z]{1,}\\d*){1,}'),
    ]),
  });

  get username() {
    return this.createRoomForm?.get('username');
  }

  get roomName() {
    return this.createRoomForm?.get('roomName');
  }

  sendCreateRoomRequest(): void {
    this.username?.markAsTouched();
    this.roomName?.markAsTouched();

    if (this.roomName?.value && this.username?.value) {
      let message: RoomDetails = {
        name: this.roomName?.value,
        scrumMaster: this.username?.value,
      };

      if (this.username?.valid && this.roomName?.valid) {
        this.integrationService
          .postCreateRoom(message)
          .pipe(
            map((reqResponse: any) => {
              message.roomId = reqResponse.roomId;
              message.id = reqResponse.id;
              message.isRoomClosed = reqResponse.closed;
              message.storyId = reqResponse.storyId;
              message.username = message.scrumMaster;

              return message;
            }),
            switchMap((message) => {
              return this.integrationService.getUsersFromRoom(
                message.roomId ?? ''
              );
            })
          )
          .subscribe((res: any) => {
            message.userId = res[0].id;

            this.dataTransferService.messageDetails = message;
            this.router.navigate(['/room-page-component']);
          });
      }
    }
  }
}
