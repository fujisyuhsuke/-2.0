<template>
  <div class="bg-white py-6 px-8 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
    <!-- Announcements -->
    <div>
      <div class="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          通知公告 <span class="text-gray-300 font-normal text-sm">/ Announcement</span>
        </h2>
        <a href="#" class="text-gray-400 text-sm hover:text-orange-500 flex items-center">更多 <ChevronRight :size="14" /></a>
      </div>
      <div class="space-y-6">
        <div v-for="(item, i) in announcements" :key="i" class="flex gap-6 group cursor-pointer">
          <div class="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 w-16 h-16 rounded group-hover:bg-orange-50 group-hover:border-orange-200 transition-colors">
            <span class="text-2xl font-bold text-gray-700 group-hover:text-orange-600">{{ item.date }}</span>
            <span class="text-[10px] text-gray-400">{{ item.year }}</span>
          </div>
          <div class="flex-1">
            <h3 class="text-gray-800 font-medium group-hover:text-orange-600 transition-colors line-clamp-1">{{ item.title }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Regulations -->
    <div>
      <div class="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          政策法规 <span class="text-gray-300 font-normal text-sm">/ Regulation</span>
        </h2>
        <a href="#" class="text-gray-400 text-sm hover:text-orange-500 flex items-center">更多 <ChevronRight :size="14" /></a>
      </div>
      <ul class="space-y-4">
        <li v-for="(item, i) in regulations" :key="i" class="flex items-center justify-between group cursor-pointer">
          <div class="flex items-center gap-3">
            <div class="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-orange-500 transition-colors"></div>
            <span class="text-gray-600 group-hover:text-orange-600 transition-colors text-sm">{{ item }}</span>
          </div>
          <span class="text-gray-400 text-xs">2025-10-31</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';

const announcements = [
  { date: '11', year: '2025.12', title: '无人机“谁能飞”“谁在飞”，强制性国家标准发布', desc: '强制性国家标准' },
  { date: '26', year: '2025.08', title: '转发天津市人民政府通告', desc: '临时禁飞管控' },
  { date: '03', year: '2025.08', title: '转发北京市人民政府关于公布无人驾驶航空器管制空域范围的通告', desc: '管制空域范围' }
];

const regulations = [
  '民用无人驾驶航空器实名登记和激活要求',
  '民用无人驾驶航空器系统运行识别规范',
  '中国民用航空局关于印发《民用无人驾驶航空器事件信息管理办法》...',
  '民用无人驾驶航空器操控员执照考试委任代表管理办法',
  '民用无人驾驶航空器操控员执照考试点管理办法',
  '民用无人驾驶航空器操控员执照管理办法',
  '民用无人驾驶航空器运行安全管理规则'
];
</script>
