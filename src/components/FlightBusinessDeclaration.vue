<template>
  <div class="space-y-10">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">飞行业务申报</h2>
        <p class="text-sm text-gray-500 mt-1">在线办理飞行计划申请、空域使用申请及动态报备业务</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold flex items-center gap-2 border border-blue-100">
          <ShieldCheck :size="16" />
          {{ userType === 'enterprise' ? '企业级权限' : '个人级权限' }}
        </div>
      </div>
    </div>

    <!-- UAV Section -->
    <section>
      <div class="flex items-center gap-2 mb-6">
        <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
        <h3 class="text-lg font-bold text-gray-800">无人机业务申报</h3>
        <span class="text-xs text-gray-400 font-normal ml-2">UAV Business Declaration</span>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="item in uavItems" 
          :key="item.id"
          @click="handleAction(item)"
          class="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
        >
          <!-- Background Decoration -->
          <div class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <component :is="item.icon" :size="120" />
          </div>

          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all group-hover:scale-110', item.colorClass]">
            <component :is="item.icon" :size="24" />
          </div>
          
          <div class="relative z-10">
            <h4 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{{ item.title }}</h4>
            <p class="text-xs text-gray-500 leading-relaxed">{{ item.desc }}</p>
          </div>

          <div class="mt-6 flex items-center text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
            立即办理 <ArrowRight :size="14" class="ml-1" />
          </div>
        </div>
      </div>
    </section>

    <!-- GA Section -->
    <section>
      <div class="flex items-center gap-2 mb-6">
        <div class="w-1 h-5 bg-indigo-600 rounded-full"></div>
        <h3 class="text-lg font-bold text-gray-800">通航业务申报</h3>
        <span class="text-xs text-gray-400 font-normal ml-2">GA Business Declaration</span>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <!-- Permission Overlay for Individuals -->
        <div v-if="userType === 'individual'" class="absolute inset-0 z-20 bg-gray-50/40 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
          <div class="bg-white p-4 rounded-full shadow-lg mb-4">
            <Lock :size="32" class="text-gray-400" />
          </div>
          <p class="text-sm font-bold text-gray-600">仅对已完成资质认证的通航企业开放</p>
          <button class="mt-4 text-xs text-blue-600 font-bold hover:underline">前往企业资质认证</button>
        </div>

        <div 
          v-for="item in gaItems" 
          :key="item.id"
          @click="handleAction(item)"
          :class="['group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all relative overflow-hidden', 
            userType === 'enterprise' ? 'hover:shadow-xl hover:border-indigo-200 cursor-pointer' : 'opacity-50 grayscale cursor-not-allowed']"
        >
          <div class="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <component :is="item.icon" :size="120" />
          </div>

          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all group-hover:scale-110', item.colorClass]">
            <component :is="item.icon" :size="24" />
          </div>
          
          <div class="relative z-10">
            <h4 class="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">{{ item.title }}</h4>
            <p class="text-xs text-gray-500 leading-relaxed">{{ item.desc }}</p>
          </div>

          <div v-if="userType === 'enterprise'" class="mt-6 flex items-center text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
            立即办理 <ArrowRight :size="14" class="ml-1" />
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom Tip -->
    <div class="bg-gray-100 rounded-2xl p-6 flex items-start gap-4">
      <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 shrink-0">
        <Info :size="20" />
      </div>
      <div>
        <h5 class="text-sm font-bold text-gray-800 mb-1">申报须知</h5>
        <p class="text-xs text-gray-500 leading-relaxed">
          所有飞行活动均需提前申报，并根据所属飞服站（省飞服/广深珠）的要求完成起飞确认。
          系统将根据您填写的起飞坐标自动判断所属飞服站并进行业务分发。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Send, Navigation, CheckCircle, Map, Wind, ClipboardCheck, 
  ArrowRight, ShieldCheck, Lock, Info 
} from 'lucide-vue-next';

defineProps<{
  userType: 'individual' | 'enterprise';
}>();

const uavItems = [
  { 
    id: 'uav-apply', 
    title: '飞行活动申请', 
    desc: '提交一般、紧急或长期飞行活动申请，获取空域批复。', 
    icon: Send,
    colorClass: 'bg-blue-50 text-blue-600'
  },
  { 
    id: 'uav-takeoff', 
    title: '起飞确认', 
    desc: '关联已获批计划，在起飞前进行设备自检及环境确认。', 
    icon: Navigation,
    colorClass: 'bg-cyan-50 text-cyan-600'
  },
  { 
    id: 'uav-landing', 
    title: '降落报告', 
    desc: '飞行结束后提交降落时间及任务完成情况报告。', 
    icon: CheckCircle,
    colorClass: 'bg-emerald-50 text-emerald-600'
  },
];

const gaItems = [
  { 
    id: 'ga-airspace', 
    title: '通航空域申请', 
    desc: '申请划设通航专用空域，支持多飞服站同步审批。', 
    icon: Map,
    colorClass: 'bg-indigo-50 text-indigo-600'
  },
  { 
    id: 'ga-apply', 
    title: '通航飞行活动申请', 
    desc: '提交通航飞行活动申请，关联已获批空域及航线。', 
    icon: Wind,
    colorClass: 'bg-violet-50 text-violet-600'
  },
];

const emit = defineEmits(['request-uav-apply']);

const handleAction = (item: any) => {
  if (item.id === 'uav-apply') {
    emit('request-uav-apply');
  } else {
    console.log('Action triggered:', item.id);
  }
};
</script>
