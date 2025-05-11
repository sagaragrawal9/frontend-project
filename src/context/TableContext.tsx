import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TableContextType, TableData, TableState, SortState } from '../types/table';
import { generateMockData, defaultColumns } from '../data/mockData';
import * as XLSX from 'xlsx';

const initialState: TableState = {
  data: [],
  columns: defaultColumns,
  columnOrder: defaultColumns.map(col => col.id),
  columnSizing: {},
  rowSelection: {},
  sorting: { column: null, direction: null },
  pagination: { pageIndex: 0, pageSize: 10 },
  loading: true
};

const TableContext = createContext<TableContextType | undefined>(undefined);

export const TableProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<TableState>(initialState);

  useEffect(() => {
    // Simulate loading data from API
    const timer = setTimeout(() => {
      setState(prev => ({
        ...prev,
        data: generateMockData(),
        loading: false
      }));
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const setColumnOrder = (order: string[]) => {
    setState(prev => ({ ...prev, columnOrder: order }));
  };

  const setColumnSizing = (sizing: Record<string, number>) => {
    setState(prev => ({ 
      ...prev, 
      columnSizing: { ...prev.columnSizing, ...sizing } 
    }));
  };

  const toggleRowSelection = (id: string) => {
    setState(prev => ({
      ...prev,
      rowSelection: {
        ...prev.rowSelection,
        [id]: !prev.rowSelection[id]
      }
    }));
  };

  const clearSelection = () => {
    setState(prev => ({ ...prev, rowSelection: {} }));
  };

  const toggleAllSelection = () => {
    const { data, rowSelection } = state;
    const allSelected = data.length > 0 && data.every(row => rowSelection[row.id]);
    
    if (allSelected) {
      clearSelection();
    } else {
      const newSelection = data.reduce<Record<string, boolean>>((acc, row) => {
        acc[row.id] = true;
        return acc;
      }, {});
      
      setState(prev => ({ ...prev, rowSelection: newSelection }));
    }
  };

  const setSorting = (column: string, direction: SortState['direction']) => {
    setState(prev => {
      // Sort the data based on the column and direction
      const sortedData = [...prev.data].sort((a, b) => {
        if (!column || !direction) return 0;
        
        const columnKey = prev.columns.find(col => col.id === column)?.accessorKey;
        if (!columnKey) return 0;

        const valueA = a[columnKey];
        const valueB = b[columnKey];
        
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return direction === 'asc' ? valueA - valueB : valueB - valueA;
        }
        
        return 0;
      });

      return {
        ...prev,
        data: sortedData,
        sorting: { column, direction }
      };
    });
  };

  const setPageIndex = (index: number) => {
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, pageIndex: index }
    }));
  };

  const setPageSize = (size: number) => {
    setState(prev => ({
      ...prev,
      pagination: { pageIndex: 0, pageSize: size }
    }));
  };

  const getSelectedRows = (): TableData[] => {
    return state.data.filter(row => state.rowSelection[row.id]);
  };

  const exportToExcel = () => {
    const selectedRows = getSelectedRows();
    const dataToExport = selectedRows.length > 0 ? selectedRows : state.data;
    
    // Prepare data for export - exclude the avatar field
    const exportData = dataToExport.map(({ avatar, ...rest }) => rest);
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');
    
    // Generate file and trigger download
    XLSX.writeFile(workbook, 'table-data.xlsx');
  };

  const value: TableContextType = {
    state,
    setColumnOrder,
    setColumnSizing,
    toggleRowSelection,
    clearSelection,
    toggleAllSelection,
    setSorting,
    setPageIndex,
    setPageSize,
    getSelectedRows,
    exportToExcel
  };

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
};

export const useTable = (): TableContextType => {
  const context = useContext(TableContext);
  
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  
  return context;
};