<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <MapPin :size="18" class="text-blue-600" />
        <span class="text-sm font-medium text-gray-700">起飞地点选择</span>
      </div>
      <div v-if="selectedFSS" class="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
        <component :is="selectedFSS.type === 'city' ? 'Building2' : 'Globe'" :size="12" />
        {{ selectedFSS.name }}
      </div>
    </div>

    <!-- Mock Map Area -->
    <div 
      class="relative aspect-video bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden group cursor-crosshair"
      @click="handleMapClick"
    >
      <div class="absolute inset-0 bg-[url('https://picsum.photos/seed/guangdong-map/1200/800')] opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
      
      <!-- Mock Markers for Cities -->
      <div 
        v-for="city in mockCities" 
        :key="city.name"
        class="absolute w-2 h-2 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2"
        :style="{ left: city.x + '%', top: city.y + '%' }"
      >
        <div class="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-500 whitespace-nowrap">
          {{ city.name }}
        </div>
      </div>

      <!-- Selected Marker -->
      <div 
        v-if="markerPos" 
        class="absolute -translate-x-1/2 -translate-y-full transition-all duration-300 z-20"
        :style="{ left: markerPos.x + '%', top: markerPos.y + '%' }"
      >
        <div class="relative">
          <MapPin :size="32" class="text-red-600 drop-shadow-lg animate-bounce" />
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[1px]"></div>
        </div>
      </div>

      <!-- Map Overlay Text -->
      <div v-if="!markerPos" class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white shadow-xl text-center">
          <p class="text-sm font-bold text-gray-800">点击地图选择起飞点</p>
          <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">Click to select location</p>
        </div>
      </div>
    </div>

    <!-- Location Details Card -->
    <div v-if="markerPos" class="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2">
      <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
        <p class="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">经纬度坐标</p>
        <p class="text-sm font-mono text-gray-700">{{ currentCoord.lng.toFixed(4) }}, {{ currentCoord.lat.toFixed(4) }}</p>
      </div>
      <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
        <p class="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">所属飞服站</p>
        <p class="text-sm font-bold" :class="selectedFSS?.type === 'city' ? 'text-orange-600' : 'text-blue-600'">
          {{ selectedFSS?.name }}
        </p>
      </div>
    </div>

    <!-- FSS Description Alert -->
    <div v-if="selectedFSS" class="p-4 rounded-xl border flex gap-3 items-start" :class="selectedFSS.type === 'city' ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'">
      <Info :size="18" :class="selectedFSS.type === 'city' ? 'text-orange-600' : 'text-blue-600'" class="mt-0.5" />
      <div>
        <p class="text-sm font-bold" :class="selectedFSS.type === 'city' ? 'text-orange-800' : 'text-blue-800'">
          {{ selectedFSS.type === 'city' ? '市级飞服站管辖' : '省级飞服站直管' }}
        </p>
        <p class="text-xs mt-1" :class="selectedFSS.type === 'city' ? 'text-orange-600' : 'text-blue-600'">
          {{ selectedFSS.description }}。{{ selectedFSS.type === 'city' ? '提交申请后将自动路由至该站系统。' : '您可以在本系统内直接完成申报。' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MapPin, Globe, Building2, Info } from 'lucide-vue-next';
import { Coordinate, FSSInfo } from '../../types';
import { judgeFSS } from '../../services/flightTools';

const emit = defineEmits(['select']);

const markerPos = ref<{ x: number, y: number } | null>(null);
const currentCoord = ref<Coordinate>({ lat: 0, lng: 0 });
const selectedFSS = ref<FSSInfo | null>(null);

// 模拟广东主要城市在 Mock 地图上的百分比位置
const mockCities = [
  { name: '广州', x: 45, y: 40, lng: 113.26, lat: 23.13 },
  { name: '深圳', x: 65, y: 65, lng: 114.05, lat: 22.54 },
  { name: '珠海', x: 48, y: 75, lng: 113.57, lat: 22.27 },
  { name: '清远', x: 40, y: 25, lng: 113.05, lat: 23.68 },
  { name: '汕头', x: 90, y: 55, lng: 116.68, lat: 23.35 },
];

const handleMapClick = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  
  markerPos.value = { x, y };
  
  // 模拟将百分比坐标转换为经纬度 (仅用于演示)
  // 广东经纬度范围大致为: 109E-118E, 20N-26N
  const lng = 109 + (x / 100) * 9;
  const lat = 26 - (y / 100) * 6;
  
  currentCoord.value = { lat, lng };
  selectedFSS.value = judgeFSS(currentCoord.value);
  
  emit('select', {
    coordinate: currentCoord.value,
    address: `广东省模拟地址 (x:${x.toFixed(0)}, y:${y.toFixed(0)})`,
    fss: selectedFSS.value
  });
};
</script>
