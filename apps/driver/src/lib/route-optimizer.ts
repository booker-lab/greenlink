export interface GeoPoint {
    id: string;
    lat: number;
    lng: number;
}

// Haversine formula to calculate distance between two points in km
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLng = deg2rad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

// Nearest Neighbor Algorithm for TSP
export function optimizeRoute<T extends GeoPoint>(start: { lat: number, lng: number }, points: T[]): T[] {
    if (points.length === 0) return [];

    const unvisited = [...points];
    const sorted: T[] = [];
    let current = start;

    while (unvisited.length > 0) {
        let nearestIndex = -1;
        let minDist = Infinity;

        for (let i = 0; i < unvisited.length; i++) {
            const dist = calculateDistance(current.lat, current.lng, unvisited[i].lat, unvisited[i].lng);
            if (dist < minDist) {
                minDist = dist;
                nearestIndex = i;
            }
        }

        if (nearestIndex !== -1) {
            const next = unvisited[nearestIndex];
            sorted.push(next);
            current = next;
            unvisited.splice(nearestIndex, 1);
        } else {
            break; // Should not happen
        }
    }

    return sorted;
}
