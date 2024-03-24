import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { RoomDetails } from './room-details';

@Injectable({
  providedIn: 'root',
})
export class DataTransferService {
  public message: RoomDetails = {};
  constructor(private snackBar: MatSnackBar) {}

  set messageDetails(_message: RoomDetails) {
    this.message = _message;
  }

  get messageDetails(): RoomDetails {
    return this.message;
  }

  notify(message: string, action: string, time: number) {
    this.snackBar.open(message, action, { duration: time });
  }
}
