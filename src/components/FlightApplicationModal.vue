<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
    >
      <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <h2 class="text-xl font-bold text-gray-800">飞行活动申请</h2>
          <p class="text-xs text-gray-500 mt-1">智能路由：系统将根据起飞地点自动匹配对应的飞行服务站</p>
        </div>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <X :size="20" class="text-gray-500" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-8">
        <div v-if="step === 'map'" class="space-y-6">
          <MapSelector @select="handleLocationSelect" />
          
          <div class="flex justify-end pt-4">
            <button 
              @click="handleNext"
              :disabled="!selectedLocation"
              class="px-12 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              下一步 <ChevronRight :size="18" />
            </button>
          </div>
        </div>

        <div v-if="step === 'form'" class="space-y-8">
          <div class="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
            <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg">
              <CheckCircle2 :size="20" />
            </div>
            <div>
              <p class="text-sm font-bold text-green-800">匹配成功：{{ selectedLocation?.fss.name }}</p>
              <p class="text-xs text-green-600">该区域属于省飞服直管，请在下方完成填报。已为您自动填充部分资质信息。</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">申报主体</label>
              <input type="text" disabled :value="userType === 'enterprise' ? preFilled?.enterpriseName : preFilled?.pilotName" class="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">关联设备 (SN)</label>
              <input type="text" disabled :value="userType === 'enterprise' ? 'B-0012, B-0015' : preFilled?.uavSn" class="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">任务名称</label>
              <input type="text" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="例如：电力巡检任务" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">飞行类型</label>
              <select class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none">
                <option>航拍作业</option>
                <option>基础设施巡检</option>
                <option>农林植保</option>
                <option>物流配送</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">起飞时间</label>
              <input type="datetime-local" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">预计时长 (分钟)</label>
              <input type="number" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="60" />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">飞行空域描述</label>
            <textarea class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none h-24" placeholder="请描述飞行范围、高度等信息..."></textarea>
          </div>

          <div class="flex gap-4">
            <button 
              @click="$emit('update:step', 'map')"
              class="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
            >
              重新选择地点
            </button>
            <button 
              @click="handleSubmit"
              class="flex-[2] py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-200"
            >
              提交申请
            </button>
          </div>
        </div>

        <div v-if="step === 'external'" class="text-center py-12 space-y-6">
          <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600">
            <ExternalLink :size="40" />
          </div>
          <div class="max-w-md mx-auto">
            <h3 class="text-xl font-bold text-gray-800 mb-2">即将跳转至外部系统</h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              您的起飞地属于 <strong>{{ selectedLocation?.fss.name }}</strong> 管理区域。
              根据规定，该区域的飞行申请需在对应市级飞服站系统进行填报。
            </p>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 text-left max-w-md mx-auto">
            <p class="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">目标系统</p>
            <p class="text-sm font-medium text-gray-700">{{ selectedLocation?.fss.name }} 综合管理平台</p>
          </div>

          <div class="flex gap-4 max-w-md mx-auto">
            <button 
              @click="$emit('update:step', 'map')"
              class="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
            >
              返回
            </button>
            <button 
              @click="handleExternalJump"
              :disabled="isSyncing"
              class="flex-[2] py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
            >
              <Loader2 v-if="isSyncing" class="animate-spin" :size="18" />
              <template v-else>前往填报 <ChevronRight :size="18" /></template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, MapPin, CheckCircle2, ExternalLink, ChevronRight, Loader2 } from 'lucide-vue-next';
import MapSelector from './shared/MapSelector.vue';
import { LocationSelection } from '../types';
import { getPreFilledData, syncExternalStatus } from '../services/flightTools';
import { ref, onMounted } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  step: 'map' | 'form' | 'external';
  selectedLocation: LocationSelection | null;
  userType: 'individual' | 'enterprise';
}>();

const emit = defineEmits(['close', 'update:step', 'update:selectedLocation']);

const preFilled = ref<any>(null);
const isSyncing = ref(false);

onMounted(() => {
  preFilled.value = getPreFilledData(props.userType);
});

const handleLocationSelect = (selection: LocationSelection) => {
  emit('update:selectedLocation', selection);
};

const handleNext = () => {
  if (!props.selectedLocation) return;
  
  if (props.selectedLocation.fss.type === 'provincial') {
    emit('update:step', 'form');
  } else {
    emit('update:step', 'external');
  }
};

const handleExternalJump = async () => {
  isSyncing.value = true;
  // 模拟跳转并同步
  await syncExternalStatus('APP-2024-001');
  isSyncing.value = false;
  alert('已完成外部系统对接，进度已同步至省门户。');
  emit('close');
  emit('update:step', 'map');
};

const handleSubmit = () => {
  alert('飞行申请已提交，请在进度中心查看审批状态。');
  emit('close');
  emit('update:step', 'map');
};
</script>
