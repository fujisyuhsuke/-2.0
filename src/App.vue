<template>
  <div class="min-h-screen bg-gray-50 font-sans selection:bg-orange-100 selection:text-orange-900">
    <!-- Logged In View -->
    <div v-if="isLoggedIn" class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Top Utility Bar -->
      <div class="bg-[#f8f8f8] border-b border-gray-200 py-1.5 px-8 flex justify-between items-center text-[11px] text-gray-500">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-1 cursor-pointer hover:text-blue-600">
            <MapPin :size="12" class="text-blue-600" />
            <span class="font-medium text-gray-700">广东省</span>
            <ChevronDown :size="10" />
          </div>
          <div class="flex items-center gap-4">
            <span class="text-gray-400">广东省低空飞行综合管理平台</span>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3">
            <Bell :size="14" class="cursor-pointer hover:text-blue-600" />
            <div class="flex items-center gap-1 cursor-pointer group">
              <div class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 overflow-hidden">
                <User :size="12" />
              </div>
              <span class="text-gray-700 group-hover:text-blue-600 font-medium">
                {{ userType === 'enterprise' ? '广东某航测技术有限公司' : '张三' }} ({{ userType === 'enterprise' ? '企业用户' : '个人用户' }})
              </span>
              <ChevronDown :size="10" />
            </div>
            <button 
              @click="handleLogout"
              class="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
              title="退出登录"
            >
              <LogOut :size="12" />
              <span>退出</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Header with Logo -->
      <header class="bg-white py-4 px-8 flex items-center border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold italic overflow-hidden">
            <img src="https://picsum.photos/seed/guangdong-uav/100/100" alt="Logo" class="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-800 tracking-tight">广东省低空飞行综合管理平台</h1>
            <p class="text-[10px] text-gray-400 uppercase tracking-widest">Guangdong Low-altitude Flight Management Platform</p>
          </div>
        </div>
      </header>

      <!-- Top Navigation Tabs -->
      <nav class="bg-white border-b border-gray-200 px-8 flex items-center sticky top-0 z-40">
        <button 
          v-for="item in navItems"
          :key="item.label" 
          @click="currentNav = item.label"
          :class="['px-6 py-4 text-[15px] font-medium transition-all relative flex items-center gap-2', currentNav === item.label ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600']"
        >
          <component :is="item.icon" :size="16" />
          {{ item.label }}
          <div v-if="currentNav === item.label" class="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full"></div>
        </button>
      </nav>

      <!-- Platform Content Area -->
      <main class="flex-1 bg-gray-50 py-8 px-8 overflow-y-auto">
        <div class="max-w-6xl mx-auto">
          <Dashboard 
            v-if="currentNav === '首页'"
            :userType="userType"
            @request-flight="handleRequestFlight"
          />

          <CertificationCenter 
            v-else-if="currentNav === '资质认证'"
            :userType="userType" 
            :view="certView"
            :selectedCategory="selectedCategory"
            :selectedInstanceId="selectedInstanceId"
            :instances="certInstances"
            @viewChange="handleCertViewChange"
            @addInstance="handleAddInstance"
            @updateInstance="handleUpdateInstance"
            @deleteInstance="handleDeleteInstance"
          />

          <FlightBusinessDeclaration 
            v-else-if="currentNav === '飞行业务申报'"
          />

          <AccountManagement 
            v-else-if="currentNav === '账号管理'"
            :userType="userType"
          />
          
          <div v-else class="flex flex-col items-center justify-center py-20 text-gray-400">
            <component :is="navItems.find(n => n.label === currentNav)?.icon" :size="48" class="mb-4 opacity-20" />
            <p class="text-lg font-medium">{{ currentNav }} 模块正在建设中...</p>
          </div>
        </div>

        <!-- Floating Right Sidebar -->
        <div class="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-50">
          <div 
            v-for="(tool, i) in sidebarTools" 
            :key="i" 
            class="w-14 h-14 bg-white border border-gray-100 shadow-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-all first:rounded-t-lg last:rounded-b-lg group"
          >
            <div class="text-gray-400 group-hover:text-blue-600 transition-colors">
              <component :is="tool.icon" :size="18" />
            </div>
            <span class="text-[10px] mt-1 text-gray-500 group-hover:text-blue-600">{{ tool.label }}</span>
          </div>
        </div>
      </main>
    </div>

    <!-- Login View -->
    <Login v-else @login-success="handleLoginSuccess" />

    <FlightApplicationModal 
      :isOpen="showFlightMap"
      @close="showFlightMap = false"
      v-model:step="applicationStep"
      v-model:selectedLocation="selectedLocation"
    />

    <FooterSection v-if="!isLoggedIn" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  ShieldCheck, User, MapPin, ChevronDown, Bell, LogOut, FileText, Clock, 
  Smartphone, MessageSquare, ThumbsUp, HelpCircle, Home
} from 'lucide-vue-next';
import FooterSection from './components/FooterSection.vue';
import FlightApplicationModal from './components/FlightApplicationModal.vue';
import CertificationCenter from './components/CertificationCenter.vue';
import FlightBusinessDeclaration from './components/FlightBusinessDeclaration.vue';
import AccountManagement from './components/AccountManagement.vue';
import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';
import { CertView, CertInstance } from './types';

// Auth State
const isLoggedIn = ref(false);
const userType = ref<'individual' | 'enterprise'>('individual');

// Navigation State
const currentNav = ref('首页');
const navItems = [
  { label: '首页', icon: Home },
  { label: '资质认证', icon: ShieldCheck },
  { label: '飞行业务申报', icon: FileText },
  { label: '账号管理', icon: User }
];

// Flight Application State
const showFlightMap = ref(false);
const applicationStep = ref<'map' | 'form' | 'external'>('map');
const selectedLocation = ref<{ name: string, station: string } | null>(null);

// Certification State
const certView = ref<CertView>('categories');
const selectedCategory = ref<string | null>(null);
const selectedInstanceId = ref<string | null>(null);
const certInstances = ref<CertInstance[]>([]);

const sidebarTools = [
  { icon: MessageSquare, label: '咨询' },
  { icon: ThumbsUp, label: '投诉' },
  { icon: HelpCircle, label: '帮助' },
  { icon: Smartphone, label: '掌上办' },
];

// Methods
const handleLoginSuccess = (type: 'individual' | 'enterprise') => {
  userType.value = type;
  isLoggedIn.value = true;
  currentNav.value = '首页';
};

const handleRequestFlight = () => {
  currentNav.value = '飞行业务申报';
};

const handleLogout = () => {
  isLoggedIn.value = false;
  currentNav.value = '首页';
};

const handleCertViewChange = (view: CertView, category?: string | null, instanceId?: string | null) => {
  certView.value = view;
  if (category !== undefined) selectedCategory.value = category;
  selectedInstanceId.value = instanceId !== undefined ? instanceId : null;
};

const handleAddInstance = (instance: CertInstance) => {
  certInstances.value.push(instance);
};

const handleUpdateInstance = (instance: CertInstance) => {
  const index = certInstances.value.findIndex(i => i.id === instance.id);
  if (index !== -1) certInstances.value[index] = instance;
};

const handleDeleteInstance = (id: string) => {
  certInstances.value = certInstances.value.filter(i => i.id !== id);
};
</script>

<style>
@keyframes pulse-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}
</style>
