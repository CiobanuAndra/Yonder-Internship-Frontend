import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Observable, Subscription, map } from 'rxjs';
import { interval } from 'rxjs/internal/observable/interval';
import { TableDataService } from '../table-data-service.service';
import { switchMap } from 'rxjs/operators';
import { DataTransferService } from '../data-transfer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit, OnDestroy {
  public tableDataLoading: boolean = true;
  public displayedColumns = ['name', 'storyPoints'];
  public users: { id: number; name: string; storyPoints: string }[] = [];
  public votesShown: boolean = false;
  public userSubmitted: boolean = false;

  @Output() valuesShowed = new EventEmitter<boolean>();
  @Input() currentUserValue = '';
  datasource = new MatTableDataSource(this.users);
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.datasource.sort = this.sort;
    this.datasource._updateChangeSubscription();
  }

  timeInterval: Subscription = new Subscription();
  status: any;

  constructor(
    private tableDataService: TableDataService,
    private dataTransferService: DataTransferService,
    private router: Router
  ) {}

  get roomDetails() {
    return this.dataTransferService.messageDetails;
  }

  ngOnInit(): void {
    this.timeInterval = interval(2000)
      .pipe(
        switchMap(() => {
          //getting all users from the room with roomId
          if (this.roomDetails.roomId) {
            return this.tableDataService.getUsersFromRoom(
              this.roomDetails.roomId
            );
          } else {
            return new Observable<any>();
          }
        }),
        map((res) => {
          //add all users in table
          if (res.body) {
            while (this.users.pop());
            (res.body as []).map((user) => {
              if (
                user['name'] ===
                this.dataTransferService.messageDetails.username
              ) {
                if (this.currentUserValue != '') {
                  this.userSubmitted = true;
                }
                this.users.push({
                  id: user['id'],
                  name:
                    this.roomDetails.scrumMaster === user['name']
                      ? '👑' + user['name']
                      : user['name'],
                  storyPoints: this.currentUserValue.toString(),
                });
              } else {
                this.users.push({
                  id: user['id'],
                  name:
                    this.roomDetails.scrumMaster === user['name']
                      ? '👑' + user['name']
                      : user['name'],
                  storyPoints: '',
                });
              }
            });
          }
        }),
        switchMap(() => {
          // request for current story to check status of votes (shown or not)
          if (this.roomDetails.roomId) {
            return this.tableDataService.getCurrentStory(
              this.roomDetails.roomId
            );
          } else {
            return new Observable<any>();
          }
        }),
        map((res) => {
          if (this.roomDetails.storyId !== res.storyId) {
            this.dataTransferService.messageDetails.storyId = res.storyId;
            let tableData = this.datasource.data;
            tableData.forEach((user: any) => {
              user.storyPoints = '';
            });
            this.datasource.data = tableData;
            this.votesShown = false;
            this.userSubmitted = false;
            this.valuesShowed.emit(this.votesShown);
          }
          // in case votes were shown, I add them to the table
          if (res.showed === true) {
            let votesArray = res.votes;
            this.votesShown = true;
            this.valuesShowed.emit(this.votesShown);

            let tableData = this.datasource.data;
            votesArray.forEach((user: any) => {
              tableData.forEach((row: any) => {
                if (row.id === user.userId)
                  row.storyPoints = user.value.toString();
              });
            });

            this.datasource.data = tableData;
          }
        }),
        switchMap(() => {
          if (this.roomDetails.roomId) {
            return this.tableDataService.getRoomById(this.roomDetails.roomId);
          } else {
            return new Observable<any>();
          }
        }),
        map((res) => {
          if (res.closed == true) {
            this.dataTransferService.notify('The room was closed', 'Ok', 3000);
            this.router.navigate(['']);
          }
        })
      )
      .subscribe({
        next: (res) => {
          this.tableDataLoading = false;
          this.datasource._updateChangeSubscription();
        },
      });
  }

  ngOnDestroy(): void {
    this.timeInterval.unsubscribe();
  }
}
