import { useEffect, useRef } from 'react';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { TablePagination } from './TablePagination';
import { useTable } from '@/context/TableContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TableData } from '@/types/table';
import { FileSpreadsheet, X } from 'lucide-react';

export const DataTable = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const { 
    state, 
    setColumnOrder, 
    clearSelection, 
    getSelectedRows,
    exportToExcel
  } = useTable();
  
  const { 
    data, 
    columns, 
    columnOrder, 
    pagination,
    loading 
  } = state;
  
  const { pageIndex, pageSize } = pagination;
  
  const paginatedData = data.slice(
    pageIndex * pageSize, 
    (pageIndex + 1) * pageSize
  );
  
  const selectedRows = getSelectedRows();
  const selectedCount = selectedRows.length;
  
  useEffect(() => {
    const handleColumnDrop = (e: DragEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      const columnHeader = target.closest('th');
      
      if (!columnHeader) return;
      
      const droppedColumnId = e.dataTransfer?.getData('text/plain');
      const targetColumnId = columnHeader.getAttribute('data-column-id');
      
      if (!droppedColumnId || !targetColumnId || droppedColumnId === targetColumnId) {
        return;
      }
      
      // Find the indexes of the dropped and target columns
      const oldIndex = columnOrder.indexOf(droppedColumnId);
      const newIndex = columnOrder.indexOf(targetColumnId);
      
      if (oldIndex === -1 || newIndex === -1) return;
      
      // Create a new column order with the dropped column moved to the new position
      const newColumnOrder = [...columnOrder];
      newColumnOrder.splice(oldIndex, 1);
      newColumnOrder.splice(newIndex, 0, droppedColumnId);
      
      setColumnOrder(newColumnOrder);
    };
    
    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener('dragover', (e) => e.preventDefault());
      tableElement.addEventListener('drop', handleColumnDrop as EventListener);
      
      return () => {
        tableElement.removeEventListener('dragover', (e) => e.preventDefault());
        tableElement.removeEventListener('drop', handleColumnDrop as EventListener);
      };
    }
  }, [columnOrder, setColumnOrder]);
  
  const renderTableLoadingState = () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
  
  return (
    <div className="flex flex-col">
      {selectedCount > 0 && (
        <div className="bg-primary/5 border-b border-primary/10 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{selectedCount} row{selectedCount !== 1 ? 's' : ''} selected</span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={clearSelection}
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={exportToExcel}
          >
            <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />
            Export Selected
          </Button>
        </div>
      )}
      
      <div className="relative overflow-x-auto shadow-sm border border-gray-200 rounded-md" ref={tableRef}>
        {loading ? (
          <div className="p-4">{renderTableLoadingState()}</div>
        ) : (
          <table className="w-full divide-y divide-gray-200 table-fixed">
            <TableHeader columns={columns} />
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedData.map((row: TableData) => (
                <TableRow key={row.id} row={row} />
              ))}
              
              {paginatedData.length === 0 && (
                <tr>
                  <td 
                    colSpan={columns.length} 
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      
      <TablePagination />
      
      <div className="mt-4 flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={clearSelection}
          disabled={selectedCount === 0}
        >
          Clear All
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={exportToExcel}
          className="flex items-center space-x-1"
        >
          <FileSpreadsheet className="h-4 w-4 mr-1" />
          <span>Export {selectedCount > 0 ? 'Selected' : 'All'}</span>
        </Button>
      </div>
    </div>
  );
};