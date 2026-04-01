<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">飞行业务申报</h2>
        <p class="text-sm text-gray-500 mt-1">在线办理飞行计划申请、空域使用申请等业务</p>
      </div>
      <div class="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold flex items-center gap-2">
        <Clock :size="16" />
        模块建设中
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="item in placeholderItems" :key="item.title" class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm opacity-60 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
        <div class="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 mb-6">
          <component :is="item.icon" :size="24" />
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-2">{{ item.title }}</h3>
        <p class="text-sm text-gray-500">{{ item.desc }}</p>
      </div>
    </div>

    <div class="bg-blue-50 rounded-2xl p-12 text-center border border-blue-100">
      <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-sm">
        <FileText :size="40" />
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">业务申报模块即将上线</h3>
      <p class="text-gray-500 max-w-md mx-auto mb-8">
        我们正在加紧建设全省统一的飞行计划申报系统，届时您将可以直接在此提交各类低空飞行活动申请。
      </p>
      <div class="flex items-center justify-center gap-4">
        <span class="text-xs font-bold text-blue-600 bg-white px-4 py-2 rounded-full shadow-sm">预计上线时间: 2024年Q3</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, Clock, Map, Send, Shield } from 'lucide-vue-next';

const placeholderItems = [
  { title: '飞行计划申请', desc: '提交单次或长期飞行计划，获取空管部门批复', icon: Send },
  { title: '临时空域申请', desc: '申请划设临时飞行空域，保障特殊任务需求', icon: Map },
  { title: '飞行动态报备', desc: '实时报备飞行起降信息，确保飞行安全', icon: FileText },
  { title: '空域信息查询', desc: '查询全省空域划设情况及禁飞区限制', icon: Shield },
];
</script>
