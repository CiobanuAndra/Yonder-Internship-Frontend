import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IntegrationService } from '../integration.service';
import { ActivatedRoute } from '@angular/router';
import { RoomDetails } from '../room-details';
import { DataTransferService } from '../data-transfer.service';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss'],
})
export class JoinRoomComponent implements OnInit {
  public isRoomIdDisabled: boolean = false;
  constructor(
    private integrationService: IntegrationService,
    private route: ActivatedRoute,
    private dataTransferService: DataTransferService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id')) {
      this.isRoomIdDisabled = true;
      this.joinRoomForm.controls.roomID.setValue(
        this.route.snapshot.paramMap.get('id')
      );
    }
  }

  joinRoomForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern('([a-zA-Z]{1,}\\d*){1,}'),
    ]),
    roomID: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
      ),
    ]),
  });

  get username() {
    return this.joinRoomForm?.get('username');
  }

  get roomID() {
    return this.joinRoomForm?.get('roomID');
  }

  sendJoinRoomRequest(): void {
    this.username?.markAsTouched();
    this.roomID?.markAsTouched();

    if (this.username?.value && this.roomID?.value) {
      let message: RoomDetails = {
        username: this.username?.value,
        roomId: this.roomID?.getRawValue(),
      };

      if (this.username?.valid && this.roomID?.valid) {
        this.integrationService
          .postJoinRoom(message)
          .pipe(
            map((reqResponse) => {
              message.name = reqResponse.roomName;
              message.id = reqResponse.id;
              message.isRoomClosed = reqResponse.closed;
              message.storyId = reqResponse.storyId;
              message.scrumMaster = reqResponse.scrumName;

              return message;
            }),
            switchMap((message) =>
              this.integrationService.getUsersFromRoom(message.roomId ?? '')
            )
          )
          .subscribe((reqResponse) => {
            Array.from(reqResponse).forEach((user: any) => {
              if (user.name == message.username) {
                message.userId = user.id;
              }
            });

            if (message.userId != undefined) {
              this.dataTransferService.messageDetails = message;
              this.router.navigate(['/room-page-component']);
            } else {
              throw new Error('User was not found in database');
            }
          });
      }
    }
  }
}
