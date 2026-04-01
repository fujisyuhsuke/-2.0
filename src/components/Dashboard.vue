<template>
  <div class="space-y-8">
    <!-- Welcome & Stats Section -->
    <div class="flex justify-between items-end mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">
          欢迎回来，{{ userType === 'enterprise' ? '广东某航测技术有限公司' : '张三' }}
        </h2>
        <div class="flex items-center gap-3 mt-1">
          <span class="text-sm text-gray-500">
            {{ userType === 'enterprise' ? '企业信用等级：' : '您当前的实名等级：' }}
          </span>
          <span :class="['px-2 py-0.5 text-[10px] font-bold rounded uppercase', userType === 'enterprise' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700']">
            {{ userType === 'enterprise' ? 'AAA 级信用企业' : 'L3 高级认证' }}
          </span>
        </div>
      </div>
      <div class="flex gap-4">
        <button @click="$emit('request-flight')" class="px-6 py-2.5 bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all flex items-center gap-2">
          <UserPlus :size="18" />
          {{ userType === 'enterprise' ? '批量发起申请' : '发起飞行申请' }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div v-for="(stat, i) in stats" :key="i" class="p-6 rounded-xl border border-gray-100 shadow-sm bg-white flex justify-between items-start">
        <div>
          <p class="text-sm text-gray-500 font-medium">{{ stat.label }}</p>
          <p :class="['text-3xl font-bold mt-2', stat.color]">{{ stat.value }}</p>
        </div>
        <div class="p-2 bg-gray-50 rounded-lg">
          <component :is="stat.icon" :size="20" :class="stat.iconColor" />
        </div>
      </div>
    </div>

    <!-- Main Dashboard Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Recent Records -->
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 class="font-bold text-gray-800 flex items-center gap-2">
              <FileText :size="18" class="text-blue-600" />
              最近飞行申请记录
            </h3>
            <button class="text-sm text-blue-600 hover:underline">查看全部</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="bg-gray-50 text-gray-500 font-medium">
                  <th class="px-6 py-3">申请编号</th>
                  <th class="px-6 py-3">飞行类型</th>
                  <th class="px-6 py-3">申请时间</th>
                  <th class="px-6 py-3">状态</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(row, i) in recentRecords" :key="i" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 font-mono text-xs text-blue-600">{{ row.id }}</td>
                  <td class="px-6 py-4 font-medium">{{ row.type }}</td>
                  <td class="px-6 py-4 text-gray-500">{{ row.time }}</td>
                  <td :class="['px-6 py-4 font-bold', row.statusColor]">{{ row.status }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column: Quick Actions & Info -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Smartphone :size="18" class="text-orange-500" />
            快捷办理
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <button 
              v-for="(item, i) in quickActions" 
              :key="i" 
              @click="item.label === '飞行活动申请' && $emit('request-flight')"
              :class="['flex flex-col items-center justify-center p-4 rounded-lg transition-all border group', item.primary ? 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700 shadow-md shadow-blue-100' : 'bg-gray-50 text-gray-600 border-transparent hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100']"
            >
              <div :class="[item.primary ? 'text-blue-100' : 'text-gray-400 group-hover:text-blue-600', 'mb-2']">
                <component :is="item.icon" :size="16" />
              </div>
              <span class="text-xs font-medium">{{ item.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  Users, Plane, Activity, AlertTriangle, Bell, CheckCircle2, Clock, 
  AlertCircle, FileText, Smartphone, UserPlus, MapPin, ShieldCheck
} from 'lucide-vue-next';

const props = defineProps<{
  userType: 'individual' | 'enterprise'
}>();

defineEmits(['request-flight']);

const stats = computed(() => {
  if (props.userType === 'enterprise') {
    return [
      { label: '在册飞手', value: '24', color: 'text-blue-600', icon: Users, iconColor: 'text-blue-200' },
      { label: '机队规模', value: '12', color: 'text-indigo-600', icon: Plane, iconColor: 'text-indigo-200' },
      { label: '本月飞行', value: '156', color: 'text-green-600', icon: Activity, iconColor: 'text-green-200' },
      { label: '安全预警', value: '1', color: 'text-red-600', icon: AlertTriangle, iconColor: 'text-red-200' },
    ];
  }
  return [
    { label: '待审批申请', value: '2', color: 'text-orange-600', icon: Bell, iconColor: 'text-orange-200' },
    { label: '已通过申请', value: '15', color: 'text-green-600', icon: CheckCircle2, iconColor: 'text-green-200' },
    { label: '飞行时长', value: '42h', color: 'text-blue-600', icon: Clock, iconColor: 'text-blue-200' },
    { label: '违规记录', value: '0', color: 'text-gray-600', icon: AlertCircle, iconColor: 'text-gray-200' },
  ];
});

const recentRecords = [
  { id: 'FL-20260331-001', type: '航拍作业', time: '2026-03-31 10:30', status: '待审批', statusColor: 'text-orange-600' },
  { id: 'FL-20260325-042', type: '基础设施巡检', time: '2026-03-25 14:20', status: '已通过', statusColor: 'text-green-600' },
  { id: 'FL-20260320-015', type: '农林植保', time: '2026-03-20 09:15', status: '已通过', statusColor: 'text-green-600' },
];

const quickActions = computed(() => {
  if (props.userType === 'enterprise') {
    return [
      { label: '飞行活动申请', icon: MapPin, primary: true },
      { label: '飞手入库', icon: UserPlus },
      { label: '机队登记', icon: Plane },
      { label: '资质年审', icon: ShieldCheck },
    ];
  }
  return [
    { label: '飞行活动申请', icon: MapPin, primary: true },
    { label: '实名登记', icon: UserPlus },
    { label: '计划申报', icon: FileText },
    { label: '违规查询', icon: AlertCircle },
  ];
});
</script>
