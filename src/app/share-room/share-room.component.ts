import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { DataTransferService } from '../data-transfer.service';
import { RoomDetails } from '../room-details';

@Component({
  selector: 'app-share-room',
  templateUrl: './share-room.component.html',
  styleUrls: ['./share-room.component.scss'],
})
export class ShareRoomComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<ShareRoomComponent>,
    private dataTransferService: DataTransferService
  ) {}

  get roomDetails(): RoomDetails {
    return this.dataTransferService.messageDetails;
  }

  async copyRoomInviteLink() {
    await navigator.clipboard.writeText(
      'http://localhost:4200/join-room-component/' + this.roomDetails.roomId
    );

    this.bottomSheetRef.dismiss();
    this.dataTransferService.notify(
      'Invite Link copied to clipboard',
      'OK',
      3000
    );
  }
}
