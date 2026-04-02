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
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-2">
              <ShieldCheck class="text-blue-600" :size="20" />
              <h2 class="text-lg font-bold text-gray-800">统一身份认证登录</h2>
            </div>
            <p class="text-xs text-gray-500">请选择您的身份并完成实名核验登录</p>
          </div>

          <!-- First Level: User Type Tabs -->
          <div class="flex p-1 bg-gray-100 rounded-xl mb-6">
            <button 
              @click="activeUserType = 'individual'"
              :class="['flex-1 py-2.5 text-sm font-bold rounded-lg transition-all', activeUserType === 'individual' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
            >
              个人用户
            </button>
            <button 
              @click="activeUserType = 'enterprise'"
              :class="['flex-1 py-2.5 text-sm font-bold rounded-lg transition-all', activeUserType === 'enterprise' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
            >
              企业用户
            </button>
          </div>

          <!-- Second Level: Login Method Tabs -->
          <div class="flex items-center justify-center gap-8 mb-6 border-b border-gray-100">
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

          <div v-if="loginTab === 'qrcode'" class="text-center py-2">
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4 inline-block">
              <div class="w-40 h-40 bg-white p-2 border border-gray-200 rounded shadow-sm mx-auto">
                <img src="/qrcode.png" alt="QR Code" class="w-full h-full" referrerPolicy="no-referrer" />
              </div>
            </div>
            <p class="text-xs text-gray-500 mb-6">请使用“粤信签”小程序扫码认证</p>
            
            <button 
              @click="handleYuexinVerify"
              class="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98] text-sm"
            >
              {{ isVerifying ? '认证中...' : '扫码认证登录' }}
            </button>
          </div>

          <div v-else class="space-y-4">
            <div v-if="loginStep === 'form'" class="space-y-4">
              <div class="relative">
                <User :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  :placeholder="activeUserType === 'enterprise' ? '请输入企业账号/信用代码' : '请输入个人账号/身份证号'" 
                  v-model="username"
                  class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>
              <div class="relative">
                <Lock :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="请输入密码" 
                  v-model="password"
                  class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>
              
              <div class="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <p class="text-xs text-blue-700 leading-relaxed">
                  演示提示：当前为<span class="font-bold">「{{ activeUserType === 'enterprise' ? '企业' : '个人' }}」</span>模式，演示账号为 <span class="font-bold">{{ activeUserType === 'enterprise' ? 'qiye' : 'geren' }}</span>，密码 123456。
                </p>
              </div>

              <button 
                @click="handleAccountLogin"
                class="w-full py-3.5 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-all shadow-lg shadow-gray-200 active:scale-[0.98] text-sm"
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
              @click="isRegisterOpen = true; registerType = activeUserType; registerStep = 'info'"
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
        
        <div class="p-8 min-h-[480px] flex flex-col">
          <!-- Progress Bar -->
          <div class="flex items-center justify-between mb-10 px-4">
            <div v-for="(step, i) in steps" :key="i" class="flex flex-col items-center relative flex-1">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all', 
                currentStepIndex >= i ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400']">
                {{ i + 1 }}
              </div>
              <span :class="['text-[10px] mt-2 font-medium', currentStepIndex >= i ? 'text-blue-600' : 'text-gray-400']">
                {{ step.label }}
              </span>
              <!-- Line -->
              <div v-if="i < steps.length - 1" :class="['absolute top-4 left-1/2 w-full h-[2px] -z-0', 
                currentStepIndex > i ? 'bg-blue-600' : 'bg-gray-100']"></div>
            </div>
          </div>

          <!-- Step 1: Info Entry -->
          <div v-if="registerStep === 'info'" class="space-y-6 flex-1">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="field in currentFields" :key="field.id" :class="field.colSpan === 2 ? 'md:col-span-2' : ''">
                <label class="block text-xs font-bold text-gray-700 mb-1.5">{{ field.label }}</label>
                <input 
                  v-if="field.type !== 'textarea'"
                  :type="field.type" 
                  v-model="registerForm[field.id]"
                  :placeholder="field.placeholder"
                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                />
                <textarea 
                  v-else
                  v-model="registerForm[field.id]"
                  :placeholder="field.placeholder"
                  rows="3"
                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                ></textarea>
              </div>
            </div>
            
            <div class="flex justify-end pt-4">
              <button @click="registerStep = 'verify'" class="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                下一步：实名核验
              </button>
            </div>
          </div>

          <!-- Step 2: Identity Verify -->
          <div v-if="registerStep === 'verify'" class="flex-1 flex flex-col items-center justify-center py-4">
            <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-6 text-center">
              <div class="w-48 h-48 bg-white p-3 border border-gray-200 rounded-xl shadow-sm mx-auto mb-4">
                <img src="/qrcode.png" alt="Verify QR" class="w-full h-full" referrerPolicy="no-referrer" />
              </div>
              <p class="text-sm font-bold text-gray-800">请使用“粤信签”小程序扫码</p>
              <p class="text-xs text-gray-500 mt-1">完成{{ registerType === 'enterprise' ? '法人/经办人' : '' }}实名身份核验</p>
            </div>
            
            <div class="flex gap-4 w-full max-w-xs">
              <button @click="registerStep = 'info'" class="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-all">
                返回修改
              </button>
              <button @click="handleRegisterVerify" class="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                {{ isVerifying ? '核验中...' : '模拟核验通过' }}
              </button>
            </div>
          </div>

          <!-- Step 3: Agreement Signing -->
          <div v-if="registerStep === 'sign'" class="flex-1 flex flex-col">
            <div class="flex-1 bg-gray-50 rounded-xl border border-gray-200 p-6 overflow-y-auto mb-6 text-xs text-gray-600 leading-relaxed max-h-[280px]">
              <h4 class="font-bold text-gray-800 mb-4 text-sm">《无人驾驶航空器综合监管平台服务协议》</h4>
              <p class="mb-4">欢迎您使用本平台。在您注册成为本平台用户前，请务必仔细阅读并充分理解本协议各条款内容...</p>
              <p class="mb-4">一、用户注册与实名认证：用户应当按照法律法规要求，提供真实、准确、完整的身份信息...</p>
              <p class="mb-4">二、飞行安全承诺：用户承诺严格遵守《无人驾驶航空器飞行管理暂行条例》...</p>
              <p class="mb-4">三、隐私保护：本平台将严格保护您的个人信息安全...</p>
              <div class="mt-8 p-4 bg-white border border-dashed border-gray-300 rounded-lg text-center">
                <p class="text-gray-400 italic">此处为电子签名区域</p>
              </div>
            </div>
            
            <div class="flex items-center gap-2 mb-6">
              <input type="checkbox" id="agree" v-model="hasAgreed" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label for="agree" class="text-xs text-gray-600">我已阅读并同意上述协议及隐私政策</label>
            </div>

            <div class="flex gap-4">
              <button @click="registerStep = 'verify'" class="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-all">
                上一步
              </button>
              <button 
                @click="registerStep = 'complete'" 
                :disabled="!hasAgreed"
                class="flex-1 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-all shadow-lg shadow-gray-200 disabled:opacity-50"
              >
                确认签署并提交注册
              </button>
            </div>
          </div>

          <!-- Step 4: Complete -->
          <div v-if="registerStep === 'complete'" class="flex-1 flex flex-col items-center justify-center text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 :size="40" class="text-green-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">注册成功！</h3>
            <p class="text-gray-500 mb-8 max-w-sm">您的账号已完成实名核验与资质备案，现在可以登录系统开始您的飞行之旅。</p>
            
            <button @click="finishRegister" class="px-12 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-100">
              立即登录系统
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  ShieldCheck, AlertCircle, User, QrCode, X, Building2, Lock, CheckCircle2
} from 'lucide-vue-next';
import { LoginTab, RegisterStep, RegisterType } from '../types';
import { computed, reactive } from 'vue';

const emit = defineEmits(['login-success']);

const activeUserType = ref<RegisterType>('individual');
const loginTab = ref<LoginTab>('qrcode');
const loginStep = ref<'form' | 'yuexin'>('form');
const username = ref('');
const password = ref('');
const isVerifying = ref(false);

const isRegisterOpen = ref(false);
const registerStep = ref<RegisterStep>('info');
const registerType = ref<RegisterType>('individual');
const hasAgreed = ref(false);

const registerForm = reactive<Record<string, string>>({
  name: '',
  idCard: '',
  phone: '',
  password: '',
  companyName: '',
  creditCode: '',
  legalPerson: ''
});

const steps = [
  { id: 'info', label: '填写信息' },
  { id: 'verify', label: '实名核验' },
  { id: 'sign', label: '签署协议' },
  { id: 'complete', label: '注册成功' }
];

const currentStepIndex = computed(() => {
  return steps.findIndex(s => s.id === registerStep.value);
});

const currentFields = computed(() => {
  if (registerType.value === 'enterprise') {
    return [
      { id: 'companyName', label: '企业全称', type: 'text', placeholder: '请输入营业执照上的名称' },
      { id: 'creditCode', label: '统一社会信用代码', type: 'text', placeholder: '请输入18位信用代码' },
      { id: 'legalPerson', label: '法人姓名', type: 'text', placeholder: '请输入企业法人姓名' },
      { id: 'phone', label: '经办人手机号', type: 'text', placeholder: '用于接收验证码' },
      { id: 'password', label: '设置登录密码', type: 'password', placeholder: '请设置6-16位密码', colSpan: 2 }
    ];
  }
  return [
    { id: 'name', label: '真实姓名', type: 'text', placeholder: '请输入您的真实姓名' },
    { id: 'idCard', label: '身份证号', type: 'text', placeholder: '请输入18位身份证号码' },
    { id: 'phone', label: '手机号码', type: 'text', placeholder: '请输入您的手机号' },
    { id: 'password', label: '设置登录密码', type: 'password', placeholder: '请设置6-16位密码' }
  ];
});

const loginTabs: { id: LoginTab, label: string }[] = [
  { id: 'qrcode', label: '扫码登录' },
  { id: 'account', label: '账号登录' }
];

const handleAccountLogin = () => {
  if (!username.value || !password.value) {
    alert('请输入账号和密码');
    return;
  }
  
  // Account validation logic with user type check
  if (password.value !== '123456') {
    alert('密码错误，请使用演示密码 123456');
    return;
  }

  if (activeUserType.value === 'individual' && username.value !== 'geren') {
    alert('演示账号错误。个人请用 geren');
    return;
  }

  if (activeUserType.value === 'enterprise' && username.value !== 'qiye') {
    alert('演示账号错误。企业请用 qiye');
    return;
  }

  loginStep.value = 'yuexin';
};

const handleYuexinVerify = () => {
  isVerifying.value = true;
  setTimeout(() => {
    isVerifying.value = false;
    emit('login-success', activeUserType.value);
  }, 1500);
};

const handleRegisterVerify = () => {
  isVerifying.value = true;
  setTimeout(() => {
    isVerifying.value = false;
    registerStep.value = 'sign';
  }, 1500);
};

const resetRegister = () => {
  isRegisterOpen.value = false;
  registerStep.value = 'info';
  hasAgreed.value = false;
  // Reset form
  Object.keys(registerForm).forEach(key => registerForm[key] = '');
};

const finishRegister = () => {
  // Fill login form with registered info for convenience
  username.value = registerType.value === 'enterprise' ? 'qiye' : 'geren';
  password.value = '123456';
  loginTab.value = 'account';
  resetRegister();
};
</script>
