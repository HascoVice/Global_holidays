import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import useResizeObserver from './useResizeObserver';
import type Passenger from '@/types/Passenger';

type DataType = 'total_passenger' | 'domestic' | 'international';

const COLORS = {
    NO_DATA: '#FFEBCD',
    LOW: '#cfe2f3',
    MEDIUM: '#6fa8dc',
    HIGH: '#1155cc',
};

interface GeoFeature extends Feature {
    properties: {
        name: string;
        sov_a3: string;
        adm0_a3: string;
        iso_a3: string;
        iso_a2: string;
        scalerank: number;
        labelrank: number;
        sovereignt: string;
        [key: string]: any;
    };
}

interface WorldMapProps {
    data: FeatureCollection<Geometry, GeoFeature['properties']>;
    passengerData: Passenger[];
    year: number;
}

function WorldMap({ data, passengerData, year }: WorldMapProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dimensions = useResizeObserver(wrapperRef);
    const [selectedDataType, setSelectedDataType] = useState<DataType>('total_passenger');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipData, setTooltipData] = useState<{
        name: string;
        domestic: number;
        international: number;
        total_passenger: number;
    } | null>(null);

    useEffect(() => {
        if (!svgRef.current || !wrapperRef.current || !dimensions) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const passengerMap = new Map<
            string,
            { domestic: number; international: number; total_passenger: number }
        >();

        passengerData.forEach((d) => {
            if (d.year === year) {
                const countryCode = d.country_code;
                const current = passengerMap.get(countryCode) || {
                    domestic: 0,
                    international: 0,
                    total_passenger: 0,
                };
                const newValue = {
                    domestic: current.domestic + (d.domestic || 0),
                    international: current.international + (d.international || 0),
                    total_passenger:
                        current.total_passenger + ((d.domestic || 0) + (d.international || 0)),
                };
                passengerMap.set(countryCode, newValue);
            }
        });

        const values = Array.from(passengerMap.values()).map((d) => d[selectedDataType]);
        const maxProp = d3.max(values) || 1;

        const getColor = (value: number) => {
            if (value === 0) return COLORS.NO_DATA;
            if (value < maxProp / 3) return COLORS.LOW;
            if (value < (2 * maxProp) / 3) return COLORS.MEDIUM;
            return COLORS.HIGH;
        };

        const projection = d3
            .geoMercator()
            .fitSize([dimensions.width, dimensions.height], data)
            .precision(0.1);

        const pathGenerator = d3.geoPath().projection(projection);

        const g = svg.append('g');

        g.selectAll('path')
            .data(data.features)
            .join('path')
            .attr('class', 'world-map-country')
            .attr('d', (feature) => pathGenerator(feature as any))
            .attr('fill', (feature: GeoFeature) => {
                const countryData = passengerMap.get(feature.properties.iso_a3);
                return countryData ? getColor(countryData[selectedDataType]) : COLORS.NO_DATA;
            })
            .attr('stroke', '#fff')
            .attr('stroke-width', 0.5)
            .on('mouseover', (event, feature: GeoFeature) => {
                d3.select(event.currentTarget).attr('stroke', '#000').attr('stroke-width', 1);
            })
            .on('mouseout', (event) => {
                d3.select(event.currentTarget).attr('stroke', '#fff').attr('stroke-width', 0.5);
                setTooltipVisible(false);
            })
            .on('click', (event, feature: GeoFeature) => {
                const countryCode = feature.properties.iso_a3;
                const countryData = passengerMap.get(countryCode);

                if (countryData) {
                    const [x, y] = d3.pointer(event, wrapperRef.current);
                    setTooltipPosition({ x, y });
                    setTooltipData({
                        name: feature.properties.name,
                        domestic: countryData.domestic * 1000,
                        international: countryData.international * 1000,
                        total_passenger: (countryData.domestic + countryData.international) * 1000,
                    });
                    setTooltipVisible(true);
                }
            });

        const legend = svg
            .append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(20, ${dimensions.height - 100})`);

        const legendItems = [
            { color: COLORS.HIGH, label: 'Trafic élevé' },
            { color: COLORS.MEDIUM, label: 'Trafic moyen' },
            { color: COLORS.LOW, label: 'Trafic faible' },
            { color: COLORS.NO_DATA, label: 'Aucune donnée' },
        ];

        legendItems.forEach((item, i) => {
            const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 20})`);

            legendRow
                .append('rect')
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', item.color)
                .attr('stroke', '#666')
                .attr('stroke-width', 0.5);

            legendRow
                .append('text')
                .attr('x', 20)
                .attr('y', 12)
                .style('font-size', '12px')
                .text(item.label);
        });
    }, [data, dimensions, passengerData, year, selectedDataType]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <label htmlFor="dataType" className="text-sm font-medium">
                    Afficher les données :
                </label>
                <select
                    id="dataType"
                    value={selectedDataType}
                    onChange={(e) => setSelectedDataType(e.target.value as DataType)}
                    className="p-2 rounded border"
                >
                    <option value="total_passenger">Total Passengers</option>
                    <option value="domestic">Domestic</option>
                    <option value="international">International</option>
                </select>
            </div>
            <div
                ref={wrapperRef}
                className="world-map-wrapper relative"
                style={{ height: '500px' }}
            >
                <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
                {tooltipVisible && tooltipData && (
                    <div
                        className="absolute bg-white p-3 rounded-lg shadow-lg border border-gray-200"
                        style={{
                            left: `${tooltipPosition.x}px`,
                            top: `${tooltipPosition.y}px`,
                            transform: 'translate(-50%, -100%)',
                            zIndex: 1000,
                        }}
                    >
                        <h3 className="font-bold text-sm mb-1">{tooltipData.name}</h3>
                        <p className="text-sm">Domestic: {tooltipData.domestic.toLocaleString()}</p>
                        <p className="text-sm">
                            International: {tooltipData.international.toLocaleString()}
                        </p>
                        <p className="text-sm font-semibold">
                            Total Passengers: {tooltipData.total_passenger.toLocaleString()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WorldMap;
