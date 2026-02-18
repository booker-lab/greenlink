export interface Driver {
    id: string;
    name: string;
    phone: string;
    vehicleInfo: string;
    farmId: string;
}

export interface PinkTemperature {
    value: number;
    level: string;
    emoji: string;
    description: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'consumer' | 'farm_owner' | 'driver';
    pinkTemperature?: PinkTemperature;
    createdAt: string;
}
