import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { VotingData } from './voting-data';

import { DataTransferService } from './data-transfer.service';

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  constructor(
    protected http: HttpClient,
    private dataTransfer: DataTransferService
  ) {}

  getUsersFromRoom(roomId: string): Observable<any> {
    return this.http.get('https://localhost:7072/api/Room/users/' + roomId, {
      observe: 'response',
    });
  }

  submitVote(voteData: VotingData): Observable<any> {
    return this.http.put(
      'https://localhost:7072/api/Vote/submit-vote',
      voteData
    );
  }

  putShowVotes(userId: number, roomId: string) {
    let body = {};
    return this.http.put<any>(
      'https://localhost:7072/api/Vote/show-votes?userId=' +
        userId +
        '&roomId=' +
        roomId,
      body
    );
  }

  getCurrentStory(roomId: string) {
    return this.http.get<any>(
      'https://localhost:7072/api/Story/get-current-story?roomId=' + roomId
    );
  }

  getRoomById(guid: string) {
    return this.http.get<any>(
      'https://localhost:7072/api/Room/id?roomId=' + guid
    );
  }

  onEndRoom() {
    let body = {};
    return this.http
      .put(
        'https://localhost:7072/api/Room/end-room?userId=' +
          this.dataTransfer.messageDetails.userId +
          '&Id=' +
          this.dataTransfer.messageDetails.roomId,
        body
      )
      .subscribe();
  }

  onDeleteValues(body: any) {
    this.dataTransfer.notify(
      'The curent story voting session has ended and a new one has started.',
      'OK',
      3000
    );
    return this.http.post('https://localhost:7072/api/Story/end-story', body);
  }
}
