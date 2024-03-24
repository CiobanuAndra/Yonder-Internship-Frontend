import { ErrorHandler, Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject, tap, find, map } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpStatusCode,
} from '@angular/common/http';
import { RoomDetails } from './room-details';
import { MatSnackBar } from '@angular/material/snack-bar';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class IntegrationService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  postCreateRoom(bodyMessage: RoomDetails): Observable<any> {
    return this.http
      .post<any>('https://localhost:7072/api/Room/create', bodyMessage)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          throwError(() => {
            console.error('PIPE ERROR:', error);
            return error.message;
          })
        )
      );
  }

  postJoinRoom(bodyMessage: RoomDetails): Observable<any> {
    return this.http
      .post<any>('https://localhost:7072/api/User/join', bodyMessage)
      .pipe(
        tap((resp) => {
          console.log(resp);
        }),

        catchError((error: HttpErrorResponse) =>
          throwError(() => {
            console.error('PIPE ERROR:', error);
            if (error.status == 409) {
              if (
                error.error ===
                'The room already has a user named ' +
                  bodyMessage.username +
                  '.'
              ) {
                this.notify(error.error, 'OK');
              } else if (error.error === 'The room is full.') {
                this.notify(error.error, 'OK');
              }
            } else if (error.status == 404) {
              this.notify("The room is closed or it doesn't exist.", 'OK');
            }
          })
        )
      );
  }

  getRoomById(guid: string) {
    return this.http.get<any>(
      'https://localhost:7072/api/Room/id?roomId=' + guid
    );
  }

  getUsersFromRoom(guid: string) {
    return this.http.get<any>('https://localhost:7072/api/Room/users/' + guid);
  }

  notify(message: string, action: string) {
    this.snackBar.open(message, action, { duration: 3000 });
  }
}
