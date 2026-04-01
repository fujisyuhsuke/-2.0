import { FormConfig, CertCategory } from './types';

export const FIELD_MAP: Record<string, string> = {
  name: '姓名',
  idCard: '居民身份证号',
  certId: '飞行合格证号',
  licenseId: '执照编号',
  expiryDate: '有效期',
  aircraftType: '准驾机型/类型',
  model: '无人机型号',
  category: '机型分类',
  snCode: 'SN 码',
  uasCode: 'UAS 码',
  factoryInfo: '出厂信息',
  ownerInfo: '所有者信息',
  companyName: '企业名称',
  opQualification: '运营资质',
  creditCode: '统一社会信用代码',
  opScope: '经营范围',
  callSign: '飞行器呼号',
  regNumber: '国籍登记号',
  airworthinessId: '适航证编号',
  ownerOrg: '所属单位',
  gaOpLicense: '通用航空经营许可信息'
};

export const FORM_CONFIGS: Record<string, FormConfig> = {
  '飞手认证': {
    fields: [
      { id: 'name', label: '飞手姓名', type: 'text', placeholder: '请输入真实姓名' },
      { id: 'idCard', label: '居民身份证号', type: 'text', placeholder: '请输入18位身份证号' },
      { id: 'certId', label: '飞行合格证号', type: 'text', placeholder: '请输入合格证号' },
      { id: 'licenseId', label: '执照编号', type: 'text', placeholder: '请输入执照编号' },
      { id: 'expiryDate', label: '执照有效期', type: 'date' },
      { id: 'aircraftType', label: '准驾机型', type: 'select', options: ['多旋翼', '固定翼', '垂起固定翼', '直升机'] }
    ]
  },
  '无人机认证': {
    fields: [
      { id: 'model', label: '无人机型号', type: 'text', placeholder: '例如：Mavic 3 Pro' },
      { id: 'category', label: '机型分类', type: 'select', options: ['微型', '轻型', '小型', '中型', '大型'] },
      { id: 'snCode', label: 'SN 码', type: 'text', placeholder: '请输入唯一序列号' },
      { id: 'uasCode', label: 'UAS 码', type: 'text', placeholder: '请输入无人机识别码 (UAS ID)' },
      { id: 'factoryInfo', label: '出厂信息', type: 'textarea', placeholder: '请输入生产厂家及出厂日期等信息' },
      { id: 'ownerInfo', label: '所有者信息', type: 'textarea', placeholder: '请输入所有者联系方式及地址' }
    ]
  },
  '无人机飞行企业认证': {
    fields: [
      { id: 'companyName', label: '企业名称', type: 'text', placeholder: '请输入企业全称' },
      { id: 'opQualification', label: '运营资质', type: 'text', placeholder: '请输入运营合格证编号' },
      { id: 'creditCode', label: '统一社会信用代码', type: 'text', placeholder: '18位统一社会信用代码' },
      { id: 'expiryDate', label: '资质有效期', type: 'date' },
      { id: 'opScope', label: '经营范围', type: 'textarea', placeholder: '请输入经营范围...', colSpan: 2 }
    ]
  },
  '通航飞行员认证': {
    fields: [
      { id: 'name', label: '飞行员姓名', type: 'text', placeholder: '请输入真实姓名' },
      { id: 'idCard', label: '居民身份证号', type: 'text', placeholder: '请输入18位身份证号' },
      { id: 'certId', label: '飞行合格证号', type: 'text', placeholder: '请输入合格证号' },
      { id: 'licenseId', label: '执照编号', type: 'text', placeholder: '请输入执照编号' },
      { id: 'expiryDate', label: '执照有效期', type: 'date' },
      { id: 'aircraftType', label: '准驾机型', type: 'select', options: ['单发陆地', '多发陆地', '单发水上', '多发水上'] }
    ]
  },
  '通航飞行器认证': {
    fields: [
      { id: 'aircraftType', label: '通航飞行器类型', type: 'select', options: ['活塞飞机', '涡桨飞机', '喷气飞机', '直升机', '热气球'] },
      { id: 'callSign', label: '飞行器呼号', type: 'text', placeholder: '请输入无线电呼号' },
      { id: 'regNumber', label: '国籍登记号', type: 'text', placeholder: '例如：B-XXXX' },
      { id: 'airworthinessId', label: '适航证编号', type: 'text', placeholder: '请输入适航证编号' },
      { id: 'ownerOrg', label: '所属单位', type: 'text', placeholder: '请输入所属单位全称' }
    ]
  },
  '通航飞行企业认证': {
    fields: [
      { id: 'companyName', label: '企业名称', type: 'text', placeholder: '请输入企业全称' },
      { id: 'opQualification', label: '运营资质', type: 'text', placeholder: '请输入通用航空企业经营许可编号' },
      { id: 'creditCode', label: '统一社会信用代码', type: 'text', placeholder: '18位统一社会信用代码' },
      { id: 'gaOpLicense', label: '通用航空经营许可信息', type: 'text', placeholder: '请输入经营许可详细信息' },
      { id: 'expiryDate', label: '资质有效期', type: 'date' },
      { id: 'opScope', label: '经营范围', type: 'textarea', placeholder: '请输入经营范围...', colSpan: 2 }
    ]
  }
};

export const CERT_CATEGORIES: CertCategory[] = [
  // 个人用户项
  { id: 'pilot_ind', title: '飞手认证', desc: '个人无人机驾驶员资质备案', icon: 'Users', allowedFor: ['individual'], isSingleInstance: true, titleField: 'name' },
  { id: 'uav_ind', title: '无人机认证', desc: '个人名下无人机实名登记', icon: 'Plane', allowedFor: ['individual'], titleField: 'model' },
  
  // 企业用户项
  { id: 'uav_corp', title: '无人机飞行企业认证', desc: '无人机运营企业资质核验', icon: 'ShieldCheck', allowedFor: ['enterprise'], isSingleInstance: true, titleField: 'companyName' },
  { id: 'pilot_corp', title: '通航飞行员认证', desc: '通用航空飞行员执照备案', icon: 'Users', allowedFor: ['enterprise'], titleField: 'name' },
  { id: 'aircraft_corp', title: '通航飞行器认证', desc: '通用航空器适航信息备案', icon: 'Plane', allowedFor: ['enterprise'], titleField: 'aircraftType' },
  { id: 'corp_cert', title: '通航飞行企业认证', desc: '通用航空企业运行资质备案', icon: 'MapPin', allowedFor: ['enterprise'], isSingleInstance: true, titleField: 'companyName' },
];
