<template>
  <div class="flex flex-col h-[calc(100vh-180px)] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- Top Header -->
    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
      <div class="flex items-center gap-4">
        <button 
          @click="$emit('back')" 
          class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          title="返回业务大厅"
        >
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h2 class="text-lg font-bold text-gray-800">无人机飞行活动申请</h2>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-bold uppercase">第一步：起飞点选址</span>
            <span class="text-[10px] text-gray-400">Step 1: Location Selection</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1 text-xs text-gray-500">
          <Clock :size="14" />
          <span>预计办理时间：5-10分钟</span>
        </div>
      </div>
    </div>

    <!-- Main Content: Left Map, Right Info -->
    <div class="flex-1 flex overflow-hidden relative">
      <!-- Left: Interactive Schematic Map (3/4) -->
      <div class="w-3/4 h-full relative bg-slate-50 flex flex-col items-center justify-center p-12 overflow-hidden">
        <div class="absolute top-8 left-8 z-10">
          <div class="bg-white/90 backdrop-blur shadow-sm rounded-2xl p-5 border border-slate-200 max-w-xs">
            <h4 class="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <MapPin :size="16" class="text-blue-600" />
              交互式选址示意图
            </h4>
            <p class="text-[11px] text-slate-500 leading-relaxed">
              请点击下方颜色区域选择起飞点所属辖区。系统将根据您的点击位置自动判定所属飞服站并路由业务。
            </p>
          </div>
        </div>

        <!-- Schematic SVG Map -->
        <div class="w-full h-full max-w-4xl max-h-[600px] relative">
          <svg viewBox="0 0 800 500" class="w-full h-full drop-shadow-2xl filter transition-all duration-500">
            <!-- Main Guangdong Background (Provincial Direct) -->
            <path 
              d="M150,350 L100,300 L120,200 L250,100 L450,80 L650,120 L750,250 L700,350 L600,400 L450,420 L300,450 L150,350 Z" 
              @click="selectFSSByZone('provincial')"
              :class="['transition-all duration-300 cursor-pointer stroke-white stroke-2', 
                selectedLocation?.fss.id === 'fss-gd' ? 'fill-slate-400' : 'fill-slate-200 hover:fill-slate-300']"
            />
            
            <!-- Guangzhou Zone (Blue) -->
            <path 
              d="M380,220 L440,220 L440,300 L380,300 Z" 
              @click.stop="selectFSSByZone('guangzhou')"
              :class="['transition-all duration-300 cursor-pointer stroke-white stroke-2', 
                selectedLocation?.fss.id === 'fss-gz' ? 'fill-blue-600' : 'fill-blue-500/40 hover:fill-blue-500/60']"
            />
            <text x="410" y="265" class="pointer-events-none text-[12px] font-bold fill-blue-900/40 text-center" text-anchor="middle">广州</text>

            <!-- Shenzhen Zone (Purple) -->
            <path 
              d="M450,310 L510,310 L510,360 L450,360 Z" 
              @click.stop="selectFSSByZone('shenzhen')"
              :class="['transition-all duration-300 cursor-pointer stroke-white stroke-2', 
                selectedLocation?.fss.id === 'fss-sz' ? 'fill-purple-600' : 'fill-purple-500/40 hover:fill-purple-500/60']"
            />
            <text x="480" y="340" class="pointer-events-none text-[12px] font-bold fill-purple-900/40 text-center" text-anchor="middle">深圳</text>

            <!-- Zhuhai Zone (Teal) -->
            <path 
              d="M390,340 L440,340 L440,390 L390,390 Z" 
              @click.stop="selectFSSByZone('zhuhai')"
              :class="['transition-all duration-300 cursor-pointer stroke-white stroke-2', 
                selectedLocation?.fss.id === 'fss-zh' ? 'fill-teal-600' : 'fill-teal-500/40 hover:fill-teal-500/60']"
            />
            <text x="415" y="370" class="pointer-events-none text-[12px] font-bold fill-teal-900/40 text-center" text-anchor="middle">珠海</text>

            <!-- Selection Indicator (Pin) -->
            <g v-if="selectedLocation" :transform="`translate(${pinPos.x}, ${pinPos.y})`" class="pointer-events-none transition-all duration-500">
              <circle r="8" fill="white" class="animate-ping opacity-75" />
              <circle r="4" fill="#ef4444" />
              <path d="M0,0 L-8,-20 A8,8 0 1,1 8,-20 Z" fill="#ef4444" transform="translate(0, 5)" />
            </g>
          </svg>
        </div>

        <!-- Legend Overlay -->
        <div class="absolute bottom-8 left-8 z-10 bg-white/90 backdrop-blur p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h4 class="text-xs font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ShieldAlert :size="14" class="text-blue-600" />
            辖区图例说明
          </h4>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 bg-blue-500/40 border border-blue-500 rounded"></div>
              <span class="text-[11px] text-slate-600 font-medium">广州市飞服站管辖区</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 bg-purple-500/40 border border-purple-500 rounded"></div>
              <span class="text-[11px] text-slate-600 font-medium">深圳市飞服站管辖区</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 bg-teal-500/40 border border-teal-500 rounded"></div>
              <span class="text-[11px] text-slate-600 font-medium">珠海市飞服站管辖区</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 bg-slate-200 border border-slate-300 rounded"></div>
              <span class="text-[11px] text-slate-600 font-medium">广东省飞服站直管区</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Info & Operations (1/4) -->
      <div class="w-1/4 h-full flex flex-col bg-white overflow-y-auto scrollbar-thin">
        <div class="p-6 space-y-8">
          <!-- Selection Status -->
          <section>
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">选址状态</h3>
            <div v-if="!selectedLocation" class="p-8 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-center">
              <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-3">
                <MapPin :size="24" />
              </div>
              <p class="text-xs text-gray-400 leading-relaxed mb-4">请点击左侧示意图区域<br/>选择您的起飞位置</p>
            </div>
            
            <div v-else class="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div class="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div class="flex items-center gap-2 mb-2">
                  <MapPin :size="14" class="text-blue-600" />
                  <span class="text-xs font-bold text-blue-800">已选起飞点</span>
                </div>
                <p class="text-sm font-medium text-gray-800 leading-relaxed">{{ selectedLocation.address }}</p>
                <div class="mt-3 pt-3 border-t border-blue-100 flex justify-between items-center">
                  <span class="text-[10px] text-blue-600 font-mono">{{ selectedLocation.coordinate.lng.toFixed(6) }}, {{ selectedLocation.coordinate.lat.toFixed(6) }}</span>
                  <button @click="clearSelection" class="text-[10px] text-gray-400 hover:text-red-500 font-bold uppercase transition-colors">清除</button>
                </div>
              </div>

              <div :class="['p-4 rounded-2xl border transition-all', selectedLocation.fss.type === 'city' ? 'bg-orange-50 border-orange-100' : 'bg-emerald-50 border-emerald-100']">
                <div class="flex items-center gap-2 mb-2">
                  <component :is="selectedLocation.fss.type === 'city' ? 'Building2' : 'Globe'" :size="14" :class="selectedLocation.fss.type === 'city' ? 'text-orange-600' : 'text-emerald-600'" />
                  <span class="text-xs font-bold" :class="selectedLocation.fss.type === 'city' ? 'text-orange-800' : 'text-emerald-800'">
                    所属：{{ selectedLocation.fss.name }}
                  </span>
                </div>
                <p class="text-[11px] leading-relaxed" :class="selectedLocation.fss.type === 'city' ? 'text-orange-600' : 'text-emerald-600'">
                  {{ selectedLocation.fss.description }}。
                  {{ selectedLocation.fss.type === 'city' ? '该区域业务将自动路由至市级飞服系统办理。' : '该区域由省中心直管，可直接在本平台填报。' }}
                </p>
              </div>
            </div>
          </section>

          <!-- Pre-filled Identity -->
          <section>
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">申报主体信息</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span class="text-xs text-gray-500">申报人/单位</span>
                <span class="text-xs font-bold text-gray-800">{{ preFilledData.name }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span class="text-xs text-gray-500">证件/代码</span>
                <span class="text-xs font-mono text-gray-800">{{ preFilledData.id }}</span>
              </div>
              <div class="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 flex items-center gap-2">
                <ShieldCheck :size="14" class="text-blue-600" />
                <span class="text-[10px] text-blue-700 font-medium">资质信息已通过实名核验，自动同步</span>
              </div>
            </div>
          </section>

          <!-- Action Button -->
          <div class="pt-4">
            <button 
              @click="handleNext"
              :disabled="!selectedLocation"
              :class="['w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg', 
                selectedLocation ? 'bg-blue-700 text-white hover:bg-blue-800 shadow-blue-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none']"
            >
              <span>{{ selectedLocation?.fss.type === 'city' ? '跳转至市级系统办理' : '进入下一步填报' }}</span>
              <ArrowRight :size="18" />
            </button>
            <p class="text-[10px] text-gray-400 text-center mt-4 leading-relaxed">
              点击下一步即表示您已确认起飞点位置准确，<br/>系统将根据该位置为您匹配对应的审批流程。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { 
  ArrowLeft, MapPin, Globe, Building2, ArrowRight, 
  ShieldCheck, Clock, ShieldAlert 
} from 'lucide-vue-next';
import { LocationSelection } from '../types';
import { judgeFSS, getPreFilledData } from '../services/flightTools';

const props = defineProps<{
  userType: 'individual' | 'enterprise'
}>();

const emit = defineEmits(['back', 'next']);

const selectedLocation = ref<LocationSelection | null>(null);
const preFilledDataRaw = getPreFilledData(props.userType);

const pinPos = reactive({ x: 0, y: 0 });

const preFilledData = computed(() => {
  if (props.userType === 'individual') {
    return {
      name: (preFilledDataRaw as any).pilotName,
      id: (preFilledDataRaw as any).idCard
    };
  }
  return {
    name: (preFilledDataRaw as any).enterpriseName,
    id: (preFilledDataRaw as any).orgCode
  };
});

const selectFSSByZone = (zone: 'guangzhou' | 'shenzhen' | 'zhuhai' | 'provincial') => {
  let lng = 113.26, lat = 23.13;
  let x = 410, y = 260;

  switch (zone) {
    case 'guangzhou':
      lng = 113.26; lat = 23.13; x = 410; y = 260;
      break;
    case 'shenzhen':
      lng = 114.05; lat = 22.54; x = 480; y = 335;
      break;
    case 'zhuhai':
      lng = 113.57; lat = 22.27; x = 415; y = 365;
      break;
    case 'provincial':
      lng = 113.00; lat = 23.00; x = 300; y = 200;
      break;
  }

  const coord = { lng, lat };
  const fss = judgeFSS(coord);
  
  pinPos.x = x;
  pinPos.y = y;

  selectedLocation.value = {
    coordinate: coord,
    address: zone === 'provincial' ? '广东省直管区域 (示意位置)' : `${fss.name}管辖区域 (示意位置)`,
    fss
  };
};

const handleNext = () => {
  if (selectedLocation.value) {
    emit('next', selectedLocation.value);
  }
};
</script>

<style scoped>
#amap-container :deep(.amap-logo),
#amap-container :deep(.amap-copyright) {
  display: none !important;
}
</style>
