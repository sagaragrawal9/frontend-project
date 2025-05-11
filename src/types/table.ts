export interface TableData {
  id: string;
  avatar: string;
  name: string;
  description: string;
  amount: number;
  tooltip: string;
  source?: string;
}

export interface ColumnDef {
  id: string;
  header: string;
  accessorKey: keyof TableData;
  isSticky?: boolean;
  isSortable?: boolean;
  enableResizing?: boolean;
  enableDragging?: boolean;
  cell?: (row: TableData) => React.ReactNode;
  meta?: {
    isCheckbox?: boolean;
  };
}

export interface SortState {
  column: string | null;
  direction: 'asc' | 'desc' | null;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface TableState {
  data: TableData[];
  columns: ColumnDef[];
  columnOrder: string[];
  columnSizing: Record<string, number>;
  rowSelection: Record<string, boolean>;
  sorting: SortState;
  pagination: PaginationState;
  loading: boolean;
}

export interface TableContextType {
  state: TableState;
  setColumnOrder: (order: string[]) => void;
  setColumnSizing: (sizing: Record<string, number>) => void;
  toggleRowSelection: (id: string) => void;
  clearSelection: () => void;
  toggleAllSelection: () => void;
  setSorting: (column: string, direction: 'asc' | 'desc' | null) => void;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  getSelectedRows: () => TableData[];
  exportToExcel: () => void;
}