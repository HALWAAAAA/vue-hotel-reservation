<template>
  <LMap
    :zoom="15"
    :center="[lat, lng]"
    style="height: 400px; width: 100%; border-radius: 12px; overflow: hidden"
  >
    <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <LMarker :lat-lng="[lat, lng]">
      <LPopup>{{ name }}</LPopup>
    </LMarker>
  </LMap>
</template>

<script setup>
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    'leaflet/dist/images/marker-icon-2x.png',
    import.meta.url
  ).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url)
    .href,
});

defineProps({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    default: '',
  },
});
</script>
