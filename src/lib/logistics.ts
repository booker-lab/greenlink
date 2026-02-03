// Imports removed as interfaces are defined locally
// Note: RouteNode might not be in user.ts, I will define it here or assume generic interaction.
// Since I didn't define RouteNode in user.ts, I will define it here.

export interface LogisticsNode {
    id: string;
    name: string;
    volume: number;        // Volume_i: 실시간 출하 가능 수량
    seasonFactor: number;  // SeasonFactor_i: 시즌 캘린더 기반 가중치 (0.0 ~ 2.0)
    hasCertification: boolean; // 농업 경영체 인증 여부 ({Cert})

    // Coordinates for distance calc (optional implementation)
    lat?: number;
    lng?: number;
}

export interface LogisticsEdge {
    fromId: string;
    toId: string;
    baseCost: number;      // C_ij: 기본 운송 비용 (거리/시간 기반)
}

/**
 * Calculates the Total Objective Function Z for a given set of active routes.
 * 
 * Formula:
 * Minimize Z = sum(C_ij * X_ij) + alpha * sum(SeasonFactor_i * Volume_i)
 * 
 * 해석:
 * 기본 수식은 총 비용($Cost$)과 "시즌 물량 가중치 합"($WeightedVolume$)을 결합한 형태입니다.
 * 만약 "우선순위가 높은 곳을 방문해야 한다"는 로직이라면, 
 * 방문하지 않은 노드에 대한 페널티로 해석하거나, 
 * 방문한 노드의 이득을 Cost에서 차감하는 형태로 구현해야 합니다.
 * 
 * 여기서는 'Total Cost'를 반환하며, alpha가 음수일 경우 
 * 시즌 물량이 많은 곳을 방문할수록 Cost가 낮아지는(우선순위가 높아지는) 구조를 갖습니다.
 */
export function calculateDynamicRouteCost(
    activeEdges: LogisticsEdge[],
    visitedNodes: LogisticsNode[],
    alpha: number = -1.0 // 기본적으로 '이득'으로 취급하여 비용을 낮춤
): number {

    // 1. 운송 비용 합계 (Sum of C_ij * X_ij)
    const transportationCost = activeEdges.reduce((sum, edge) => sum + edge.baseCost, 0);

    // 2. 시즌 가중치 & 물량 반영 (Sum of SeasonFactor_i * Volume_i)
    const weightedVolumeValue = visitedNodes.reduce((sum, node) => {
        // 인증된 농가는 추가 가중치 부여 (예: 1.2배)
        const certMultiplier = node.hasCertification ? 1.2 : 1.0;
        return sum + (node.seasonFactor * node.volume * certMultiplier);
    }, 0);

    // Total Z
    return transportationCost + (alpha * weightedVolumeValue);
}

/**
 * Placeholder for Flower Direct Delivery (Flower Tea / Fresh Flower Special)
 * 꽃차 직배송 로직 준비
 */
export const FlowerDirectDelivery = {
    calculateDeliveryTime: (startLat: number, startLng: number, endLat: number, endLng: number) => {
        // Mock implementation for time calculation
        // TODO: Connect to TMAP or Naver Maps API
        const dist = Math.sqrt(Math.pow(endLat - startLat, 2) + Math.pow(endLng - startLng, 2));
        return dist * 60; // Mock minutes
    },

    isDirectDeliveryAvailable: (node: LogisticsNode) => {
        // 거점 기반 직배송 가능 여부 체크
        // node.volume이 일정 수준 이상이고, 신선도가 중요할 때 true
        return node.volume > 100 && node.seasonFactor > 1.5;
    }
};
