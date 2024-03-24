import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { ShareRoomComponent } from '../share-room/share-room.component';
import { DataTransferService } from '../data-transfer.service';
import { RoomDetails } from '../room-details';
import { TableDataService } from '../table-data-service.service';
import { VotingData } from '../voting-data';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

import { Observable, throwError, BehaviorSubject, tap, find, map } from 'rxjs';

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpStatusCode,
} from '@angular/common/http';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss'],
})
export class RoomPageComponent {
  public selectedCard?: string;
  public submittedCard?: string;
  constructor(
    private bottomSheet: MatBottomSheet,
    private dataTransferService: DataTransferService,
    private tableDataService: TableDataService,
    private http: HttpClient
  ) {}

  get roomDetails(): RoomDetails {
    return this.dataTransferService.messageDetails;
  }

  openShareModal(): void {
    this.bottomSheet.open(ShareRoomComponent);
  }

  disableEnableCardStack(event: any) {
    if (event === true) {
      console.log(event);
      let stackOfCards = document.getElementsByClassName('card');
      Array.from(stackOfCards).forEach((card) => {
        if (!card.className.includes(' card-disabled')) {
          card.setAttribute('class', card.className + ' card-disabled');
        }
      });

      document
        .getElementById('submitBtn')
        ?.setAttribute('disabled', 'disabled');
    } else {
      console.log(event);
      this.selectedCard = undefined;
      this.submittedCard = undefined;

      let stackOfCards = document.getElementsByClassName('card');
      Array.from(stackOfCards).forEach((card) => {
        card.setAttribute(
          'class',
          card.className.replace(' card-disabled', '')
        );
        card.setAttribute(
          'class',
          card.className.replace(' card-selected', '')
        );
      });

      document.getElementById('submitBtn')?.removeAttribute('disabled');
    }
  }

  openConfirmationModal(_clickedButton: string): void {
    this.bottomSheet.open(ConfirmationModalComponent, {
      data: { clickedButton: _clickedButton },
    });
  }

  selectCard(e: any) {
    let stackOfCards = document.getElementsByClassName('card');
    Array.from(stackOfCards).forEach((card) => {
      card.setAttribute('class', card.className.replace(' card-selected', ''));
    });
    let clickedCard = document.getElementById(e.target.id);
    clickedCard?.setAttribute('class', e.target.className + ' card-selected');
    this.selectedCard = e.target.id;
  }

  submitVote() {
    if (this.selectedCard == undefined) {
      this.dataTransferService.notify('Please select a card', 'OK', 3000);
    } else if (this.submittedCard == undefined) {
      let stackOfCards = document.getElementsByClassName('card');
      Array.from(stackOfCards).forEach((card) => {
        card.setAttribute('class', card.className + ' card-disabled');
      });

      if (
        this.dataTransferService.messageDetails.storyId &&
        this.dataTransferService.messageDetails.userId
      ) {
        let voteData: VotingData = {
          value: parseFloat(this.selectedCard),
          storyId: this.dataTransferService.messageDetails.storyId,
          userId: this.dataTransferService.messageDetails.userId,
        };

        this.tableDataService.submitVote(voteData).subscribe({
          next: (res) => {
            if (res.id) {
              this.submittedCard = this.selectedCard;
            }
          },
        });
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
}
