<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">账号管理</h2>
        <p class="text-sm text-gray-500 mt-1">管理您的个人资料、安全设置及权限分配</p>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
        <Shield :size="16" />
        账号安全等级: 优
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Profile Card -->
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-8 flex items-center gap-6 border-b border-gray-50">
            <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 overflow-hidden relative group cursor-pointer">
              <User :size="48" />
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera :size="24" />
              </div>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-gray-800 mb-1">
                {{ userType === 'enterprise' ? '广东某航测技术有限公司' : '张三' }}
              </h3>
              <p class="text-sm text-gray-500 mb-3 flex items-center gap-2">
                <Mail :size="14" />
                {{ userType === 'enterprise' ? 'admin@gd-uas.com' : 'zhangsan@example.com' }}
              </p>
              <div class="flex gap-2">
                <span class="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full uppercase tracking-wider">
                  {{ userType === 'enterprise' ? '企业主账号' : '实名个人' }}
                </span>
                <span class="text-[10px] font-bold px-2 py-0.5 bg-green-50 text-green-600 rounded-full uppercase tracking-wider">
                  已实名认证
                </span>
              </div>
            </div>
          </div>
          <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="field in profileFields" :key="field.label" class="space-y-1.5">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ field.label }}</label>
              <div class="flex items-center justify-between group">
                <p class="text-sm font-medium text-gray-700">{{ field.value }}</p>
                <button class="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">修改</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-8 py-4 border-b border-gray-50 bg-gray-50/30">
            <h3 class="font-bold text-gray-800">安全设置</h3>
          </div>
          <div class="p-8 space-y-6">
            <div v-for="item in securityItems" :key="item.title" class="flex items-center justify-between group">
              <div class="flex items-center gap-4">
                <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', item.status === 'on' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600']">
                  <component :is="item.icon" :size="20" />
                </div>
                <div>
                  <h4 class="text-sm font-bold text-gray-800">{{ item.title }}</h4>
                  <p class="text-xs text-gray-500">{{ item.desc }}</p>
                </div>
              </div>
              <button :class="['px-4 py-1.5 rounded-lg text-xs font-bold transition-all', item.status === 'on' ? 'text-gray-400 hover:text-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100']">
                {{ item.status === 'on' ? '已开启' : '立即开启' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-8">
        <!-- Stats -->
        <div class="bg-blue-600 rounded-2xl p-8 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16"></div>
          <div class="relative z-10">
            <h3 class="text-sm font-medium opacity-80 mb-6">账号信用分</h3>
            <div class="flex items-end gap-2 mb-2">
              <span class="text-5xl font-bold tracking-tighter">98</span>
              <span class="text-sm opacity-80 mb-1.5">/ 100</span>
            </div>
            <p class="text-xs opacity-80 leading-relaxed">您的信用等级为“优秀”，享有优先审批及更多飞行配额权限。</p>
            <button class="mt-8 w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold transition-all">
              查看信用报告
            </button>
          </div>
        </div>

        <!-- Login Logs -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
            <h3 class="font-bold text-gray-800">最近登录</h3>
          </div>
          <div class="p-6 space-y-4">
            <div v-for="log in loginLogs" :key="log.time" class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                <Monitor :size="14" />
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-0.5">
                  <span class="text-xs font-bold text-gray-700">{{ log.device }}</span>
                  <span class="text-[10px] text-gray-400">{{ log.time }}</span>
                </div>
                <p class="text-[10px] text-gray-400">{{ log.location }} · {{ log.ip }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  User, Mail, Phone, Shield, Lock, Smartphone, Key, 
  Camera, Monitor, MapPin, ShieldCheck 
} from 'lucide-vue-next';

const props = defineProps<{
  userType: 'individual' | 'enterprise';
}>();

const profileFields = [
  { label: '手机号码', value: props.userType === 'enterprise' ? '139****9000' : '138****8000' },
  { label: '实名认证', value: props.userType === 'enterprise' ? '统一社会信用代码: 91440101MA59XXXXXX' : '身份证号: 440106********XXXX' },
  { label: '注册时间', value: '2023-10-15' },
  { label: '所属地区', value: '广东省广州市天河区' },
];

const securityItems = [
  { title: '登录密码', desc: '建议定期更换高强度密码以保障账号安全', icon: Lock, status: 'on' },
  { title: '手机验证', desc: '用于敏感操作时的身份验证', icon: Smartphone, status: 'on' },
  { title: '二次验证 (2FA)', desc: '开启后登录需输入动态验证码，极大提升安全性', icon: Shield, status: 'off' },
  { title: '数字证书', desc: '用于飞行业务申报的电子签名', icon: Key, status: 'off' },
];

const loginLogs = [
  { device: 'Chrome / macOS', time: '10分钟前', location: '广州市', ip: '183.63.XX.XX' },
  { device: 'iPhone 15 Pro', time: '昨天 18:30', location: '深圳市', ip: '113.108.XX.XX' },
  { device: 'Chrome / Windows', time: '3天前', location: '广州市', ip: '183.63.XX.XX' },
];
</script>
