import { TableProvider } from '@/context/TableContext';
import { DataTable } from '@/components/DataTable/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DataTableDemo = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Advanced Data Table</h1>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Orders Management</CardTitle>
        </CardHeader>
        <CardContent>
          <TableProvider>
            <DataTable />
          </TableProvider>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-sm text-gray-500 space-y-2">
        <p className="font-medium">Table Features:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Select rows individually or use "Clear All" to deselect all.</li>
          <li>Drag columns to reorder them (except checkbox and first column).</li>
          <li>Resize columns by dragging the right edge of column headers.</li>
          <li>Sort the Amount column by clicking its header.</li>
          <li>Export selected or all data to Excel.</li>
          <li>Configure rows per page in the pagination controls.</li>
        </ul>
      </div>
    </div>
  );
};