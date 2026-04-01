<template>
  <div class="relative">
    <!-- Modal -->
    <div v-if="modal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div class="p-6 border-b border-gray-50 flex items-center gap-3">
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', modal.type === 'confirm' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600']">
            <AlertCircle v-if="modal.type === 'confirm'" :size="20" />
            <ShieldCheck v-else :size="20" />
          </div>
          <h3 class="text-lg font-bold text-gray-800">{{ modal.title }}</h3>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-600 leading-relaxed">{{ modal.message }}</p>
        </div>
        <div class="p-6 bg-gray-50 flex justify-end gap-3">
          <button 
            v-if="modal.type === 'confirm'"
            @click="modal.show = false"
            class="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
          >
            取消
          </button>
          <button 
            @click="handleModalAction"
            :class="['px-6 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-all', modal.type === 'confirm' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-100' : 'bg-blue-700 hover:bg-blue-800 shadow-blue-100']"
          >
            {{ modal.type === 'confirm' ? '确认注销' : '确定' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Views -->
    <div v-if="view === 'categories'" class="space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">资质认证</h2>
          <p class="text-sm text-gray-500 mt-1">请选择对应的认证类别进行实名登记与备案申请</p>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
          <ShieldCheck :size="16" />
          全省联网校验已开启
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="cat in displayCategories" 
          :key="cat.id"
          @click="onViewChange('instances', cat.title)"
          class="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
        >
          <div class="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <component :is="getIcon(cat.icon)" :size="28" />
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ cat.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed mb-6">{{ cat.desc }}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                已备案: {{ getCategoryCount(cat.title) }}
              </span>
              <div class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ChevronRight :size="18" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="view === 'instances'" class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="onViewChange('categories')" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft :size="20" class="text-gray-500" />
          </button>
          <div>
            <h2 class="text-2xl font-bold text-gray-800">{{ selectedCategory }} - 备案列表</h2>
            <p class="text-sm text-gray-500">管理您已提交的备案申请与认证信息</p>
          </div>
        </div>
        <button 
          v-if="!isCurrentCategorySingleInstance"
          @click="onViewChange('form', selectedCategory)"
          class="px-6 py-2.5 bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all flex items-center gap-2"
        >
          <Plus :size="18" />
          新增备案申请
        </button>
      </div>

      <div v-if="filteredInstances.length === 0" class="bg-white rounded-xl border border-gray-100 p-20 text-center">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
          <ShieldCheck :size="40" />
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-2">暂无备案记录</h3>
        <p class="text-sm text-gray-500 mb-8">您尚未在 [{{ selectedCategory }}] 类别下提交过任何备案申请</p>
        <button 
          @click="onViewChange('form', selectedCategory)"
          class="px-8 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all"
        >
          立即申请备案
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="instance in filteredInstances" 
          :key="instance.id"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group"
        >
          <div class="p-6 border-b border-gray-50 flex justify-between items-start">
            <div class="flex items-center gap-3">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', instance.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600']">
                <ShieldCheck v-if="instance.status === 'approved'" :size="20" />
                <Clock v-else :size="20" />
              </div>
              <div>
                <h4 class="font-bold text-gray-800">{{ getInstanceTitle(instance) }}</h4>
                <p class="text-[10px] text-gray-400 font-mono uppercase tracking-wider">{{ instance.id }}</p>
              </div>
            </div>
            <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full', instance.status === 'approved' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50']">
              {{ instance.status === 'approved' ? '已生效' : '同步中' }}
            </span>
          </div>
          <div class="p-6 bg-gray-50/50 space-y-3">
            <div v-for="([key, val], index) in Object.entries(instance.data).slice(0, 3)" :key="index" class="flex justify-between text-xs">
              <span class="text-gray-400">{{ getFieldLabel(key) }}</span>
              <span class="text-gray-700 font-medium">{{ val }}</span>
            </div>
          </div>
          <div class="p-4 bg-white flex gap-2">
            <button 
              @click="onViewChange('detail', selectedCategory, instance.id)"
              class="flex-1 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              查看详情
            </button>
            <button 
              @click="onViewChange('form', selectedCategory, instance.id)"
              class="flex-1 py-2 text-xs font-bold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              变更申请
            </button>
            <button 
              @click="confirmDelete(instance.id)"
              class="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="view === 'detail' && currentInstance" class="space-y-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button 
            @click="isCurrentCategorySingleInstance ? onViewChange('categories') : onViewChange('instances', selectedCategory)" 
            class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft :size="20" class="text-gray-500" />
          </button>
          <div>
            <h2 class="text-2xl font-bold text-gray-800">备案详情</h2>
            <p class="text-sm text-gray-500">全省联网同步状态及备案详细信息</p>
          </div>
        </div>
        <div class="flex gap-3">
          <button 
            @click="onViewChange('form', selectedCategory, currentInstance.id)"
            class="px-6 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <Edit3 :size="18" />
            变更申请
          </button>
          <button class="px-6 py-2.5 bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all flex items-center gap-2">
            <Download :size="18" />
            下载电子证明
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <!-- Info Card -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
              <h3 class="font-bold text-gray-800">备案核心信息</h3>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span class="text-[10px] font-bold text-green-600 uppercase tracking-wider">数据同源校验已通过</span>
              </div>
            </div>
            <div class="p-8 grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-12">
              <div v-for="(val, key) in currentInstance.data" :key="key">
                <p class="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">{{ getFieldLabel(key) }}</p>
                <p class="text-sm font-medium text-gray-700">{{ val }}</p>
              </div>
            </div>
          </div>

          <!-- Sync Status Section -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
              <h3 class="font-bold text-gray-800">全省系统同步状态</h3>
              <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full', currentInstance.status === 'approved' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50']">
                {{ currentInstance.status === 'approved' ? '数据已实时同步' : '正在同步/审核中' }}
              </span>
            </div>
            <div class="p-6">
              <div class="space-y-6">
                <div class="flex items-center gap-4">
                  <div :class="['w-10 h-10 rounded-full flex items-center justify-center', currentInstance.status === 'approved' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600']">
                    <Home :size="20" />
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between mb-1">
                      <span class="text-sm font-bold text-gray-700">省低空数据融合中心</span>
                      <span :class="['text-xs font-medium', currentInstance.status === 'approved' ? 'text-green-600' : 'text-orange-600']">
                        {{ currentInstance.status === 'approved' ? '已同步' : '同步中' }}
                      </span>
                    </div>
                    <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        class="h-full transition-all duration-1000"
                        :style="{ width: currentInstance.status === 'approved' ? '100%' : '65%' }"
                        :class="currentInstance.status === 'approved' ? 'bg-green-500' : 'bg-orange-500'"
                      ></div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pl-14">
                  <div v-for="(station, i) in stations" :key="i" class="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span class="text-xs text-gray-600">{{ station.name }}</span>
                    <div class="flex items-center gap-1.5">
                      <div :class="['w-1.5 h-1.5 rounded-full', currentInstance.status === 'approved' ? 'bg-green-500' : 'bg-gray-300']"></div>
                      <span :class="['text-[10px] font-bold', currentInstance.status === 'approved' ? 'text-green-600' : 'text-gray-400']">
                        {{ currentInstance.status === 'approved' ? '已同步' : '待同步' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <!-- Audit Timeline -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
              <h3 class="font-bold text-gray-800">审核进度追踪</h3>
            </div>
            <div class="p-6">
              <div class="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                <div v-for="(step, i) in timelineSteps" :key="i" class="relative pl-12">
                  <div :class="['absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center z-10', step.status === 'done' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400']">
                    <CheckCircle2 v-if="step.status === 'done'" :size="16" />
                    <Clock v-else :size="16" />
                  </div>
                  <div>
                    <div class="flex items-center gap-3 mb-1">
                      <h4 :class="['text-sm font-bold', step.status === 'done' ? 'text-gray-800' : 'text-gray-400']">{{ step.title }}</h4>
                      <span class="text-[10px] text-gray-400 font-mono">{{ step.time }}</span>
                    </div>
                    <p class="text-xs text-gray-500">{{ step.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="view === 'form'" class="bg-white rounded-xl border border-gray-200 shadow-sm p-8 relative">
      <div class="flex items-center justify-between mb-8">
        <button 
          @click="isCurrentCategorySingleInstance ? onViewChange('categories') : (selectedCategory ? onViewChange('instances', selectedCategory) : onViewChange('categories'))"
          class="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
        >
          <ArrowLeft :size="18" />
          返回列表
        </button>
        <div v-if="isSubmitting" class="flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold animate-pulse">
          <Activity :size="16" />
          正在同步全省系统... {{ syncProgress }}%
        </div>
      </div>
      
      <div class="max-w-3xl mx-auto">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <ShieldCheck :size="24" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-800">{{ currentInstance ? '申请变更' : '新增备案' }} - {{ selectedCategory }}</h2>
            <p class="text-sm text-gray-500">
              {{ currentInstance ? '正在对已有备案信息进行变更申请，变更后需重新进行全省系统同步' : '请确保录入信息真实有效，系统将进行全省联网校验并同步至各飞行服务站' }}
            </p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div v-for="field in formFields" :key="field.id" :class="['space-y-2', field.colSpan === 2 ? 'md:col-span-2' : '']">
            <label class="text-sm font-medium text-gray-700">{{ field.label }}</label>
            <textarea 
              v-if="field.type === 'textarea'"
              rows="4"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              :placeholder="field.placeholder"
              v-model="formData[field.id]"
            ></textarea>
            <select 
              v-else-if="field.type === 'select'"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              v-model="formData[field.id]"
            >
              <option value="">{{ field.placeholder || `请选择${field.label}` }}</option>
              <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
            </select>
            <input 
              v-else
              :type="field.type" 
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              :placeholder="field.placeholder"
              v-model="formData[field.id]"
            />
          </div>
        </div>

        <div class="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3 mb-8">
          <ShieldCheck class="text-orange-600 mt-0.5" :size="18" />
          <div class="text-[10px] text-orange-800 leading-relaxed">
            <p class="font-bold mb-1">全省资质同源声明：</p>
            您提交的信息将经过加密处理，实时推送至<strong>省低空数据融合中心</strong>，并同步至广州、深圳、珠海、粤东四个飞行服务站系统。请确保信息的准确性，虚假申报将影响您的信用等级。
          </div>
        </div>

        <button 
          @click="handleSubmit"
          :disabled="isSubmitting"
          :class="['w-full py-4 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2', isSubmitting ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800']"
        >
          <template v-if="isSubmitting">
            <Activity :size="18" class="animate-spin" />
            正在同步全省系统 ({{ syncProgress }}%)...
          </template>
          <template v-else>
            <CheckCircle2 :size="18" />
            {{ currentInstance ? '提交变更申请' : '提交备案申请' }}
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { 
  ShieldCheck, ChevronRight, ArrowLeft, Plus, Trash2, Edit3, Download, 
  Activity, CheckCircle2, Clock, AlertCircle, Home, Plane, Users, MapPin 
} from 'lucide-vue-next';
import { CertView, CertInstance } from '../types';
import { CERT_CATEGORIES, FORM_CONFIGS, FIELD_MAP } from '../constants';

const props = defineProps<{
  userType: 'individual' | 'enterprise';
  view: CertView;
  selectedCategory: string | null;
  selectedInstanceId: string | null;
  instances: CertInstance[];
}>();

const emit = defineEmits(['viewChange', 'addInstance', 'updateInstance', 'deleteInstance']);

// Modal State
const modal = reactive({
  show: false,
  title: '',
  message: '',
  type: 'info' as 'info' | 'confirm',
  onConfirm: null as (() => void) | null
});

// Form State
const formData = ref<Record<string, any>>({});
const isSubmitting = ref(false);
const syncProgress = ref(0);

// Computed
const displayCategories = computed(() => {
  return CERT_CATEGORIES.filter(cat => cat.allowedFor.includes(props.userType));
});

const filteredInstances = computed(() => {
  return props.instances.filter(i => i.category === props.selectedCategory);
});

const currentInstance = computed(() => {
  return props.instances.find(i => i.id === props.selectedInstanceId);
});

const formFields = computed(() => {
  return props.selectedCategory ? FORM_CONFIGS[props.selectedCategory]?.fields : [];
});

const isCurrentCategorySingleInstance = computed(() => {
  const cat = CERT_CATEGORIES.find(c => c.title === props.selectedCategory);
  return !!cat?.isSingleInstance;
});

const timelineSteps = computed(() => {
  if (!currentInstance.value) return [];
  return [
    { title: '备案生效', time: currentInstance.value.approvedAt ? new Date(currentInstance.value.approvedAt).toLocaleString() : '-', desc: '系统已完成全省联网同步，备案正式生效', status: currentInstance.value.status === 'approved' ? 'done' : 'pending' },
    { title: '全省联网校验', time: new Date(currentInstance.value.createdAt).toLocaleString(), desc: '正在进行全省飞行服务站数据一致性校验', status: 'done' },
    { title: '提交申请', time: new Date(currentInstance.value.createdAt).toLocaleString(), desc: '用户提交备案申请，进入同步流程', status: 'done' }
  ];
});

const stations = [
  { name: '广州飞行服务站' },
  { name: '深圳飞行服务站' },
  { name: '珠海飞行服务站' },
  { name: '粤东飞行服务站' }
];

// Watchers
watch(() => props.view, (newView) => {
  if (newView === 'form') {
    const fields = FORM_CONFIGS[props.selectedCategory || '']?.fields || [];
    const initialData: Record<string, any> = {};
    
    // Initialize all fields to avoid reactivity issues
    fields.forEach(f => {
      initialData[f.id] = '';
    });

    if (currentInstance.value) {
      formData.value = { ...initialData, ...currentInstance.value.data };
    } else {
      formData.value = initialData;
    }
  }
});

// Methods
const onViewChange = (view: CertView, category?: string | null, instanceId?: string | null) => {
  // Business Logic: Single Instance Check
  // Only auto-redirect when coming from the 'categories' view
  if (props.view === 'categories' && view === 'instances' && category) {
    const catConfig = CERT_CATEGORIES.find(c => c.title === category);
    if (catConfig?.isSingleInstance) {
      const existing = props.instances.find(i => i.category === category);
      if (existing) {
        // If exists, jump to detail
        emit('viewChange', 'detail', category, existing.id);
        return;
      } else {
        // If not exists, jump to form
        emit('viewChange', 'form', category, null);
        return;
      }
    }
  }
  
  emit('viewChange', view, category, instanceId);
};

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Plane': return Plane;
    case 'Users': return Users;
    case 'ShieldCheck': return ShieldCheck;
    case 'MapPin': return MapPin;
    case 'Activity': return Activity;
    default: return ShieldCheck;
  }
};

const getCategoryCount = (category: string) => {
  return props.instances.filter(i => i.category === category).length;
};

const getInstanceTitle = (instance: CertInstance) => {
  const cat = CERT_CATEGORIES.find(c => c.title === instance.category);
  if (cat && cat.titleField && instance.data[cat.titleField]) {
    return instance.data[cat.titleField];
  }
  // Fallback to first available data value or ID
  const values = Object.values(instance.data);
  return values.length > 0 ? values[0] : instance.id;
};

const getFieldLabel = (fieldId: string) => {
  // 1. Try to get from specific form config first
  if (props.selectedCategory) {
    const config = FORM_CONFIGS[props.selectedCategory];
    const field = config?.fields.find(f => f.id === fieldId);
    if (field) return field.label;
  }
  
  // 2. Fallback to global field map
  if (FIELD_MAP[fieldId]) return FIELD_MAP[fieldId];
  
  // 3. Return raw ID if nothing found
  return fieldId;
};

const confirmDelete = (id: string) => {
  modal.title = '确认注销备案';
  modal.message = '注销后该备案信息将从全省系统中移除，相关飞行资质将失效。此操作不可撤销，是否确认？';
  modal.type = 'confirm';
  modal.show = true;
  modal.onConfirm = () => {
    emit('deleteInstance', id);
    modal.show = false;
  };
};

const handleModalAction = () => {
  if (modal.type === 'confirm' && modal.onConfirm) {
    modal.onConfirm();
  } else {
    modal.show = false;
  }
};

const handleSubmit = () => {
  if (!props.selectedCategory) return;
  
  isSubmitting.value = true;
  syncProgress.value = 0;
  
  const interval = setInterval(() => {
    syncProgress.value += 10;
    if (syncProgress.value >= 100) {
      clearInterval(interval);
      isSubmitting.value = false;
      
      const dataToSubmit = { ...formData.value };
      const newId = currentInstance.value?.id || `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const newInstance: CertInstance = {
        id: newId,
        category: props.selectedCategory!,
        status: 'approved',
        createdAt: currentInstance.value?.createdAt || new Date().toISOString(),
        approvedAt: new Date().toISOString(),
        data: dataToSubmit
      };

      if (currentInstance.value) {
        emit('updateInstance', newInstance);
      } else {
        emit('addInstance', newInstance);
      }

      modal.title = '同步成功';
      modal.message = '您的备案信息已成功同步至全省低空数据融合中心及各飞行服务站。';
      modal.type = 'info';
      modal.show = true;
      
      // Navigate to detail view for better UX after successful submission
      onViewChange('detail', props.selectedCategory, newId);
    }
  }, 100);
};
</script>
