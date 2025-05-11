import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { ColumnDef, SortState } from '@/types/table';
import { cn } from '@/lib/utils';
import { useTable } from '@/context/TableContext';

interface TableHeaderProps {
  columns: ColumnDef[];
}

export const TableHeader = ({ columns }: TableHeaderProps) => {
  const { state, setSorting, toggleAllSelection, setColumnSizing } = useTable();
  const { columnOrder, rowSelection, sorting, data } = state;

  const [draggingColumn, setDraggingColumn] = useState<string | null>(null);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState<number>(0);
  const [initialWidth, setInitialWidth] = useState<number>(0);

  const allSelected =
    data.length > 0 && data.every(row => rowSelection[row.id]);

  const someSelected =
    !allSelected && data.some(row => rowSelection[row.id]);

  const handleResizeStart = (e: React.MouseEvent, columnId: string) => {
    setResizingColumn(columnId);
    setResizeStartX(e.clientX);
    setInitialWidth(state.columnSizing[columnId] || 150);

    const handleMouseMove = (e: MouseEvent) => {
      if (resizingColumn) {
        const offset = e.clientX - resizeStartX;
        const newWidth = Math.max(100, initialWidth + offset);
        setColumnSizing({ [columnId]: newWidth });
      }
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const renderColumnHeader = (column: ColumnDef) => {
    if (column.meta?.isCheckbox) {
      return (
        <div className="pl-4 pr-3">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
            checked={allSelected}
            ref={input => {
              if (input) {
                input.indeterminate = someSelected && !allSelected;
              }
            }}
            onChange={toggleAllSelection}
            aria-label="Select all rows"
          />
        </div>
      );
    }

    if (column.id === 'avatar') {
      return <div className="w-10" />;
    }

    const isSortable = column.isSortable;
    const isSorted = sorting.column === column.id;
    const sortDirection = isSorted ? sorting.direction : null;

    const handleSortClick = () => {
      if (!isSortable) return;

      let direction: SortState['direction'] = 'asc';
      if (sortDirection === 'asc') {
        direction = 'desc';
      } else if (sortDirection === 'desc') {
        direction = null;
      }

      setSorting(column.id, direction);
    };

    return (
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-3.5 text-sm font-medium text-gray-900',
          isSortable && 'cursor-pointer select-none'
        )}
        onClick={isSortable ? handleSortClick : undefined}
      >
        <span>{column.header}</span>
        {isSortable && (
          <span className="inline-flex">
            {sortDirection === 'asc' ? (
              <ArrowUp className="h-4 w-4 text-gray-600" />
            ) : sortDirection === 'desc' ? (
              <ArrowDown className="h-4 w-4 text-gray-600" />
            ) : (
              <div className="h-4 w-4" />
            )}
          </span>
        )}
        {column.header === 'Info' && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Additional information about the record</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        {columnOrder.map((columnId) => {
          const column = columns.find((col) => col.id === columnId);
          if (!column) return null;

          return (
            <th
              key={column.id}
              className={cn(
                'group relative border-b border-r border-gray-200 font-medium bg-gray-50',
                column.isSticky && 'sticky left-0 z-10',
                column.meta?.isCheckbox && 'w-12',
                draggingColumn === column.id && 'bg-primary/10'
              )}
              style={{
                width: state.columnSizing[column.id],
                minWidth: column.meta?.isCheckbox ? 48 : 100
              }}
              data-column-id={column.id}
            >
              {renderColumnHeader(column)}

              {column.enableDragging && (
                <div
                  className="absolute inset-y-0 left-0 w-6 cursor-move flex items-center justify-center bg-muted/10 hover:bg-muted/20 transition-colors rounded-r"
                  draggable
                  onDragStart={(e) => {
                    setDraggingColumn(column.id);
                    e.dataTransfer.setData('text/plain', column.id);

                    const el = document.createElement('div');
                    el.className = 'bg-white border border-primary shadow-md rounded p-2 text-sm';
                    el.innerText = column.header;
                    document.body.appendChild(el);
                    e.dataTransfer.setDragImage(el, 0, 0);
                    setTimeout(() => document.body.removeChild(el), 0);
                  }}
                  onDragEnd={() => setDraggingColumn(null)}
                >
                  <GripVertical className="h-4 w-4 text-gray-400" />
                </div>
              )}

              {column.enableResizing && (
                <div
                  className="absolute inset-y-0 right-0 w-2 cursor-col-resize bg-muted/5 hover:bg-primary/30 transition-colors"
                  onMouseDown={(e) => handleResizeStart(e, column.id)}
                />
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};