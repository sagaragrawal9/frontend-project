import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TableData } from '@/types/table';
import { useTable } from '@/context/TableContext';
import { cn } from '@/lib/utils';

interface TableRowProps {
  row: TableData;
}

export const TableRow = ({ row }: TableRowProps) => {
  const { state, toggleRowSelection } = useTable();
  const { columnOrder, columns, rowSelection } = state;
  const [isHovered, setIsHovered] = useState(false);
  
  const isSelected = rowSelection[row.id] || false;

  return (
    <tr 
      className={cn(
        "transition-colors duration-200 ease-in-out",
        isSelected ? "bg-primary/5" : isHovered ? "bg-gray-50" : "bg-white",
        "border-b border-gray-200"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {columnOrder.map(columnId => {
        const column = columns.find(col => col.id === columnId);
        if (!column) return null;
        
        return (
          <td 
            key={columnId}
            className={cn(
              "px-3 py-3 text-sm text-gray-900 border-r border-gray-200",
              column.isSticky && "sticky left-0 z-10",
              isSelected && column.isSticky ? "bg-primary/5" : 
              isHovered && column.isSticky ? "bg-gray-50" : 
              column.isSticky ? "bg-white" : ""
            )}
            style={{
              width: state.columnSizing[column.id],
              minWidth: column.meta?.isCheckbox ? 48 : 100
            }}
          >
            {column.meta?.isCheckbox ? (
              <div className="pl-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                  checked={isSelected}
                  onChange={() => toggleRowSelection(row.id)}
                  aria-label={`Select row ${row.id}`}
                />
              </div>
            ) : column.id === 'avatar' ? (
              <div className="flex justify-center">
                <img 
                  src={row.avatar} 
                  alt={`${row.name} avatar`}
                  className="h-8 w-8 rounded-full"
                />
              </div>
            ) : column.id === 'amount' ? (
              <div className="font-medium text-right">
                ${row[column.accessorKey] ? row[column.accessorKey].toFixed(2) : '0.00'}
              </div>
            ) : column.id === 'tooltip' ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="block w-full truncate max-w-[150px] text-left">
                    {String(row[column.accessorKey] || '')}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{String(row[column.accessorKey] || '')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className={
                cn("truncate max-w-[200px]", 
                column.id === 'description' && "max-w-[300px] text-gray-600"
              )}>
                {String(row[column.accessorKey] || '')}
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
};