import { Component, Inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { DataTransferService } from '../data-transfer.service';
import { TableDataService } from '../table-data-service.service';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<ConfirmationModalComponent>,
    private tableDataService: TableDataService,
    private dataTransferService: DataTransferService
  ) {}

  takeAction(btnValue: string) {
    if (btnValue === 'NO') {
      this.bottomSheetRef.dismiss();
    } else {
      if (this.data.clickedButton === 'showValues') {
        this.showValues();
        this.bottomSheetRef.dismiss();
      } else if (this.data.clickedButton === 'deleteValues') {
        this.onDeleteValuesConection();
        this.bottomSheetRef.dismiss();
      } else if (this.data.clickedButton === 'endRoom') {
        this.onEndRoomConection();
        this.bottomSheetRef.dismiss();
      }
    }
  }

  showValues() {
    this.tableDataService
      .putShowVotes(
        this.dataTransferService.messageDetails.userId ?? 0,
        this.dataTransferService.messageDetails.roomId ?? ''
      )
      .subscribe();
  }
  onEndRoomConection() {
    this.tableDataService.onEndRoom();
  }
  onDeleteValuesConection() {
    let body = {
      roomId: this.dataTransferService.messageDetails.roomId,
      scrumId: this.dataTransferService.messageDetails.userId,
      storyId: this.dataTransferService.messageDetails.storyId,
    };
    this.tableDataService.onDeleteValues(body).subscribe();
  }
}
