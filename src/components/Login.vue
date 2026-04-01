<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Hero Section -->
    <section class="relative min-h-[480px] py-6 flex items-center justify-center flex-1">
      <!-- Background with Drone -->
      <div class="absolute inset-0 z-0">
        <img 
          src="/banner.png" 
          alt="Hero Background" 
          class="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div class="container mx-auto px-8 relative z-10 flex items-center justify-end">
        <!-- Right Side: Login Box -->
        <div class="w-full max-w-md bg-white rounded-xl shadow-2xl border border-white/20 backdrop-blur-sm p-6">
          <div class="mb-4">
            <div class="flex items-center gap-2 mb-1">
              <ShieldCheck class="text-blue-600" :size="18" />
              <h2 class="text-base font-bold text-gray-800">统一身份认证登录</h2>
            </div>
            <div class="flex flex-col gap-0.5">
              <p class="text-[10px] text-gray-500 flex items-center gap-1">
                <span class="w-1 h-1 bg-blue-400 rounded-full"></span>
                粤信签统一身份认证登录
              </p>
              <p class="text-[10px] text-gray-500 flex items-center gap-1">
                <span class="w-1 h-1 bg-blue-400 rounded-full"></span>
                每次登录需实名身份核验
              </p>
              <p class="text-[10px] text-orange-500 flex items-center gap-1">
                <AlertCircle :size="9" />
                异常登录触发增强核验
              </p>
            </div>
          </div>

          <div class="flex items-center justify-center gap-8 mb-4 border-b border-gray-100">
            <button
              v-for="tab in loginTabs"
              :key="tab.id"
              @click="loginTab = tab.id; loginStep = 'form'"
              :class="['pb-3 text-sm font-bold transition-all relative', loginTab === tab.id ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600']"
            >
              {{ tab.label }}
              <div v-if="loginTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            </button>
          </div>

          <div v-if="loginTab === 'qrcode'" class="text-center py-1">
            <div class="bg-gray-50 p-3 rounded-xl border border-gray-100 mb-3 inline-block">
              <div class="w-36 h-36 bg-white p-2 border border-gray-200 rounded shadow-sm mx-auto">
                <img src="/qrcode.png" alt="QR Code" class="w-full h-full" referrerPolicy="no-referrer" />
              </div>
            </div>
            <p class="text-[10px] text-gray-500 mb-4">请使用“粤信签”小程序扫码认证</p>
            
            <button 
              @click="handleYuexinVerify"
              class="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98] text-sm"
            >
              {{ isVerifying ? '认证中...' : '扫码认证登录' }}
            </button>
          </div>

          <div v-else class="space-y-3">
            <div v-if="loginStep === 'form'" class="space-y-3">
              <div class="relative">
                <User :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="请输入账号/身份证号" 
                  v-model="username"
                  class="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs"
                />
              </div>
              <div class="relative">
                <ShieldCheck :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="请输入密码" 
                  v-model="password"
                  class="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs"
                />
              </div>
              
              <div class="bg-blue-50 p-2.5 rounded-lg border border-blue-100 mb-1">
                <p class="text-[9px] text-blue-700 leading-relaxed">
                  提示：个人演示账号 geren，企业演示账号 qiye，密码均为 123456。
                </p>
              </div>

              <button 
                @click="handleAccountLogin"
                class="w-full py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-all shadow-lg shadow-gray-200 active:scale-[0.98] text-sm"
              >
                认证登录
              </button>
            </div>
            <div v-else class="text-center py-1">
              <div class="mb-3 flex flex-col items-center">
                <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-1">
                  <QrCode :size="20" class="text-blue-600" />
                </div>
                <h3 class="text-xs font-bold text-gray-800">二次实名核验</h3>
                <p class="text-[10px] text-gray-500 mt-0.5">账号验证成功，请完成粤信签二次认证</p>
              </div>

              <div class="bg-gray-50 p-3 rounded-xl border border-dashed border-gray-300 mb-3">
                <div class="w-28 h-28 bg-white p-2 border border-gray-200 rounded shadow-sm mx-auto">
                  <img src="/qrcode.png" alt="QR Code" class="w-full h-full" referrerPolicy="no-referrer" />
                </div>
              </div>

              <button 
                @click="handleYuexinVerify"
                :disabled="isVerifying"
                class="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 text-xs"
              >
                {{ isVerifying ? '核验中...' : '模拟二次核验通过' }}
              </button>
              <button 
                @click="loginStep = 'form'"
                class="w-full mt-1 py-1 text-gray-500 text-[10px] font-medium hover:text-gray-700"
              >
                返回账号输入
              </button>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
            <button 
              @click="isRegisterOpen = true"
              class="w-full py-2.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all active:scale-[0.98] text-xs"
            >
              前往注册
            </button>

            <div class="flex justify-between text-[10px] text-blue-600 font-medium">
              <a href="#" class="hover:underline">账号问题申诉</a>
              <a href="#" class="hover:underline">忘记密码？</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Registration Modal (Simplified for brevity, same as App.vue logic) -->
    <div v-if="isRegisterOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div @click="resetRegister" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div class="bg-gray-800 px-8 py-6 flex items-center justify-between text-white">
          <div>
            <h2 class="text-xl font-bold">用户注册</h2>
            <p class="text-xs text-gray-400 mt-1">请按照指引完成实名注册与电子协议签署</p>
          </div>
          <button @click="resetRegister" class="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X :size="20" />
          </button>
        </div>
        
        <div class="p-8 min-h-[400px]">
          <!-- Registration steps logic here... (omitted for brevity, will be fully implemented) -->
          <div v-if="registerStep === 'type'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button @click="setRegisterType('individual')" class="group p-8 border-2 border-gray-100 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all text-left">
              <div class="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-100 group-hover:scale-110 transition-all">
                <User :size="28" class="text-blue-600 group-hover:text-orange-600" />
              </div>
              <h3 class="text-lg font-bold text-gray-800 mb-2">个人用户注册</h3>
              <p class="text-sm text-gray-500 leading-relaxed">适用于普通无人机爱好者、飞手等个人主体。</p>
            </button>
            <button @click="setRegisterType('enterprise')" class="group p-8 border-2 border-gray-100 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all text-left">
              <div class="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-100 group-hover:scale-110 transition-all">
                <Building2 :size="28" class="text-blue-600 group-hover:text-orange-600" />
              </div>
              <h3 class="text-lg font-bold text-gray-800 mb-2">飞行企业注册</h3>
              <p class="text-sm text-gray-500 leading-relaxed">适用于无人机运营企业、培训机构等法人主体。</p>
            </button>
          </div>
          <div v-else class="text-center py-12">
             <p class="text-gray-500 mb-6">演示环境：注册流程已简化，点击下方按钮完成模拟注册。</p>
             <button @click="resetRegister" class="px-12 py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-all">返回登录</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  ShieldCheck, AlertCircle, User, QrCode, X, Building2
} from 'lucide-vue-next';
import { LoginTab, RegisterStep, RegisterType } from '../types';

const emit = defineEmits(['login-success']);

const loginTabs: { id: LoginTab, label: string }[] = [
  { id: 'qrcode', label: '扫码登录' },
  { id: 'account', label: '账号登录' }
];

const loginTab = ref<LoginTab>('qrcode');
const loginStep = ref<'form' | 'yuexin'>('form');
const username = ref('');
const password = ref('');
const isVerifying = ref(false);

const isRegisterOpen = ref(false);
const registerStep = ref<RegisterStep>('type');
const registerType = ref<RegisterType>('individual');

const handleAccountLogin = () => {
  if (!username.value || !password.value) {
    alert('请输入账号和密码');
    return;
  }
  
  // Account validation logic
  if (password.value !== '123456') {
    alert('密码错误，请使用演示密码 123456');
    return;
  }

  if (username.value !== 'geren' && username.value !== 'qiye') {
    alert('演示账号错误。个人请用 geren，企业请用 qiye');
    return;
  }

  loginStep.value = 'yuexin';
};

const handleYuexinVerify = () => {
  isVerifying.value = true;
  setTimeout(() => {
    isVerifying.value = false;
    const type = username.value === 'qiye' ? 'enterprise' : 'individual';
    emit('login-success', type);
  }, 1500);
};

const resetRegister = () => {
  isRegisterOpen.value = false;
  registerStep.value = 'type';
};

const setRegisterType = (type: RegisterType) => {
  registerType.value = type;
  registerStep.value = 'info';
};
</script>
