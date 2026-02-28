export interface LocationVO {
    address: string;
    city: string;
    district: string;
    coordinates: { lat: number; lng: number };
}

export interface ComplianceVO {
    privacyPolicyAgreed: boolean;
    locationInfoAgreed: boolean;
    sellerInfoNoticeAgreed: boolean;
    agreedAt: string; // ISO 8601 Date
}

export interface SellerEntity {
    id: string; // Aggregate Root ID
    businessName: string;
    ownerName: string;
    businessRegistrationNumber: string;
    location: LocationVO;
    compliance: ComplianceVO;
    status: 'ONBOARDING' | 'ACTIVE' | 'SUSPENDED';
    createdAt: string;
    updatedAt: string;
}
