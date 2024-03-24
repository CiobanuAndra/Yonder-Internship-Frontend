import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface DataTableItem {
  storyPoints: number;
  names: string;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: DataTableItem[] = [
  { names: 'Bogdan', storyPoints: 5 },
  { names: 'Iuliana', storyPoints: 18 },
  { names: 'Jojo', storyPoints: 1 },
  { names: 'Bogdan', storyPoints: 5 },
  { names: 'Iuliana', storyPoints: 18 },
  { names: 'Jojo', storyPoints: 1 },
  { names: 'Bogdan', storyPoints: 5 },
  { names: 'Iuliana', storyPoints: 18 },
  { names: 'Jojo', storyPoints: 1 },
  { names: 'Jojo', storyPoints: 1 },
];

/**
 * Data source for the DataTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class DataTableDataSource extends DataSource<DataTableItem> {
  data: DataTableItem[] = EXAMPLE_DATA;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<DataTableItem[]> {
    if (this.sort) {
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.sort.sortChange).pipe(
        map(() => {
          return this.getPagedData(this.getSortedData([...this.data]));
        })
      );
    } else {
      throw Error(
        'Please set the paginator and sort on the data source before connecting.'
      );
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */

  private getPagedData(data: DataTableItem[]): DataTableItem[] {
    // if (this.paginator) {
    //   const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    //   return data.splice(startIndex, this.paginator.pageSize);
    // } else {
    return data;
    // }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: DataTableItem[]): DataTableItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'storyPoints':
          return compare(a.storyPoints, b.storyPoints, isAsc);
        case 'names':
          return compare(+a.names, +b.names, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
