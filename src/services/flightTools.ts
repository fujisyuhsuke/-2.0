import { Coordinate, FSSInfo } from '../types';

/**
 * 飞服站判断逻辑 (FSS Judge & Router)
 * 
 * 逻辑定义：输入起飞点的经纬度坐标。
 * 判断规则：
 * - 如果坐标落在“广州、深圳、珠海”定义的地理围栏内 -> 路由至 “广深珠飞服站”。
 * - 如果落在广东省其他区域 -> 路由至 “广东省飞服站”。
 */
export const judgeFSS = (coord: Coordinate): FSSInfo => {
  // 模拟地理围栏判断 (广深珠区域)
  // 广州中心: 113.26, 23.13
  // 深圳中心: 114.05, 22.54
  // 珠海中心: 113.57, 22.27
  
  // 扩大判定范围以匹配地图点击
  const isGuangzhou = coord.lng > 112.8 && coord.lng < 113.8 && coord.lat > 22.6 && coord.lat < 23.8;
  const isShenzhen = coord.lng > 113.7 && coord.lng < 114.6 && coord.lat > 22.4 && coord.lat < 22.9;
  const isZhuhai = coord.lng > 113.0 && coord.lng < 113.8 && coord.lat > 21.8 && coord.lat < 22.4;

  if (isGuangzhou) {
    return {
      id: 'fss-gz',
      name: '广州飞行服务站',
      type: 'city',
      description: '由广州市飞服站负责审批与管理'
    };
  }

  if (isShenzhen) {
    return {
      id: 'fss-sz',
      name: '深圳飞行服务站',
      type: 'city',
      description: '由深圳市飞服站负责审批与管理'
    };
  }

  if (isZhuhai) {
    return {
      id: 'fss-zh',
      name: '珠海飞行服务站',
      type: 'city',
      description: '由珠海市飞服站负责审批与管理'
    };
  }

  return {
    id: 'fss-gd',
    name: '广东省飞行服务站',
    type: 'provincial',
    description: '由广东省飞服站直管区域'
  };
};

/**
 * 进度同步器 (Progress Synchronizer)
 * 
 * 处理外部系统（广深珠）返回后的状态更新。
 */
export const syncExternalStatus = async (applicationId: string) => {
  console.log(`正在同步外部系统状态: ${applicationId}`);
  // 模拟异步请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'approved',
        syncTime: new Date().toISOString(),
        externalRef: `EXT-${Math.floor(Math.random() * 10000)}`
      });
    }, 1500);
  });
};

/**
 * 资质数据预填充器 (Data Pre-filler)
 */
export const getPreFilledData = (userType: 'individual' | 'enterprise') => {
  if (userType === 'individual') {
    return {
      pilotName: '张三',
      idCard: '4401**********1234',
      uavSn: 'UAV-2024-0001'
    };
  }
  return {
    enterpriseName: '广东某航测技术有限公司',
    orgCode: '91440101MA59XXXXXX',
    gaLicense: 'GA-2024-088'
  };
};
