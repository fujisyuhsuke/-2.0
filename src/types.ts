export interface Coordinate {
  lat: number;
  lng: number;
}

export interface FSSInfo {
  id: string;
  name: string;
  type: 'provincial' | 'city';
  description: string;
}

export interface LocationSelection {
  coordinate: Coordinate;
  address: string;
  fss: FSSInfo;
}

export type LoginTab = 'qrcode' | 'account';
export type RegisterStep = 'type' | 'info' | 'verify' | 'sign' | 'complete';
export type RegisterType = 'individual' | 'enterprise';
export type CertView = 'categories' | 'instances' | 'detail' | 'form';

export interface CertInstance {
  id: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  data: Record<string, any>;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'datetime-local' | 'date';
  placeholder?: string;
  options?: string[];
  colSpan?: number;
  pattern?: string;
}

export interface FormConfig {
  fields: FormField[];
}

export interface CertCategory {
  id: string;
  title: string;
  desc: string;
  icon: string;
  allowedFor: RegisterType[];
  isSingleInstance?: boolean;
  titleField: string; // Field ID used for card title
}
