<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HOME_ROUTE } from '@/routerPath';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Check, ChevronsUpDown, GalleryVerticalEnd } from 'lucide-vue-next';

import { ref } from 'vue';

const props = defineProps<{
  versions: string[];
  defaultVersion: string;
}>();

const selectedVersion = ref(props.defaultVersion);
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <RouterLink :to="HOME_ROUTE">
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <GalleryVerticalEnd class="size-4" />
            </div>
            <div class="flex flex-col gap-0.5 leading-none">
              <span class="font-semibold">Home</span>
            </div>
          </SidebarMenuButton>
        </RouterLink>

        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width]"
          align="start"
        >
          <DropdownMenuItem
            v-for="version in versions"
            :key="version"
            @select="selectedVersion = version"
          >
            v{{ version }}
            <Check v-if="version === selectedVersion" class="ml-auto" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
