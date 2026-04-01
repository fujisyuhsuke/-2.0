/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  User, 
  ShieldCheck, 
  QrCode, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  FileText, 
  Building2,
  ChevronRight,
  X,
  AlertCircle,
  Bell,
  Search,
  Flame,
  Briefcase,
  Car,
  Home,
  MessageSquare,
  ThumbsUp,
  HelpCircle,
  MapPin,
  ChevronDown,
  LogOut,
  Heart,
  UserPlus,
  Plane,
  Users,
  Activity,
  AlertTriangle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type LoginTab = 'qrcode' | 'account';
type RegisterType = 'individual' | 'enterprise';
type RegisterStep = 'type' | 'info' | 'verify' | 'sign' | 'complete';

// --- Certification Types ---
interface CertInstance {
  id: string;
  categoryId: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  syncStatus: {
    provincial: 'synced' | 'syncing' | 'failed';
    stations: { [key: string]: 'synced' | 'syncing' | 'failed' };
  };
  data: any;
  createdAt: string;
  approvedAt?: string;
  recordNo?: string;
}

type CertView = 'categories' | 'instances' | 'detail' | 'form';

// --- Components ---

const Header = () => (
  <header className="bg-white border-b border-gray-100 py-2 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold italic overflow-hidden">
          <img src="https://picsum.photos/seed/guangdong-uav/100/100" alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800 leading-tight tracking-tight">
            广东省低空飞行服务统一门户
          </h1>
          <p className="text-xs text-gray-500 font-medium tracking-widest">
            ( 广东省低空飞行综合管理平台 )
          </p>
        </div>
      </div>
    </div>
    <nav className="hidden lg:flex items-center gap-8">
      {['首页', '通知公告', '政策法规', '操作指南'].map((item, i) => (
        <a 
          key={item} 
          href="#" 
          className={`text-sm font-medium transition-colors ${i === 0 ? 'text-orange-500 border-b-2 border-orange-500 pb-1' : 'text-gray-600 hover:text-orange-500'}`}
        >
          {item}
        </a>
      ))}
    </nav>
  </header>
);

// --- Components ---
const CertificationCenter = ({ 
  userType,
  view,
  selectedCategory,
  selectedInstanceId,
  instances,
  onAddInstance,
  onUpdateInstance,
  onViewChange
}: { 
  userType: 'individual' | 'enterprise',
  view: CertView,
  selectedCategory: string | null,
  selectedInstanceId: string | null,
  instances: CertInstance[],
  onAddInstance: (instance: CertInstance) => void,
  onUpdateInstance: (instance: CertInstance) => void,
  onViewChange: (view: CertView, category?: string | null, instanceId?: string | null) => void
}) => {
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [modal, setModal] = useState<{ show: boolean, title: string, message: string, onConfirm?: () => void, type: 'confirm' | 'alert' }>({
    show: false,
    title: '',
    message: '',
    type: 'alert'
  });

  // Get current instance if in detail or form (edit) mode
  const currentInstance = instances.find(i => i.id === selectedInstanceId);

  useEffect(() => {
    if (view === 'form' && currentInstance) {
      setFormData(currentInstance.data);
    } else if (view === 'form') {
      // Pre-fill demo data for new applications to facilitate demonstration
      if (selectedCategory === '飞手认证') {
        setFormData({
          name: '张三',
          idCard: '44010619900101001X',
          certNo: 'UAV-P-2024001',
          licenseNo: 'L-2024-001',
          expiryDate: '2029-12-31',
          allowTypes: '多旋翼-III类, 固定翼-I类'
        });
      } else if (selectedCategory === '无人机认证') {
        const randomID = Math.floor(1000 + Math.random() * 9000);
        setFormData({
          deviceModel: 'DJI Mavic 3 Pro',
          uavType: '多旋翼无人机',
          snCode: `SN-772910${randomID}`,
          uasCode: `UAS-G-${randomID}`,
          factory: '深圳市大疆创新科技有限公司',
          ownerType: userType === 'enterprise' ? '单位所有' : '个人所有',
          ownerName: userType === 'enterprise' ? '广东某航测技术有限公司' : '张三',
          ownerId: userType === 'enterprise' ? '91440101MA59XXXXXX' : '4401**********001X'
        });
      } else if (selectedCategory === '无人机飞行企业认证') {
        setFormData({
          corpName: '广东某航测技术有限公司',
          corpId: '91440101MA59XXXXXX',
          qualification: '民用无人驾驶航空器运营合格证',
          expiryDate: '2028-12-31',
          scope: '摄影测量与遥感、电力巡检、农林植保、城市规划咨询、低空物流配送。'
        });
      } else {
        setFormData({});
      }
    }
  }, [view, currentInstance, selectedCategory]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSyncProgress(10);
    
    // Simulate multi-step sync
    const steps = [
      { p: 20, m: '正在对录入信息进行合规性与唯一性校验...' },
      { p: 40, m: '校验通过。正在对全量备案信息进行加密存档...' },
      { p: 60, m: '正在推送至省低空数据融合中心...' },
      { p: 80, m: '正在同步至广州、深圳、珠海、粤东飞行服务站...' },
      { p: 100, m: '全省系统数据同步完成' }
    ];

    // Validation logic
    if (selectedCategory === '飞手认证') {
      const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!idCardReg.test(formData.idCard)) {
        setModal({
          show: true,
          title: '校验失败',
          message: '居民身份证号格式不正确，请检查后重新输入',
          type: 'alert'
        });
        setIsSubmitting(false);
        return;
      }
      if (!formData.licenseNo || formData.licenseNo.length < 5) {
        setModal({
          show: true,
          title: '校验失败',
          message: '执照编号格式不正确',
          type: 'alert'
        });
        setIsSubmitting(false);
        return;
      }
    }

    if (selectedCategory === '无人机认证') {
      if (!formData.snCode || formData.snCode.length < 5) {
        setModal({
          show: true,
          title: '校验失败',
          message: 'SN 码格式不正确，请重新输入',
          type: 'alert'
        });
        setIsSubmitting(false);
        return;
      }
      // Simulate uniqueness check
      if (formData.snCode === 'SN-EXIST-001') {
        setModal({
          show: true,
          title: '备案冲突',
          message: '该 SN 码已在系统中备案，请勿重复提交！',
          type: 'alert'
        });
        setIsSubmitting(false);
        return;
      }
    }

    if (selectedCategory === '无人机飞行企业认证') {
      const corpIdReg = /^[0-9A-HJ-NP-RTUW-Y]{2}\d{6}[0-9A-HJ-NP-RTUW-Y]{10}$/;
      if (!formData.corpId || !corpIdReg.test(formData.corpId)) {
        setModal({
          show: true,
          title: '校验失败',
          message: '统一社会信用代码格式不正确，请输入 18 位有效代码',
          type: 'alert'
        });
        setIsSubmitting(false);
        return;
      }
      if (!formData.qualification) {
        setModal({
          show: true,
          title: '校验失败',
          message: '请填写运营资质信息',
          type: 'alert'
        });
        setIsSubmitting(false);
        return;
      }
      if (!formData.expiryDate) {
        setModal({
          show: true,
          title: '校验失败',
          message: '请选择资质有效期',
          type: 'alert'
        });
        setIsSubmitting(false);
        return;
      }
      if (!formData.scope || formData.scope.length < 10) {
        setModal({
          show: true,
          title: '校验失败',
          message: '经营范围描述过短，请详细描述业务范围',
          type: 'alert'
        });
        setIsSubmitting(false);
        return;
      }
    }

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 800));
      setSyncProgress(step.p);
    }

    const newInstance: CertInstance = currentInstance ? {
      ...currentInstance,
      data: formData,
      status: 'approved', // Auto-approve for demo
      syncStatus: { provincial: 'synced', stations: { 'GZ': 'synced', 'SZ': 'synced', 'ZH': 'synced', 'YD': 'synced' } }
    } : {
      id: Math.random().toString(36).substr(2, 9),
      categoryId: selectedCategory!,
      title: selectedCategory!,
      status: 'approved',
      syncStatus: { provincial: 'synced', stations: { 'GZ': 'synced', 'SZ': 'synced', 'ZH': 'synced', 'YD': 'synced' } },
      data: formData,
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      recordNo: 'GD-' + Math.random().toString(36).substr(2, 6).toUpperCase()
    };

    if (currentInstance) {
      onUpdateInstance(newInstance);
    } else {
      onAddInstance(newInstance);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSyncProgress(0);
      onViewChange('detail', selectedCategory, newInstance.id);
    }, 500);
  };

  const handleCancel = (id: string) => {
    setModal({
      show: true,
      title: '注销确认',
      message: '确定要注销该备案吗？注销申请将同步至全省飞行服务站，注销后该备案将失效。',
      type: 'confirm',
      onConfirm: () => {
        const instance = instances.find(i => i.id === id);
        if (instance) {
          onUpdateInstance({ ...instance, status: 'rejected' });
          setModal({
            show: true,
            title: '提交成功',
            message: '注销申请已提交，正在同步全省系统状态...',
            type: 'alert'
          });
        }
      }
    });
  };

  // --- Sub-views (Render Functions to avoid focus loss) ---

  const renderCategoriesView = () => {
    const categories = [
      ...(userType === 'individual' ? [
        { id: 'uav-pilot', title: '飞手认证', desc: '无人机驾驶员资质备案', icon: <User className="text-blue-600" />, type: 'uav', multi: false },
        { id: 'uav-drone', title: '无人机认证', desc: '无人机实名登记与备案', icon: <Smartphone className="text-indigo-600" />, type: 'uav', multi: true },
      ] : []),
      ...(userType === 'enterprise' ? [
        { id: 'uav-corp', title: '无人机飞行企业认证', desc: '企业运营资质与经营范围备案', icon: <Building2 className="text-cyan-600" />, type: 'uav', multi: false },
        { id: 'ga-pilot', title: '通航飞行员认证', desc: '通用航空飞行员资质备案', icon: <UserPlus className="text-orange-600" />, type: 'ga', multi: true },
        { id: 'ga-aircraft', title: '通航飞行器认证', desc: '通用航空器实名登记与备案', icon: <Plane className="text-red-600" />, type: 'ga', multi: true },
        { id: 'ga-corp', title: '通航飞行企业认证', desc: '通航企业运营许可与资质备案', icon: <Building2 className="text-rose-600" />, type: 'ga', multi: false }
      ] : [])
    ];

    const stats = {
      total: instances.length,
      active: instances.filter(i => i.status === 'approved').length,
      processing: instances.filter(i => i.status === 'pending').length
    };

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <ShieldCheck className="text-blue-600" size={20} />
              </div>
              <span className="text-sm text-gray-500 font-medium">认证备案总数</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
            <p className="text-[10px] text-gray-400 mt-2">包含所有类别的已备案记录</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="text-green-600" size={20} />
              </div>
              <span className="text-sm text-gray-500 font-medium">生效中认证</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.active}</div>
            <p className="text-[10px] text-gray-400 mt-2">当前全省联网生效中的资质</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Clock className="text-orange-600" size={20} />
              </div>
              <span className="text-sm text-gray-500 font-medium">同步/审核中</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.processing}</div>
            <p className="text-[10px] text-gray-400 mt-2">正在同步至各飞行服务站的数据</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-800">认证类别</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const catInstances = instances.filter(i => i.categoryId === cat.title);
              const hasCert = catInstances.length > 0;
              
              return (
                <motion.div 
                  key={cat.id}
                  whileHover={{ y: -4 }}
                  onClick={() => {
                    if (cat.multi) {
                      onViewChange('instances', cat.title);
                    } else if (hasCert) {
                      onViewChange('detail', cat.title, catInstances[0].id);
                    } else {
                      onViewChange('form', cat.title);
                    }
                  }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      {React.cloneElement(cat.icon as React.ReactElement, { size: 24 })}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${hasCert ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {hasCert ? (cat.multi ? `${catInstances.length} 条记录` : '已认证') : '未认证'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-800 mb-1">{cat.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
                  <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-[10px] text-blue-600 font-bold group-hover:underline">
                      {hasCert ? (cat.multi ? '管理记录' : '查看详情') : '立即办理'}
                    </span>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderInstancesView = () => {
    const catInstances = instances.filter(i => i.categoryId === selectedCategory);
    const isDrone = selectedCategory === '无人机认证';
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <button onClick={() => onViewChange('categories')} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200">
              <ArrowLeft size={18} className="text-gray-500" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{selectedCategory} 记录管理</h2>
              <p className="text-xs text-gray-500 mt-0.5">管理您的所有 {selectedCategory} 备案信息</p>
            </div>
          </div>
          <button 
            onClick={() => onViewChange('form', selectedCategory)}
            className="px-4 py-2 bg-blue-700 text-white text-sm font-bold rounded-lg hover:bg-blue-800 transition-all flex items-center gap-2"
          >
            <UserPlus size={16} />
            新增备案
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider font-bold">
                <th className="px-6 py-4">备案编号</th>
                {isDrone ? (
                  <>
                    <th className="px-4 py-4">无人机型号</th>
                    <th className="px-4 py-4">机型分类</th>
                    <th className="px-4 py-4">SN 码</th>
                    <th className="px-4 py-4">UAS 码</th>
                    <th className="px-4 py-4">生产厂家</th>
                    <th className="px-4 py-4">所有者</th>
                  </>
                ) : (
                  <th className="px-6 py-4">名称/型号</th>
                )}
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {catInstances.map((inst) => (
                <tr key={inst.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-gray-600">{inst.recordNo || '-'}</span>
                  </td>
                  {isDrone ? (
                    <>
                      <td className="px-4 py-4 text-sm font-bold text-gray-800">{inst.data.deviceModel}</td>
                      <td className="px-4 py-4 text-xs text-gray-600">{inst.data.uavType}</td>
                      <td className="px-4 py-4 text-xs font-mono text-gray-500">{inst.data.snCode}</td>
                      <td className="px-4 py-4 text-xs font-mono text-gray-500">{inst.data.uasCode}</td>
                      <td className="px-4 py-4 text-xs text-gray-500 max-w-[120px] truncate">{inst.data.factory}</td>
                      <td className="px-4 py-4 text-xs text-gray-700 font-medium">{inst.data.ownerName}</td>
                    </>
                  ) : (
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-800">{inst.data.name || inst.data.deviceModel || inst.data.corpName}</div>
                      <div className="text-[10px] text-gray-400">{inst.data.idCard || inst.data.snCode || inst.data.corpId}</div>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      inst.status === 'approved' ? 'bg-green-50 text-green-600' : 
                      inst.status === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {inst.status === 'approved' ? '已生效' : inst.status === 'pending' ? '审核中' : '已注销'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onViewChange('detail', selectedCategory, inst.id)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="查看详情"
                      >
                        <FileText size={16} />
                      </button>
                      <button 
                        onClick={() => onViewChange('form', selectedCategory, inst.id)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                        title="申请变更"
                      >
                        <Activity size={16} />
                      </button>
                      <button 
                        onClick={() => handleCancel(inst.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="申请注销"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {catInstances.length === 0 && (
                <tr>
                  <td colSpan={isDrone ? 9 : 4} className="px-6 py-12 text-center text-gray-400 text-sm italic">
                    暂无备案记录，请点击右上角新增
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDetailView = () => {
    if (!currentInstance) return null;

    const isPilot = selectedCategory === '飞手认证';
    const isDrone = selectedCategory === '无人机认证';
    const isMultiType = isDrone || selectedCategory === '通航飞行员认证' || selectedCategory === '通航飞行器认证';

    const pilotLabels: Record<string, string> = {
      name: '飞手姓名',
      idCard: '居民身份证号',
      certNo: '飞行合格证号',
      licenseNo: '执照编号',
      expiryDate: '执照有效期',
      allowTypes: '准驾机型'
    };

    const droneLabels: Record<string, string> = {
      deviceModel: '无人机型号',
      uavType: '机型分类',
      snCode: 'SN 码',
      uasCode: 'UAS 码',
      factory: '生产厂家',
      ownerName: '所有者姓名/名称',
      ownerId: '所有者证件号'
    };

    const corpLabels: Record<string, string> = {
      corpName: '企业名称',
      corpId: '统一社会信用代码',
      qualification: '运营资质',
      expiryDate: '资质有效期',
      scope: '经营范围'
    };

    const labels = isPilot ? pilotLabels : (isDrone ? droneLabels : (selectedCategory === '无人机飞行企业认证' ? corpLabels : {
      name: '名称',
      idCard: '证件号',
      corpName: '企业名称',
      corpId: '信用代码'
    }));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onViewChange(isMultiType ? 'instances' : 'categories', selectedCategory)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} />
            返回{isMultiType ? '列表' : '首页'}
          </button>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onViewChange('form', selectedCategory, currentInstance.id)}
              className="px-4 py-2 border border-blue-200 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 transition-all"
            >
              申请变更
            </button>
            <button 
              onClick={() => handleCancel(currentInstance.id)}
              className="px-4 py-2 border border-red-200 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50 transition-all"
            >
              申请注销
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Certificate Card */}
          <div className="lg:col-span-1">
            <div className={`bg-gradient-to-br ${isPilot ? 'from-blue-600 to-blue-900' : 'from-indigo-700 to-indigo-900'} rounded-2xl p-6 text-white shadow-xl relative overflow-hidden aspect-[3/4] flex flex-col`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full -ml-12 -mb-12 blur-xl"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                    {isPilot ? <User size={24} /> : <ShieldCheck size={24} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-wider">{isPilot ? '飞手资质证照' : '备案电子证照'}</h3>
                    <p className="text-[8px] opacity-60 uppercase">Electronic Certificate</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
                  <div className="w-24 h-24 bg-white p-1.5 rounded-lg shadow-inner">
                    <QrCode size={64} className="text-gray-800" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">{isPilot ? currentInstance.data.name : currentInstance.title}</h4>
                    <p className="text-xs opacity-70 font-mono">{currentInstance.recordNo}</p>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-[10px]">
                  <div>
                    <p className="opacity-50 mb-1">{isPilot ? '备案飞手' : '持有人/设备'}</p>
                    <p className="font-bold">{currentInstance.data.name || currentInstance.data.deviceModel || currentInstance.data.corpName}</p>
                  </div>
                  <div>
                    <p className="opacity-50 mb-1">生效日期</p>
                    <p className="font-bold">{new Date(currentInstance.approvedAt || '').toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
              <AlertCircle className="text-blue-600 mt-0.5" size={16} />
              <p className="text-[10px] text-blue-800 leading-relaxed">
                该证照已通过省低空数据融合中心加密验签，在全省范围内具有同等效力。
              </p>
            </div>
          </div>

          {/* Details & Sync Status */}
          <div className="lg:col-span-2 space-y-8">
            {/* Info Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
                <h3 className="font-bold text-gray-800">{isPilot ? '飞手资质详细信息' : '详细备案信息'}</h3>
              </div>
              <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-12">
                {Object.entries(labels).map(([key, label]) => {
                  const value = currentInstance.data[key];
                  if (value === undefined) return null;
                  return (
                    <div key={key}>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">{label}</p>
                      <p className="text-sm font-medium text-gray-700">{String(value)}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sync Status Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">全省系统同步状态</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentInstance.status === 'approved' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>
                  {currentInstance.status === 'approved' ? '数据已实时同步' : '正在同步/审核中'}
                </span>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentInstance.status === 'approved' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                      <Home size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-bold text-gray-700">省低空数据融合中心</span>
                        <span className={`text-xs font-medium ${currentInstance.status === 'approved' ? 'text-green-600' : 'text-orange-600'}`}>
                          {currentInstance.status === 'approved' ? '已同步' : '同步中'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: currentInstance.status === 'approved' ? '100%' : '65%' }}
                          className={`h-full ${currentInstance.status === 'approved' ? 'bg-green-500' : 'bg-orange-500'}`}
                        ></motion.div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-14">
                    {[
                      { name: '广州飞行服务站', status: currentInstance.status === 'approved' ? '已同步' : '待同步' },
                      { name: '深圳飞行服务站', status: currentInstance.status === 'approved' ? '已同步' : '待同步' },
                      { name: '珠海飞行服务站', status: currentInstance.status === 'approved' ? '已同步' : '待同步' },
                      { name: '粤东飞行服务站', status: currentInstance.status === 'approved' ? '已同步' : '待同步' }
                    ].map((station, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <span className="text-xs text-gray-600">{station.name}</span>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${station.status === '已同步' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className={`text-[10px] font-bold ${station.status === '已同步' ? 'text-green-600' : 'text-gray-400'}`}>{station.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
                <h3 className="font-bold text-gray-800">审核进度追踪</h3>
              </div>
              <div className="p-6">
                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                  {[
                    { title: '备案生效', time: currentInstance.approvedAt ? new Date(currentInstance.approvedAt).toLocaleString() : '-', desc: '系统已完成全省联网同步，备案正式生效', status: currentInstance.status === 'approved' ? 'done' : 'pending' },
                    { title: '全省联网校验', time: new Date(currentInstance.createdAt).toLocaleString(), desc: '正在进行全省飞行服务站数据一致性校验', status: 'done' },
                    { title: '提交申请', time: new Date(currentInstance.createdAt).toLocaleString(), desc: '用户提交备案申请，进入同步流程', status: 'done' }
                  ].map((step, i) => (
                    <div key={i} className="relative pl-12">
                      <div className={`absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center z-10 ${
                        step.status === 'done' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {step.status === 'done' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className={`text-sm font-bold ${step.status === 'done' ? 'text-gray-800' : 'text-gray-400'}`}>{step.title}</h4>
                          <span className="text-[10px] text-gray-400 font-mono">{step.time}</span>
                        </div>
                        <p className="text-xs text-gray-500">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFormView = () => {
    const isMultiType = selectedCategory === '无人机认证' || selectedCategory === '通航飞行员认证' || selectedCategory === '通航飞行器认证';
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 relative">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => {
              if (selectedCategory) {
                onViewChange('instances', selectedCategory);
              } else {
                onViewChange('categories');
              }
            }}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} />
            返回列表
          </button>
          {isSubmitting && (
            <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold animate-pulse">
              <Activity size={16} />
              正在同步全省系统... {syncProgress}%
            </div>
          )}
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentInstance ? '申请变更' : '新增备案'} - {selectedCategory}</h2>
              <p className="text-sm text-gray-500">
                {currentInstance ? '正在对已有备案信息进行变更申请，变更后需重新进行全省系统同步' : '请确保录入信息真实有效，系统将进行全省联网校验并同步至各飞行服务站'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Common Fields */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {selectedCategory?.includes('企业') ? '企业名称' : '姓名'}
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder={selectedCategory?.includes('企业') ? '请输入企业全称' : '请输入真实姓名'}
                value={formData.name || formData.corpName || ''}
                onChange={(e) => setFormData({...formData, [selectedCategory?.includes('企业') ? 'corpName' : 'name']: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {selectedCategory?.includes('企业') ? '统一社会信用代码' : '居民身份证号'}
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder={selectedCategory?.includes('企业') ? '18位信用代码' : '18位身份证号'}
                value={formData.idCard || formData.corpId || ''}
                onChange={(e) => setFormData({...formData, [selectedCategory?.includes('企业') ? 'corpId' : 'idCard']: e.target.value})}
              />
            </div>

            {/* Enterprise Specific Fields */}
            {selectedCategory === '无人机飞行企业认证' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">运营资质</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="如：民用无人驾驶航空器运营合格证"
                    value={formData.qualification || ''}
                    onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">资质有效期</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.expiryDate || ''}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">经营范围</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="请详细描述企业的无人机飞行经营范围..."
                    value={formData.scope || ''}
                    onChange={(e) => setFormData({...formData, scope: e.target.value})}
                  />
                </div>
              </>
            )}

            {/* Pilot Specific Fields */}
            {(selectedCategory === '飞手认证' || selectedCategory === '通航飞行员认证') && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">飞行合格证号</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.certNo || ''}
                    onChange={(e) => setFormData({...formData, certNo: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">执照编号</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.licenseNo || ''}
                    onChange={(e) => setFormData({...formData, licenseNo: e.target.value})}
                  />
                </div>
              </>
            )}

            {/* Pilot Specific Fields */}
            {selectedCategory === '飞手认证' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">飞手姓名</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="请输入真实姓名"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">居民身份证号</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="请输入 18 位身份证号"
                    value={formData.idCard || ''}
                    onChange={(e) => setFormData({...formData, idCard: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">飞行合格证号</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="请输入合格证编号"
                    value={formData.certNo || ''}
                    onChange={(e) => setFormData({...formData, certNo: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">执照编号</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="请输入执照编号"
                    value={formData.licenseNo || ''}
                    onChange={(e) => setFormData({...formData, licenseNo: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">执照有效期</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.expiryDate || ''}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">准驾机型</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.allowTypes || ''}
                    onChange={(e) => setFormData({...formData, allowTypes: e.target.value})}
                  >
                    <option value="">请选择准驾机型</option>
                    <option value="多旋翼-III类">多旋翼-III类</option>
                    <option value="多旋翼-IV类">多旋翼-IV类</option>
                    <option value="固定翼-I类">固定翼-I类</option>
                    <option value="垂直起降固定翼-II类">垂直起降固定翼-II类</option>
                  </select>
                </div>
              </>
            )}

            {/* Device Specific Fields */}
            {(selectedCategory === '无人机认证' || selectedCategory === '通航飞行器认证') && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">无人机型号</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.deviceModel || ''}
                    onChange={(e) => setFormData({...formData, deviceModel: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">机型分类</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.uavType || ''}
                    onChange={(e) => setFormData({...formData, uavType: e.target.value})}
                  >
                    <option value="">请选择机型</option>
                    <option value="多旋翼无人机">多旋翼无人机</option>
                    <option value="固定翼无人机">固定翼无人机</option>
                    <option value="垂直起降固定翼">垂直起降固定翼</option>
                    <option value="无人直升机">无人直升机</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">SN 码 (出厂序列号)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="请输入设备唯一 SN 码"
                    value={formData.snCode || ''}
                    onChange={(e) => setFormData({...formData, snCode: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">UAS 码</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="请输入民航局核发的 UAS 码"
                    value={formData.uasCode || ''}
                    onChange={(e) => setFormData({...formData, uasCode: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">出厂信息/生产厂家</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.factory || ''}
                    onChange={(e) => setFormData({...formData, factory: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">所有者信息</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="姓名或单位名称"
                    value={formData.ownerName || ''}
                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                  />
                </div>
              </>
            )}
          </div>

          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3 mb-8">
            <ShieldCheck className="text-orange-600 mt-0.5" size={18} />
            <div className="text-[10px] text-orange-800 leading-relaxed">
              <p className="font-bold mb-1">全省资质同源声明：</p>
              您提交的信息将经过加密处理，实时推送至<strong>省低空数据融合中心</strong>，并同步至广州、深圳、珠海、粤东四个飞行服务站系统。请确保信息的准确性，虚假申报将影响您的信用等级。
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-4 ${isSubmitting ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'} text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2`}
          >
            {isSubmitting ? (
              <>
                <Activity size={18} className="animate-spin" />
                正在同步全省系统 ({syncProgress}%)...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                {currentInstance ? '提交变更申请' : '提交备案申请'}
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderModal = () => {
    if (!modal.show) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          <div className="p-6 border-b border-gray-50 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${modal.type === 'confirm' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
              {modal.type === 'confirm' ? <AlertCircle size={20} /> : <ShieldCheck size={20} />}
            </div>
            <h3 className="text-lg font-bold text-gray-800">{modal.title}</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 leading-relaxed">{modal.message}</p>
          </div>
          <div className="p-6 bg-gray-50 flex justify-end gap-3">
            {modal.type === 'confirm' && (
              <button 
                onClick={() => setModal({ ...modal, show: false })}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                取消
              </button>
            )}
            <button 
              onClick={() => {
                if (modal.type === 'confirm' && modal.onConfirm) {
                  modal.onConfirm();
                } else {
                  setModal({ ...modal, show: false });
                }
              }}
              className={`px-6 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-all ${modal.type === 'confirm' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-100' : 'bg-blue-700 hover:bg-blue-800 shadow-blue-100'}`}
            >
              {modal.type === 'confirm' ? '确认注销' : '确定'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="relative">
      {renderModal()}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {view === 'categories' && renderCategoriesView()}
          {view === 'instances' && renderInstancesView()}
          {view === 'detail' && renderDetailView()}
          {view === 'form' && renderFormView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const FlightApplicationModal = ({ 
  isOpen, 
  onClose,
  step,
  setStep,
  selectedLocation,
  setSelectedLocation
}: { 
  isOpen: boolean, 
  onClose: () => void,
  step: 'map' | 'form' | 'external',
  setStep: (step: 'map' | 'form' | 'external') => void,
  selectedLocation: { name: string, station: string } | null,
  setSelectedLocation: (loc: { name: string, station: string } | null) => void
}) => {
  if (!isOpen) return null;

  const handleLocationSelect = (name: string, station: string) => {
    setSelectedLocation({ name, station });
    if (station === '省飞服') {
      setStep('form');
    } else {
      setStep('external');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">飞行活动申请</h2>
            <p className="text-xs text-gray-500 mt-1">智能路由：系统将根据起飞地点自动匹配对应的飞行服务站</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {step === 'map' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <MapPin className="text-blue-600 mt-0.5" size={18} />
                <div className="text-sm text-blue-800">
                  请在地图上点击选择您的<strong>起飞地点</strong>。系统将为您智能匹配管理部门。
                </div>
              </div>

              <div className="aspect-video bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1200/800')] opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                <div className="relative z-10 text-center p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-xl max-w-md">
                  <h3 className="font-bold text-gray-800 mb-4">模拟地图交互</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleLocationSelect('广州市天河区', '广州飞服站')}
                      className="p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-sm font-medium"
                    >
                      广州市天河区
                    </button>
                    <button 
                      onClick={() => handleLocationSelect('深圳市南山区', '深圳飞服站')}
                      className="p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-sm font-medium"
                    >
                      深圳市南山区
                    </button>
                    <button 
                      onClick={() => handleLocationSelect('珠海市香洲区', '珠海飞服站')}
                      className="p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-sm font-medium"
                    >
                      珠海市香洲区
                    </button>
                    <button 
                      onClick={() => handleLocationSelect('清远市清城区', '省飞服')}
                      className="p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-sm font-medium"
                    >
                      清远市清城区
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'form' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-green-800">匹配成功：广东省飞行服务站</p>
                  <p className="text-xs text-green-600">您的起飞地 [{selectedLocation?.name}] 属于省飞服直管区域，请在下方完成填报。</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">任务名称</label>
                  <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="例如：电力巡检任务" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">飞行类型</label>
                  <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none">
                    <option>航拍作业</option>
                    <option>基础设施巡检</option>
                    <option>农林植保</option>
                    <option>物流配送</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">起飞时间</label>
                  <input type="datetime-local" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">预计时长 (分钟)</label>
                  <input type="number" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none" placeholder="60" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">飞行空域描述</label>
                <textarea className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none h-24" placeholder="请描述飞行范围、高度等信息..."></textarea>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep('map')}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  重新选择地点
                </button>
                <button 
                  onClick={() => {
                    alert('飞行申请已提交，请在进度中心查看审批状态。');
                    onClose();
                    setStep('map');
                  }}
                  className="flex-[2] py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-200"
                >
                  提交申请
                </button>
              </div>
            </div>
          )}

          {step === 'external' && (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600">
                <ExternalLink size={40} />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-2">即将跳转至外部系统</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  您的起飞地 [{selectedLocation?.name}] 属于 <strong>{selectedLocation?.station}</strong> 管理区域。
                  根据规定，该区域的飞行申请需在对应市级飞服站系统进行填报。
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-left max-w-md mx-auto">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">目标系统</p>
                <p className="text-sm font-medium text-gray-700">{selectedLocation?.station} 综合管理平台</p>
              </div>

              <div className="flex gap-4 max-w-md mx-auto">
                <button 
                  onClick={() => setStep('map')}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  返回
                </button>
                <button className="flex-[2] py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2">
                  前往填报 <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
const FooterSection = () => (
  <div className="bg-white py-6 px-8 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
    {/* Announcements */}
    <div>
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          通知公告 <span className="text-gray-300 font-normal text-sm">/ Announcement</span>
        </h2>
        <a href="#" className="text-gray-400 text-sm hover:text-orange-500 flex items-center">更多 <ChevronRight size={14} /></a>
      </div>
      <div className="space-y-6">
        {[
          { date: '11', year: '2025.12', title: '无人机“谁能飞”“谁在飞”，强制性国家标准发布', desc: '强制性国家标准' },
          { date: '26', year: '2025.08', title: '转发天津市人民政府通告', desc: '临时禁飞管控' },
          { date: '03', year: '2025.08', title: '转发北京市人民政府关于公布无人驾驶航空器管制空域范围的通告', desc: '管制空域范围' }
        ].map((item, i) => (
          <div key={i} className="flex gap-6 group cursor-pointer">
            <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 w-16 h-16 rounded group-hover:bg-orange-50 group-hover:border-orange-200 transition-colors">
              <span className="text-2xl font-bold text-gray-700 group-hover:text-orange-600">{item.date}</span>
              <span className="text-[10px] text-gray-400">{item.year}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-gray-800 font-medium group-hover:text-orange-600 transition-colors line-clamp-1">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Regulations */}
    <div>
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          政策法规 <span className="text-gray-300 font-normal text-sm">/ Regulation</span>
        </h2>
        <a href="#" className="text-gray-400 text-sm hover:text-orange-500 flex items-center">更多 <ChevronRight size={14} /></a>
      </div>
      <ul className="space-y-4">
        {[
          '民用无人驾驶航空器实名登记和激活要求',
          '民用无人驾驶航空器系统运行识别规范',
          '中国民用航空局关于印发《民用无人驾驶航空器事件信息管理办法》...',
          '民用无人驾驶航空器操控员执照考试委任代表管理办法',
          '民用无人驾驶航空器操控员执照考试点管理办法',
          '民用无人驾驶航空器操控员执照管理办法',
          '民用无人驾驶航空器运行安全管理规则'
        ].map((item, i) => (
          <li key={i} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-orange-500 transition-colors"></div>
              <span className="text-gray-600 group-hover:text-orange-600 transition-colors text-sm">{item}</span>
            </div>
            <span className="text-gray-400 text-xs">2025-10-31</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default function App() {
  const [loginTab, setLoginTab] = useState<LoginTab>('qrcode');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerStep, setRegisterStep] = useState<RegisterStep>('type');
  const [registerType, setRegisterType] = useState<RegisterType>('individual');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [loginStep, setLoginStep] = useState<'form' | 'yuexin'>('form');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'individual' | 'enterprise'>('individual');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentNav, setCurrentNav] = useState('首页');
  const [showFlightMap, setShowFlightMap] = useState(false);
  const [applicationStep, setApplicationStep] = useState<'map' | 'form' | 'external'>('map');
  const [selectedLocation, setSelectedLocation] = useState<{ name: string, station: string } | null>(null);

  // Certification State
  const [certView, setCertView] = useState<CertView>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [certInstances, setCertInstances] = useState<CertInstance[]>([]);

  const handleViewChange = (view: CertView, category?: string | null, instanceId?: string | null) => {
    setCertView(view);
    if (category !== undefined) setSelectedCategory(category);
    setSelectedInstanceId(instanceId !== undefined ? instanceId : null);
  };

  const handleAddInstance = (instance: CertInstance) => {
    setCertInstances([...certInstances, instance]);
  };

  const handleUpdateInstance = (instance: CertInstance) => {
    setCertInstances(certInstances.map(i => i.id === instance.id ? instance : i));
  };

  // Simulated Yuexin Sign Verification
  const handleYuexinVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (isRegisterOpen) {
        setRegisterStep('sign');
      } else {
        // Logic to determine user type based on account login
        if (loginTab === 'account') {
          if (username === 'corp_test') {
            setUserType('enterprise');
          } else {
            setUserType('individual');
          }
        } else {
          // QR code defaults to individual for this demo
          setUserType('individual');
        }
        setIsLoggedIn(true);
      }
    }, 2000);
  };

  const handleSignAgreement = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setRegisterStep('complete');
    }, 2000);
  };

  const resetRegister = () => {
    setIsRegisterOpen(false);
    setRegisterStep('type');
    setRegisterType('individual');
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {/* Top Utility Bar - Simplified from Screenshot */}
        <div className="bg-[#f8f8f8] border-b border-gray-200 py-1.5 px-8 flex justify-between items-center text-[11px] text-gray-500">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
              <MapPin size={12} className="text-blue-600" />
              <span className="font-medium text-gray-700">广东省</span>
              <ChevronDown size={10} />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">广东省低空飞行综合管理平台</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Bell size={14} className="cursor-pointer hover:text-blue-600" />
              <div className="flex items-center gap-1 cursor-pointer group">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 overflow-hidden">
                  <User size={12} />
                </div>
                <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                  {userType === 'enterprise' ? '广东某航测技术有限公司' : '张三'} ({userType === 'enterprise' ? '企业用户' : '个人用户'})
                </span>
                <ChevronDown size={10} />
              </div>
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
                title="退出登录"
              >
                <LogOut size={12} />
                <span>退出</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Header with Logo */}
        <header className="bg-white py-4 px-8 flex items-center border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold italic overflow-hidden">
              <img src="https://picsum.photos/seed/guangdong-uav/100/100" alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">广东省低空飞行综合管理平台</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Guangdong Low-altitude Flight Management Platform</p>
            </div>
          </div>
        </header>

        {/* Top Navigation Tabs - Layout from Screenshot */}
        <nav className="bg-white border-b border-gray-200 px-8 flex items-center sticky top-0 z-40">
          {[
            { label: '首页', icon: <Home size={16} /> },
            { label: '认证中心', icon: <ShieldCheck size={16} /> },
            { label: '进度中心', icon: <Clock size={16} /> },
            { label: '飞行申请', icon: <FileText size={16} /> },
            { label: '空域查询', icon: <Search size={16} /> },
            ...(userType === 'enterprise' ? [
              { label: '机队管理', icon: <Plane size={16} /> },
              { label: '飞手管理', icon: <Users size={16} /> }
            ] : [
              { label: '我的证照', icon: <Smartphone size={16} /> }
            ]),
            { label: '政策法规', icon: <FileText size={16} /> },
            { label: '操作指南', icon: <HelpCircle size={16} /> }
          ].map((item) => (
            <button 
              key={item.label} 
              onClick={() => setCurrentNav(item.label)}
              className={`px-6 py-4 text-[15px] font-medium transition-all relative flex items-center gap-2 ${currentNav === item.label ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              {item.icon}
              {item.label}
              {currentNav === item.label && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 rounded-full"></div>}
            </button>
          ))}
        </nav>

        {/* Platform Content Area */}
        <main className="flex-1 bg-gray-50 py-8 px-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {currentNav === '认证中心' ? (
              <CertificationCenter 
                userType={userType} 
                view={certView}
                selectedCategory={selectedCategory}
                selectedInstanceId={selectedInstanceId}
                onViewChange={handleViewChange}
                instances={certInstances}
                onAddInstance={handleAddInstance}
                onUpdateInstance={handleUpdateInstance}
              />
            ) : (
              <>
                {/* Welcome & Stats Section */}
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      欢迎回来，{userType === 'enterprise' ? '广东某航测技术有限公司' : '张三'}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500">
                        {userType === 'enterprise' ? '企业信用等级：' : '您当前的实名等级：'}
                      </span>
                      <span className={`px-2 py-0.5 ${userType === 'enterprise' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'} text-[10px] font-bold rounded uppercase`}>
                        {userType === 'enterprise' ? 'AAA 级信用企业' : 'L3 高级认证'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="px-6 py-2.5 bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all flex items-center gap-2">
                      <UserPlus size={18} />
                      {userType === 'enterprise' ? '批量发起申请' : '发起飞行申请'}
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {userType === 'enterprise' ? [
                    { label: '在册飞手', value: '24', color: 'text-blue-600', icon: <Users className="text-blue-200" /> },
                    { label: '机队规模', value: '12', color: 'text-indigo-600', icon: <Plane className="text-indigo-200" /> },
                    { label: '本月飞行', value: '156', color: 'text-green-600', icon: <Activity className="text-green-200" /> },
                    { label: '安全预警', value: '1', color: 'text-red-600', icon: <AlertTriangle className="text-red-200" /> },
                  ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-xl border border-gray-100 shadow-sm bg-white flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {React.cloneElement(stat.icon as React.ReactElement, { size: 20 })}
                      </div>
                    </div>
                  )) : [
                    { label: '待审批申请', value: '2', color: 'text-orange-600', icon: <Bell className="text-orange-200" /> },
                    { label: '已通过申请', value: '15', color: 'text-green-600', icon: <CheckCircle2 className="text-green-200" /> },
                    { label: '飞行时长', value: '42h', color: 'text-blue-600', icon: <Clock className="text-blue-200" /> },
                    { label: '违规记录', value: '0', color: 'text-gray-600', icon: <AlertCircle className="text-gray-200" /> },
                  ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-xl border border-gray-100 shadow-sm bg-white flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {React.cloneElement(stat.icon as React.ReactElement, { size: 20 })}
                      </div>
                    </div>
                  ))}
                </div>
              {/* Dashboard Grid will be moved here */}

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Recent Records */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <FileText size={18} className="text-blue-600" />
                      最近飞行申请记录
                    </h3>
                    <button className="text-sm text-blue-600 hover:underline">查看全部</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 font-medium">
                          <th className="px-6 py-3">申请编号</th>
                          <th className="px-6 py-3">飞行类型</th>
                          <th className="px-6 py-3">申请时间</th>
                          <th className="px-6 py-3">状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          { id: 'FL-20260331-001', type: '航拍作业', time: '2026-03-31 10:30', status: '待审批', statusColor: 'text-orange-600' },
                          { id: 'FL-20260325-042', type: '基础设施巡检', time: '2026-03-25 14:20', status: '已通过', statusColor: 'text-green-600' },
                          { id: 'FL-20260320-015', type: '农林植保', time: '2026-03-20 09:15', status: '已通过', statusColor: 'text-green-600' },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-blue-600">{row.id}</td>
                            <td className="px-6 py-4 font-medium">{row.type}</td>
                            <td className="px-6 py-4 text-gray-500">{row.time}</td>
                            <td className={`px-6 py-4 font-bold ${row.statusColor}`}>{row.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Quick Actions & Info */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Smartphone size={18} className="text-orange-500" />
                    快捷办理
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {userType === 'enterprise' ? [
                      { label: '飞行活动申请', icon: <MapPin size={16} />, primary: true },
                      { label: '飞手入库', icon: <UserPlus size={16} /> },
                      { label: '机队登记', icon: <Plane size={16} /> },
                      { label: '资质年审', icon: <ShieldCheck size={16} /> },
                    ].map((item, i) => (
                      <button 
                        key={i} 
                        onClick={() => item.label === '飞行活动申请' && setShowFlightMap(true)}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all border group ${
                          item.primary 
                            ? 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700 shadow-md shadow-blue-100' 
                            : 'bg-gray-50 text-gray-600 border-transparent hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100'
                        }`}
                      >
                        <div className={`${item.primary ? 'text-blue-100' : 'text-gray-400 group-hover:text-blue-600'} mb-2`}>
                          {item.icon}
                        </div>
                        <span className="text-xs font-medium">{item.label}</span>
                      </button>
                    )) : [
                      { label: '飞行活动申请', icon: <MapPin size={16} />, primary: true },
                      { label: '实名登记', icon: <UserPlus size={16} /> },
                      { label: '计划申报', icon: <FileText size={16} /> },
                      { label: '违规查询', icon: <AlertCircle size={16} /> },
                    ].map((item, i) => (
                      <button 
                        key={i} 
                        onClick={() => item.label === '飞行活动申请' && setShowFlightMap(true)}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all border group ${
                          item.primary 
                            ? 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700 shadow-md shadow-blue-100' 
                            : 'bg-gray-50 text-gray-600 border-transparent hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100'
                        }`}
                      >
                        <div className={`${item.primary ? 'text-blue-100' : 'text-gray-400 group-hover:text-blue-600'} mb-2`}>
                          {item.icon}
                        </div>
                        <span className="text-xs font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl text-white shadow-lg">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <ShieldCheck size={18} />
                    安全飞行提示
                  </h3>
                  <p className="text-xs text-blue-100 leading-relaxed opacity-90">
                    请严格遵守《无人驾驶航空器飞行管理暂行条例》，在合法空域内飞行，并确保设备已完成实名登记。
                  </p>
                  <button className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all border border-white/20">
                    查看完整条例
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

          {/* Floating Right Sidebar - Retained from Screenshot Layout */}
          <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-50">
            {[
              { icon: <MessageSquare size={18} />, label: '咨询' },
              { icon: <ThumbsUp size={18} />, label: '投诉' },
              { icon: <HelpCircle size={18} />, label: '帮助' },
              { icon: <Smartphone size={18} />, label: '掌上办' },
            ].map((tool, i) => (
              <div 
                key={i} 
                className="w-14 h-14 bg-white border border-gray-100 shadow-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-all first:rounded-t-lg last:rounded-b-lg group"
              >
                <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                  {tool.icon}
                </div>
                <span className="text-[10px] mt-1 text-gray-500 group-hover:text-blue-600">{tool.label}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-orange-100 selection:text-orange-900">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[480px] py-6 flex items-center justify-center">
        {/* Background with Drone */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/banner.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="container mx-auto px-8 relative z-10 flex items-center justify-end">
          {/* Right Side: Login Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-white/20 backdrop-blur-sm p-6"
          >
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="text-blue-600" size={18} />
                <h2 className="text-base font-bold text-gray-800">统一身份认证登录</h2>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  粤信签统一身份认证登录
                </p>
                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  每次登录需实名身份核验
                </p>
                <p className="text-[10px] text-orange-500 flex items-center gap-1">
                  <AlertCircle size={9} />
                  异常登录触发增强核验
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 mb-4 border-b border-gray-100">
              {[
                { id: 'qrcode', label: '扫码登录' },
                { id: 'account', label: '账号登录' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setLoginTab(tab.id as LoginTab);
                    setLoginStep('form');
                  }}
                  className={`pb-3 text-sm font-bold transition-all relative ${loginTab === tab.id ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {tab.label}
                  {loginTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>

            {loginTab === 'qrcode' ? (
              <div className="text-center py-1">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mb-3 inline-block">
                  <div className="w-36 h-36 bg-white p-2 border border-gray-200 rounded shadow-sm mx-auto">
                    <img src="/qrcode.png" alt="QR Code" className="w-full h-full" referrerPolicy="no-referrer" />
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 mb-4">请使用“粤信签”小程序扫码认证</p>
                
                <button 
                  onClick={handleYuexinVerify}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98] text-sm"
                >
                  {isVerifying ? '认证中...' : '扫码认证登录'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {loginStep === 'form' ? (
                  <>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="请输入账号/身份证号" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs"
                      />
                    </div>
                    <div className="relative">
                      <ShieldCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="password" 
                        placeholder="请输入密码" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs"
                      />
                    </div>
                    
                    <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100 mb-1">
                      <p className="text-[9px] text-blue-700 leading-relaxed">
                        提示：账号登录成功后，系统将自动发起粤信签二次实名核验，核验通过后方可进入系统。
                      </p>
                    </div>

                    <button 
                      onClick={() => setLoginStep('yuexin')}
                      className="w-full py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-all shadow-lg shadow-gray-200 active:scale-[0.98] text-sm"
                    >
                      认证登录
                    </button>
                  </>
                ) : (
                  <div className="text-center py-1">
                    <div className="mb-3 flex flex-col items-center">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-1">
                        <QrCode size={20} className="text-blue-600" />
                      </div>
                      <h3 className="text-xs font-bold text-gray-800">二次实名核验</h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">账号验证成功，请完成粤信签二次认证</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-dashed border-gray-300 mb-3">
                      <div className="w-28 h-28 bg-white p-2 border border-gray-200 rounded shadow-sm mx-auto">
                        <img src="/qrcode.png" alt="QR Code" className="w-full h-full" referrerPolicy="no-referrer" />
                      </div>
                    </div>

                    <button 
                      onClick={handleYuexinVerify}
                      disabled={isVerifying}
                      className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 text-xs"
                    >
                      {isVerifying ? '核验中...' : '模拟二次核验通过'}
                    </button>
                    <button 
                      onClick={() => setLoginStep('form')}
                      className="w-full mt-1 py-1 text-gray-500 text-[10px] font-medium hover:text-gray-700"
                    >
                      返回账号输入
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
              <button 
                onClick={() => setIsRegisterOpen(true)}
                className="w-full py-2.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all active:scale-[0.98] text-xs"
              >
                前往注册
              </button>

              <div className="flex justify-between text-[10px] text-blue-600 font-medium">
                <a href="#" className="hover:underline">账号问题申诉</a>
                <a href="#" className="hover:underline">忘记密码？</a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />

      {/* Registration Modal */}
      <AnimatePresence>
        {isRegisterOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetRegister}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gray-800 px-8 py-6 flex items-center justify-between text-white">
                <div>
                  <h2 className="text-xl font-bold">用户注册</h2>
                  <p className="text-xs text-gray-400 mt-1">请按照指引完成实名注册与电子协议签署</p>
                </div>
                <button onClick={resetRegister} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Steps Indicator */}
              <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                {[
                  { id: 'type', label: '选择类型' },
                  { id: 'info', label: '填写信息' },
                  { id: 'verify', label: '实名核验' },
                  { id: 'sign', label: '签署协议' },
                  { id: 'complete', label: '注册完成' }
                ].map((step, i) => {
                  const steps = ['type', 'info', 'verify', 'sign', 'complete'];
                  const currentIndex = steps.indexOf(registerStep);
                  const stepIndex = steps.indexOf(step.id);
                  const isActive = stepIndex === currentIndex;
                  const isCompleted = stepIndex < currentIndex;

                  return (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isActive ? 'bg-orange-500 text-white ring-4 ring-orange-100' : 
                          isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {isCompleted ? <CheckCircle2 size={16} /> : i + 1}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-orange-600' : 'text-gray-400'}`}>
                          {step.label}
                        </span>
                      </div>
                      {i < 4 && (
                        <div className={`flex-1 h-0.5 mx-2 ${stepIndex < currentIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Modal Content */}
              <div className="p-8 min-h-[400px]">
                {registerStep === 'type' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                      onClick={() => { setRegisterType('individual'); setRegisterStep('info'); }}
                      className="group p-8 border-2 border-gray-100 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all text-left"
                    >
                      <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-100 group-hover:scale-110 transition-all">
                        <User size={28} className="text-blue-600 group-hover:text-orange-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">个人用户注册</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">适用于普通无人机爱好者、飞手等个人主体，需通过粤信签实名核验。</p>
                      <div className="mt-6 flex items-center text-orange-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        开始办理 <ArrowRight size={16} className="ml-2" />
                      </div>
                    </button>
                    <button 
                      onClick={() => { setRegisterType('enterprise'); setRegisterStep('info'); }}
                      className="group p-8 border-2 border-gray-100 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all text-left"
                    >
                      <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-100 group-hover:scale-110 transition-all">
                        <Building2 size={28} className="text-blue-600 group-hover:text-orange-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">飞行企业注册</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">适用于无人机运营企业、培训机构等法人主体，需核验企业资质及经办人身份。</p>
                      <div className="mt-6 flex items-center text-orange-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        开始办理 <ArrowRight size={16} className="ml-2" />
                      </div>
                    </button>
                  </div>
                )}

                {registerStep === 'info' && (
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-4 rounded-lg mb-6">
                      <AlertCircle size={18} />
                      <p className="text-xs font-medium">基本信息将与粤信签同步，请确保输入真实有效。</p>
                    </div>
                    
                    {registerType === 'individual' ? (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">姓名</label>
                          <input type="text" placeholder="请输入真实姓名" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">身份证号</label>
                          <input type="text" placeholder="请输入18位身份证号" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">手机号</label>
                          <input type="text" placeholder="请输入手机号" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">企业名称</label>
                          <input type="text" placeholder="请输入企业全称" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">统一社会信用代码</label>
                          <input type="text" placeholder="请输入18位信用代码" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">经办人姓名</label>
                          <input type="text" placeholder="请输入经办人姓名" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                        </div>
                      </div>
                    )}

                    <div className="pt-6 flex gap-4">
                      <button onClick={() => setRegisterStep('type')} className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors">上一步</button>
                      <button onClick={() => setRegisterStep('verify')} className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200">下一步</button>
                    </div>
                  </div>
                )}

                {registerStep === 'verify' && (
                  <div className="text-center py-2">
                    <div className="mb-4 flex flex-col items-center">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                        <ShieldCheck size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">粤信签实名核验</h3>
                      <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                        根据国家监管要求，注册需通过“粤信签”平台完成实名身份核验。
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-300 mb-4 inline-block">
                      {isVerifying ? (
                        <div className="flex flex-col items-center py-6 px-10">
                          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                          <p className="text-sm text-gray-600 font-medium">正在连接核验平台...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-32 h-32 bg-white p-2 border border-gray-200 rounded-lg shadow-md">
                            <img src="/qrcode.png" alt="Verify QR" className="w-full h-full" referrerPolicy="no-referrer" />
                          </div>
                          <p className="text-[10px] text-gray-400">请使用微信扫码完成人脸核验</p>
                        </div>
                      )}
                    </div>

                    <div className="max-w-xs mx-auto space-y-3">
                      <button 
                        onClick={handleYuexinVerify}
                        disabled={isVerifying}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 text-sm"
                      >
                        {isVerifying ? '核验中...' : '模拟核验通过'}
                      </button>
                      <button onClick={() => setRegisterStep('info')} className="text-gray-400 text-xs hover:text-gray-600">返回修改信息</button>
                    </div>
                  </div>
                )}

                {registerStep === 'sign' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <FileText size={20} className="text-orange-500" />
                        {registerType === 'individual' ? '个人用户服务电子协议书' : '飞行企业服务电子协议书'}
                      </h3>
                      <span className="text-xs text-gray-400">版本号：V2026.03</span>
                    </div>

                    <div className="h-64 bg-gray-50 border border-gray-200 rounded-xl p-6 overflow-y-auto text-sm text-gray-600 leading-relaxed scrollbar-thin">
                      <p className="mb-4 font-bold text-gray-800">第一条 服务内容</p>
                      <p className="mb-4">本平台为民用无人驾驶航空器提供综合监管、飞行计划申报、空域查询等服务。用户需遵守《民用无人驾驶航空器运行安全管理规则》等相关法律法规...</p>
                      <p className="mb-4 font-bold text-gray-800">第二条 用户义务</p>
                      <p className="mb-4">1. 用户保证提供的信息真实、准确、完整。 2. 用户需定期更新实名信息。 3. 严禁利用本平台从事任何违法违规活动...</p>
                      <p className="mb-4 font-bold text-gray-800">第三条 隐私保护</p>
                      <p className="mb-4">平台将严格按照国家政务数据安全合规要求，对用户注册信息及签署协议进行加密存档，存档周期符合相关规定...</p>
                      <p className="mb-4">（此处省略协议正文内容...）</p>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                      <input type="checkbox" id="agree" className="w-5 h-5 accent-orange-500" />
                      <label htmlFor="agree" className="text-sm text-orange-800 font-medium">我已阅读并同意上述协议内容，并确认通过粤信签进行电子签署。</label>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button onClick={() => setRegisterStep('verify')} className="flex-1 py-4 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50">上一步</button>
                      <button 
                        onClick={handleSignAgreement}
                        disabled={isSigning}
                        className="flex-1 py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all shadow-xl shadow-orange-200 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSigning ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            签署中...
                          </>
                        ) : (
                          <>
                            <FileText size={18} />
                            确认签署
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {registerStep === 'complete' && (
                  <div className="text-center py-12">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                      <CheckCircle2 size={48} className="text-green-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">注册成功！</h3>
                    <p className="text-gray-500 max-w-sm mx-auto leading-relaxed mb-10">
                      您的注册信息已加密存档，并同步至飞行服务站系统。现在您可以登录平台开始使用。
                    </p>
                    <button 
                      onClick={resetRegister}
                      className="px-12 py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-all shadow-xl shadow-gray-200"
                    >
                      前往登录
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FlightApplicationModal 
        isOpen={showFlightMap}
        onClose={() => setShowFlightMap(false)}
        step={applicationStep}
        setStep={setApplicationStep}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />

      <style>{`
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
      `}</style>
    </div>
  );
}
