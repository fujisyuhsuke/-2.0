export type FieldType = 'text' | 'date' | 'select' | 'textarea';

export interface FormField {
  id: string;
  label: string;
  placeholder?: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  colSpan?: 1 | 2;
}

export interface CategoryConfig {
  id: string;
  title: string;
  fields: FormField[];
  validation?: (data: any) => string | null;
}

export const FORM_CONFIGS: Record<string, CategoryConfig> = {
  '飞手认证': {
    id: 'uav-pilot',
    title: '飞手认证',
    fields: [
      { id: 'name', label: '飞手姓名', placeholder: '请输入真实姓名', type: 'text', required: true },
      { id: 'idCard', label: '居民身份证号', placeholder: '请输入 18 位身份证号', type: 'text', required: true },
      { id: 'certNo', label: '飞行合格证号', placeholder: '请输入合格证编号', type: 'text', required: true },
      { id: 'licenseNo', label: '执照编号', placeholder: '请输入执照编号', type: 'text', required: true },
      { id: 'expiryDate', label: '执照有效期', type: 'date', required: true },
      { id: 'allowTypes', label: '准驾机型', type: 'select', options: ['多旋翼-III类', '多旋翼-IV类', '固定翼-I类', '垂直起降固定翼-II类'], required: true }
    ]
  },
  '通航飞行员认证': {
    id: 'ga-pilot',
    title: '通航飞行员认证',
    fields: [
      { id: 'name', label: '飞行员姓名', placeholder: '请输入真实姓名', type: 'text', required: true },
      { id: 'idCard', label: '居民身份证号', placeholder: '请输入 18 位身份证号', type: 'text', required: true },
      { id: 'certNo', label: '飞行合格证号', placeholder: '请输入合格证编号', type: 'text', required: true },
      { id: 'licenseNo', label: '执照编号', placeholder: '请输入执照编号', type: 'text', required: true },
      { id: 'expiryDate', label: '执照有效期', type: 'date', required: true },
      { id: 'allowTypes', label: '准驾机型', placeholder: '请输入准驾机型，如：塞斯纳172', type: 'text', required: true }
    ]
  },
  '无人机认证': {
    id: 'uav-drone',
    title: '无人机认证',
    fields: [
      { id: 'deviceModel', label: '无人机型号', placeholder: '请输入型号', type: 'text', required: true },
      { id: 'uavType', label: '机型分类', type: 'select', options: ['多旋翼无人机', '固定翼无人机', '垂直起降固定翼', '无人直升机'], required: true },
      { id: 'snCode', label: 'SN 码', placeholder: '请输入设备序列号', type: 'text', required: true },
      { id: 'uasCode', label: 'UAS 码', placeholder: '请输入登记码', type: 'text', required: true },
      { id: 'factory', label: '生产厂家', placeholder: '请输入厂家名称', type: 'text', required: true },
      { id: 'ownerName', label: '所有者姓名/名称', placeholder: '请输入所有者', type: 'text', required: true },
      { id: 'ownerId', label: '所有者证件号', placeholder: '请输入证件号', type: 'text', required: true }
    ]
  },
  '通航飞行器认证': {
    id: 'ga-aircraft',
    title: '通航飞行器认证',
    fields: [
      { id: 'gaType', label: '通航飞行器类型', placeholder: '如：固定翼飞机、直升机', type: 'text', required: true },
      { id: 'callsign', label: '飞行器呼号', placeholder: '请输入呼号', type: 'text', required: true },
      { id: 'regNo', label: '国籍登记号', placeholder: '如：B-XXXX', type: 'text', required: true },
      { id: 'airworthyNo', label: '适航证编号', placeholder: '请输入适航证号', type: 'text', required: true },
      { id: 'ownerUnit', label: '所属单位', placeholder: '请输入所属单位全称', type: 'text', required: true }
    ]
  },
  '无人机飞行企业认证': {
    id: 'uav-corp',
    title: '无人机飞行企业认证',
    fields: [
      { id: 'corpName', label: '企业名称', placeholder: '请输入企业全称', type: 'text', required: true },
      { id: 'qualification', label: '运营资质', placeholder: '如：民用无人驾驶航空器运营合格证', type: 'text', required: true },
      { id: 'corpId', label: '统一社会信用代码', placeholder: '18位信用代码', type: 'text', required: true },
      { id: 'expiryDate', label: '资质有效期', type: 'date', required: true },
      { id: 'scope', label: '经营范围', placeholder: '请详细描述企业的无人机飞行经营范围...', type: 'textarea', required: true, colSpan: 2 }
    ]
  },
  '通航飞行企业认证': {
    id: 'ga-corp',
    title: '通航飞行企业认证',
    fields: [
      { id: 'corpName', label: '企业名称', placeholder: '请输入企业全称', type: 'text', required: true },
      { id: 'qualification', label: '运营资质', placeholder: '如：通用航空经营许可证', type: 'text', required: true },
      { id: 'corpId', label: '统一社会信用代码', placeholder: '18位信用代码', type: 'text', required: true },
      { id: 'gaPermitInfo', label: '通用航空经营许可信息', placeholder: '请输入许可信息', type: 'text', required: true },
      { id: 'expiryDate', label: '资质有效期', type: 'date', required: true },
      { id: 'scope', label: '经营范围', placeholder: '请详细描述企业的通航经营范围...', type: 'textarea', required: true, colSpan: 2 }
    ]
  }
};
