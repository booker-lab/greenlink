export type UserRole = 'consumer' | 'farmer' | 'retailer' | 'admin';

export interface PinkTemperature {
  /**
   * Consumer trust score based on refund/cancel frequency (0-100)
   * Higher is better (less refunds/cancels)
   */
  score: number;
  refundCount: number;
  cancelCount: number;
  lastUpdated: string; // ISO Date
}

export interface GreenTemperature {
  /**
   * Producer reputation score (0-100)
   * Based on sales volume, ratings, and freshness
   */
  score: number;
  totalSalesVolume: number;
  averageRating: number;
  responsdSpeed?: number; // minutes
}

export interface FarmerCertification {
  id: string;
  /**
   * Type of certification:
   * - agricultural_management: 농업경영체 등록
   * - gap: GAP 인증
   * - organic: 유기농 인증
   */
  type: 'agricultural_management' | 'gap' | 'organic' | 'other';
  certificationNumber: string;
  issueDate: string;
  expiryDate?: string;
  isVerified: boolean;
  imageUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  profileImage?: string;
  
  // Location for logistics
  address?: {
    zipCode: string;
    fullAddress: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  // Specific fields
  pinkTemperature?: PinkTemperature; // For consumers
  greenTemperature?: GreenTemperature; // For farmers
  certifications?: FarmerCertification[]; // For farmers
}
