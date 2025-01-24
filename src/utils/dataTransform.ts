import { BaseDevice, DeviceHistory, DeviceType } from '../api/showData';

// 工具函数：确保数值类型
const ensureNumber = (value: any, defaultValue = 0): number => {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  return defaultValue;
};

export interface PeopleCounterValue {
  in: number;
  out: number;
  battery: number;
  updatedAt: string;
}

export interface LiquidLevelValue {
  level: 'high' | 'medium' | 'low';
  battery: number;
  updatedAt: string;
}

export interface CaptureValue {
  status: 'occupied' | 'vacant';
  battery: number;
  distance: number;
  updatedAt: string;
}

export interface DoorWindowValue {
  status: 'open' | 'closed';
  battery: number;
  deployed: string;
  updatedAt: string;
}

export interface ToiletPaperValue {
  percent: number;
  battery: number;
  distance: number;
  updatedAt: string;
}

export interface TransformedPeopleCounterData extends BaseDevice {
  value: PeopleCounterValue;
}

export interface TransformedLiquidLevelData extends BaseDevice {
  value: LiquidLevelValue;
}

export interface TransformedCaptureData extends BaseDevice {
  value: CaptureValue;
}

export interface TransformedDoorWindowData extends BaseDevice {
  value: DoorWindowValue;
}

export interface TransformedToiletPaperData extends BaseDevice {
  value: ToiletPaperValue;
}

export const transformPeopleCounterData = (data: BaseDevice & Partial<DeviceHistory>): TransformedPeopleCounterData => {
  const value = data.value as any;
  return {
    ...data,
    value: {
      in: ensureNumber(value.in ?? value['in'] ?? 0),
      out: ensureNumber(value.out ?? value['out'] ?? 0),
      battery: ensureNumber(value.battery),
      updatedAt: value.updatedAt
    }
  };
};

// 定义 AirSensor 相关的类型
export interface AirSensorValue {
  temperature: number | null;
  humidity: number | null;
  co2: number | null;
  updatedAt: string;
}

export interface AirSensorHistoryItem {
  temperature: number | null;
  humidity: number | null;
  co2: number | null;
  updatedAt: string;
}

export interface TransformedAirSensorData {
  id: number;
  name: string;
  type: DeviceType;
  value: AirSensorValue;
  history: AirSensorHistoryItem[];
}

// 转换函数
export const transformAirSensorData = (data: BaseDevice & Partial<DeviceHistory>): TransformedAirSensorData => {
  const value = data.value as any;
  const history = (data.history || []) as Array<{
    temperature?: number;
    humidity?: number;
    co2?: number;
    updatedAt?: string;
    _time: string;
  }>;
  
  // 转换历史数据并过滤掉所有数据为 null 的记录
  const transformedHistory: AirSensorHistoryItem[] = history
    .map(item => ({
      temperature: typeof item.temperature === 'number' ? item.temperature : null,
      humidity: typeof item.humidity === 'number' ? item.humidity : null,
      co2: typeof item.co2 === 'number' ? item.co2 : null,
      updatedAt: item.updatedAt || item._time
    }))
    .filter(item => item.temperature !== null || item.humidity !== null || item.co2 !== null);

  // 转换当前值
  const transformedValue: AirSensorValue = {
    temperature: typeof value.temperature === 'number' ? value.temperature : null,
    humidity: typeof value.humidity === 'number' ? value.humidity : null,
    co2: typeof value.co2 === 'number' ? value.co2 : null,
    updatedAt: value.updatedAt
  };

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    value: transformedValue,
    history: transformedHistory
  };
};

export const transformCaptureData = (data: BaseDevice & Partial<DeviceHistory>): TransformedCaptureData => {
  const value = data.value as any;
  return {
    ...data,
    value: {
      status: value.status ? 'occupied' : 'vacant',
      battery: ensureNumber(value.battery),
      distance: ensureNumber(value.distance),
      updatedAt: value.updatedAt
    }
  };
};

export const transformDoorWindowData = (data: BaseDevice & Partial<DeviceHistory>): TransformedDoorWindowData => {
  const value = data.value as any;
  
  // 获取最近的有效电量数据
  let battery = ensureNumber(value.battery);
  
  // 如果当前值没有电量数据，从历史记录中查找
  if (!battery && data.history && Array.isArray(data.history)) {
    const latestBatteryRecord = data.history
      .filter(record => typeof record.battery === 'number' && record.battery !== null)
      .sort((a, b) => new Date(b._time).getTime() - new Date(a._time).getTime())[0];
    
    if (latestBatteryRecord) {
      battery = ensureNumber(latestBatteryRecord.battery);
    }
  }

  return {
    ...data,
    value: {
      status: value.status === 'open' ? 'open' : 'closed',
      battery,
      deployed: value.deployed || '00',
      updatedAt: value.updatedAt
    }
  };
};

export const transformLiquidLevelData = (data: BaseDevice & Partial<DeviceHistory>): TransformedLiquidLevelData => {
  const value = data.value as any;
  return {
    ...data,
    value: {
      level: ['high', 'medium', 'low'].includes(value.level) ? value.level : 'high',
      battery: ensureNumber(value.battery),
      updatedAt: value.updatedAt
    }
  };
};

export const transformToiletPaperData = (data: BaseDevice & Partial<DeviceHistory>): TransformedToiletPaperData => {
  const value = data.value as any;
  return {
    ...data,
    value: {
      percent: ensureNumber(value.percent),
      battery: ensureNumber(value.battery),
      distance: ensureNumber(value.distance),
      updatedAt: value.updatedAt
    }
  };
}; 