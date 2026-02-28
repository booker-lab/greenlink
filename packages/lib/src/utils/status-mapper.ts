import { DeliveryStatus, OrderStatus, GroupBuyStatus } from '../types';

export function mapDeliveryToOrderStatus(deliveryStatus: DeliveryStatus): OrderStatus | null {
    switch (deliveryStatus) {
        case 'PICKED_UP':
            return 'DISPATCHED';
        case 'IN_TRANSIT':
            return 'DELIVERING';
        case 'DELIVERED':
            return 'COMPLETED';
        case 'PENDING':
        default:
            return null;
    }
}

export function getStatusColor(status: OrderStatus | DeliveryStatus | GroupBuyStatus): string {
    switch (status) {
        case 'ORDERED':
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-800';
        case 'PREPARING':
            return 'bg-blue-100 text-blue-800';
        case 'DISPATCHED':
        case 'PICKED_UP':
            return 'bg-purple-100 text-purple-800';
        case 'DELIVERING':
        case 'IN_TRANSIT':
            return 'bg-indigo-100 text-indigo-800';
        case 'COMPLETED':
        case 'DELIVERED':
        case 'GOAL_MET':
            return 'bg-green-100 text-green-800';
        case 'CANCELLED':
            return 'bg-red-100 text-red-800';
        case 'RECRUITING':
            return 'bg-sky-100 text-sky-800';
        case 'ESCROW_DEPOSIT':
            return 'bg-orange-100 text-orange-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}
