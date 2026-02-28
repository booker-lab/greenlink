"use client";

import React, { useMemo } from "react";

interface LocationPoint {
    id: string;
    lat: number;
    lng: number;
    status: "PENDING" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED";
    label?: string;
}

interface SvgMinimapProps {
    locations: LocationPoint[];
    currentLocation?: { lat: number; lng: number };
    className?: string;
}

export function SvgMinimap({ locations, currentLocation, className }: SvgMinimapProps) {
    // Normalize coordinates to viewbox 0 0 100 100
    const normalizedPoints = useMemo(() => {
        if (locations.length === 0 && !currentLocation) return [];

        const allPoints = currentLocation ? [...locations, { ...currentLocation, id: 'current', status: 'IN_TRANSIT' as const }] : locations;

        const lats = allPoints.map(p => p.lat);
        const lngs = allPoints.map(p => p.lng);

        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        const latSpan = maxLat - minLat || 0.01;
        const lngSpan = maxLng - minLng || 0.01;

        // Add parsing (10%)
        const padding = 0.1;

        return locations.map(loc => ({
            ...loc,
            x: ((loc.lng - minLng) / lngSpan) * 80 + 10, // 10-90 range
            y: 100 - (((loc.lat - minLat) / latSpan) * 80 + 10), // Invert Y for SVG
        }));
    }, [locations, currentLocation]);

    const currentPoint = useMemo(() => {
        if (!currentLocation || locations.length === 0) return null;
        const allPoints = [...locations, { ...currentLocation, id: 'current', status: 'IN_TRANSIT' as const }];
        const lats = allPoints.map(p => p.lat);
        const lngs = allPoints.map(p => p.lng);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        const latSpan = maxLat - minLat || 0.01;
        const lngSpan = maxLng - minLng || 0.01;

        return {
            x: ((currentLocation.lng - minLng) / lngSpan) * 80 + 10,
            y: 100 - (((currentLocation.lat - minLat) / latSpan) * 80 + 10),
        };
    }, [locations, currentLocation]);


    return (
        <div className={`relative w-full h-full bg-gray-900 rounded-xl overflow-hidden border border-gray-800 ${className}`}>
            <svg viewBox="0 0 100 100" className="w-full h-full p-4">
                {/* Connection Lines (simplified MST or path) */}
                {/* For MVP, just draw lines from current to first Pending, etc. */}
                {currentPoint && normalizedPoints.length > 0 && (
                    <line
                        x1={currentPoint.x}
                        y1={currentPoint.y}
                        x2={normalizedPoints[0].x}
                        y2={normalizedPoints[0].y}
                        stroke="rgba(16, 185, 129, 0.3)" // Emerald-500 optimized
                        strokeWidth="2"
                        strokeDasharray="4 2"
                    />
                )}

                {/* Location Markers */}
                {normalizedPoints.map((point) => (
                    <g key={point.id}>
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill={point.status === 'DELIVERED' ? '#10B981' : '#3B82F6'} // Emerald/Blue
                            stroke="#111827"
                            strokeWidth="1"
                        />
                        {point.label && (
                            <text x={point.x} y={point.y - 6} fontSize="4" fill="white" textAnchor="middle">
                                {point.label}
                            </text>
                        )}
                    </g>
                ))}

                {/* Current Location Marker */}
                {currentPoint && (
                    <circle cx={currentPoint.x} cy={currentPoint.y} r="5" fill="#F43F5E" stroke="white" strokeWidth="2">
                        <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                )}
            </svg>
            {/* Overlay Info */}
            <div className="absolute top-2 right-2 bg-gray-800/80 px-2 py-1 rounded text-xs text-white backdrop-blur">
                PV5 Live 🟢
            </div>
        </div>
    );
}
