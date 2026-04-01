<template>
  <header class="bg-white py-3 px-8 flex items-center justify-between border-b border-gray-100">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold italic overflow-hidden">
        <img src="https://picsum.photos/seed/guangdong-uav/100/100" alt="Logo" class="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-gray-800 tracking-tight">广东省低空飞行综合管理平台</h1>
        <p class="text-[10px] text-gray-400 uppercase tracking-widest">Guangdong Low-altitude Flight Management Platform</p>
      </div>
    </div>
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-4 text-sm font-medium text-gray-600">
        <a href="#" class="hover:text-blue-600 transition-colors">首页</a>
        <a href="#" class="hover:text-blue-600 transition-colors">政务公开</a>
        <a href="#" class="hover:text-blue-600 transition-colors">政策法规</a>
        <a href="#" class="hover:text-blue-600 transition-colors">办事指南</a>
      </div>
      <div class="h-4 w-px bg-gray-200"></div>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <Search :size="16" />
        </div>
        <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <Globe :size="16" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Search, Globe } from 'lucide-vue-next';
</script>
