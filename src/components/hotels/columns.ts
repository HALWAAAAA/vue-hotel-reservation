import type { ColumnDef, Row } from '@tanstack/vue-table';
import type { Hotel } from './hotel';
import DropdownAction from './DataTableDropDown.vue';
import { h } from 'vue';
import { Checkbox } from '@/components/ui/checkbox';

import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-vue-next';

export const columns: ColumnDef<Hotel>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        modelValue: table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          row.toggleSelected(!!value),
        ariaLabel: 'Select row',
      }),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'name',
    header: 'Hotel',
  },
  {
    accessorKey: 'area',
    header: 'Area',
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Email', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      );
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email')),
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }: { row: Row<Hotel> }) => {
      const hotel = row.original;

      return h(
        'div',
        { class: 'relative' },
        h(DropdownAction, {
          hotel,
          onExpand: row.toggleExpanded,
        })
      );
    },
  },
];
