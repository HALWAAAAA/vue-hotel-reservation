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
import { USER_HOME_ROUTE, HOTEL_REQUESTS_ROUTE } from '@/routerPath';
import { RouterLink } from 'vue-router';
const props = defineProps<SidebarProps>();

const data = {
  versions: ['12.'],
  navMain: [
    {
      title: 'Main page',
      url: '#',
      items: [
        {
          title: 'User Page',
          url: USER_HOME_ROUTE,
        },
        {
          title: 'Requests',
          url: HOTEL_REQUESTS_ROUTE,
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
                <RouterLink :to="childItem.url" class="w-full block">
                  {{ childItem.title }}
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
</template>
