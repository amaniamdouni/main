import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Claim } from './my-tasks.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
@Injectable()
export class MyTasksService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/my-tasks.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<Claim[]> = new BehaviorSubject<Claim[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Claim;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Claim[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllMyTaskss(): void {
    this.subs.sink = this.httpClient.get<Claim[]>(this.API_URL).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
  addMyTasks(myTasks: Claim): void {
    this.dialogData = myTasks;

    // this.httpClient.post(this.API_URL, myTasks)
    //   .subscribe({
    //     next: (data) => {
    //       this.dialogData = myTasks;
    //     },
    //     error: (error: HttpErrorResponse) => {
    //        // error code here
    //     },
    //   });
  }
  updateMyTasks(myTasks: Claim): void {
    this.dialogData = myTasks;

    // this.httpClient.put(this.API_URL + myTasks.id, myTasks)
    //     .subscribe({
    //       next: (data) => {
    //         this.dialogData = myTasks;
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
  deleteMyTasks(id: number): void {
    console.log(id);

    // this.httpClient.delete(this.API_URL + id)
    //     .subscribe({
    //       next: (data) => {
    //         console.log(id);
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
}
