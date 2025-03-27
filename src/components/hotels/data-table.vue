<script setup lang="ts" generic="TData extends { id: string }, TValue">
import { deleteDoc, doc } from 'firebase/firestore';

import { db } from '@/components/firebase';
import { useToast } from '@/components/ui/toast/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { h } from 'vue';

import type {
  ColumnDef,
  SortingState,
  ExpandedState,
  ColumnFiltersState,
} from '@tanstack/vue-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ref } from 'vue';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  getExpandedRowModel,
  getFilteredRowModel,
} from '@tanstack/vue-table';
import { valueUpdater } from '@/lib/utils';
import { useRouter } from 'vue-router';
const router = useRouter();

const goToAddHotel = () => {
  router.push('/admin/hotels/new');
};
const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}>();
const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getExpandedRowModel: getExpandedRowModel(),

  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  getFilteredRowModel: getFilteredRowModel(),
  onRowSelectionChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),

  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get expanded() {
      return expanded.value;
    },
  },
});
const { toast } = useToast();
const emit = defineEmits<{
  (e: 'deleted', ids: string[]): void;
}>();

const deleteSelectedHotels = async () => {
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedIds = selectedRows.map((row) => row.original.id);

  if (!selectedIds.length) {
    toast({
      title: 'Нічого не вибрано',
      description: 'Вибери готелі для видалення',
      variant: 'destructive',
      action: h(
        ToastAction,
        { altText: 'Добре' },
        { default: () => 'Закрити' }
      ),
    });
    return;
  }

  // const confirmed = window.confirm('Ти впевнений, що хочеш видалити вибрані готелі?');
  // if (!confirmed) return;

  try {
    await Promise.all(
      selectedIds.map((id) => deleteDoc(doc(db, 'hotels', id)))
    );

    toast({
      title: 'Успіх',
      description: 'Готелі видалено',
      variant: 'default',
    });

    table.resetRowSelection(); // ⬅️ очищаємо вибрані рядки
    emit('deleted', selectedIds);
  } catch (err) {
    toast({
      title: 'Помилка',
      description: 'Щось пішло не так',
      variant: 'destructive',
      action: h(
        ToastAction,
        { altText: 'Добре' },
        { default: () => 'Закрити' }
      ),
    });
  }
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between py-4">
      <Input
        class="max-w-sm"
        placeholder="Filter emails..."
        :model-value="table.getColumn('email')?.getFilterValue() as string"
        @update:model-value="table.getColumn('email')?.setFilterValue($event)"
      />
      <Button @click="deleteSelectedHotels">Delete selected hotels</Button>
      <Button @click="goToAddHotel">Add new hotel</Button>
    </div>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow
                :data-state="row.getIsSelected() ? 'selected' : undefined"
              >
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>
          <TableRow v-else>
            <TableCell :colspan="props.columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} of
        {{ table.getFilteredRowModel().rows.length }} row(s) selected.
      </div>
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanPreviousPage()"
        @click="table.previousPage()"
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="!table.getCanNextPage()"
        @click="table.nextPage()"
      >
        Next
      </Button>
    </div>
  </div>
</template>
