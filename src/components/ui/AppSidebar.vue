<script setup lang="ts">
import SearchForm from '@/components/ui/SearchForm.vue';
import VersionSwitcher from '@/components/ui/VersionSwitcher.vue';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  type SidebarProps,
  SidebarRail,
} from '@/components/ui/sidebar';

const props = defineProps<SidebarProps>();

// This is sample data.
const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Main page',
      url: '#',
      items: [
        {
          title: 'Hotels',
          url: '#',
        },
        {
          title: 'Requests',
          url: '#',
        },
      ],
    },
  ],
};
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <VersionSwitcher
        :versions="data.versions"
        :default-version="data.versions[0]"
      />
      <SearchForm />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup v-for="item in data.navMain" :key="item.title">
        <SidebarGroupLabel>{{ item.title }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="childItem in item.items"
              :key="childItem.title"
            >
              <SidebarMenuButton>
                <a :href="childItem.url">{{ childItem.title }}</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
</template>
