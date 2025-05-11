import { TableData } from '../types/table';

// Generate random avatars from UI Avatars
const getAvatar = (name: string) => 
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=32`;

export const generateMockData = (): TableData[] => {
  const statuses = ['Pending', 'Processing', 'Completed', 'Rejected'];
  const companies = ['Acme Inc', 'Globex', 'Initech', 'Umbrella Corp', 'Stark Industries', 'Wayne Enterprises'];
  
  return Array.from({ length: 50 }, (_, i) => {
    const name = `${companies[Math.floor(Math.random() * companies.length)]}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = Math.floor(Math.random() * 10000) / 100;
    
    return {
      id: `row-${i + 1}`,
      avatar: getAvatar(name),
      name,
      description: `Order #${1000 + i} - ${status}`,
      amount,
      tooltip: `Last updated: ${new Date().toLocaleDateString()}`,
      source: ['Email', 'Web', 'App', 'Phone'][Math.floor(Math.random() * 4)]
    };
  });
};

// Default columns configuration
export const defaultColumns = [
  {
    id: 'select',
    header: '',
    accessorKey: 'id' as const,
    isSticky: true,
    enableResizing: false,
    enableDragging: false,
    meta: {
      isCheckbox: true
    }
  },
  {
    id: 'avatar',
    header: '',
    accessorKey: 'avatar' as const,
    isSticky: true,
    enableResizing: false,
    enableDragging: false,
  },
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name' as const,
    isSticky: true,
    enableResizing: true,
    enableDragging: true,
  },
  {
    id: 'description',
    header: 'Description',
    accessorKey: 'description' as const,
    enableResizing: true,
    enableDragging: true,
  },
  {
    id: 'amount',
    header: 'Amount',
    accessorKey: 'amount' as const,
    isSortable: true,
    enableResizing: true,
    enableDragging: true,
  },
  {
    id: 'source',
    header: 'Source',
    accessorKey: 'source' as const,
    enableResizing: true,
    enableDragging: true,
  },
  {
    id: 'tooltip',
    header: 'Info',
    accessorKey: 'tooltip' as const,
    enableResizing: true,
    enableDragging: true,
  },
];