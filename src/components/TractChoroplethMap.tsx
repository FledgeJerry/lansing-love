"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON as GeoJSONLayer, Tooltip } from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import "leaflet/dist/leaflet.css";

export type TractProps = {
  geoid: string;
  name: string;
  holc_grade: string; // A (best) – D (worst, "hazardous") per 1930s HOLC grading
  total: number;
  business: number;
  coop: number;
  house: number;
  entrepreneur: number;
};

const COUNT_SCALE = [
  { max: 0, color: "#2a2a35" },
  { max: 2, color: "#1d4d47" },
  { max: 5, color: "#1f6e63" },
  { max: 10, color: "#268f7d" },
  { max: Infinity, color: "#4A9B8E" }, // --color-teal-accent
];

function colorForCount(count: number): string {
  return COUNT_SCALE.find((b) => count <= b.max)!.color;
}

// HOLC grade D ("hazardous") tracts get a distinct red outline so the
// historic-redlining vs. current-network contrast reads at a glance without
// needing a toggle between two separate map views.
function styleForFeature(props: TractProps) {
  const isGradeD = props.holc_grade === "D";
  return {
    fillColor: colorForCount(props.total),
    fillOpacity: 0.85,
    color: isGradeD ? "#c0392b" : "rgba(244,241,232,0.25)",
    weight: isGradeD ? 2.5 : 1,
    dashArray: isGradeD ? undefined : "2",
  };
}

const GRADE_LABELS: Record<string, string> = {
  A: "A — “Best” (1930s HOLC grade)",
  B: "B — “Still Desirable”",
  C: "C — “Definitely Declining”",
  D: "D — “Hazardous” (redlined)",
};

export default function TractChoroplethMap({ features }: { features: Feature<Geometry, TractProps>[] }) {
  const center = useMemo<[number, number]>(() => [42.715, -84.52], []);

  return (
    <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {features.map((f) => (
        <GeoJSONLayer key={f.properties.geoid} data={f} style={() => styleForFeature(f.properties)}>
          <Tooltip sticky>
            <div style={{ fontSize: "0.8rem" }}>
              <strong>Tract {f.properties.name}</strong>
              <br />
              {f.properties.total} cooperative network location{f.properties.total === 1 ? "" : "s"}
              <br />
              {f.properties.business > 0 && <>· {f.properties.business} business<br /></>}
              {f.properties.coop > 0 && <>· {f.properties.coop} co-op<br /></>}
              {f.properties.house > 0 && <>· {f.properties.house} housing project<br /></>}
              {f.properties.entrepreneur > 0 && <>· {f.properties.entrepreneur} entrepreneur<br /></>}
              <span style={{ color: f.properties.holc_grade === "D" ? "#c0392b" : "inherit" }}>
                {GRADE_LABELS[f.properties.holc_grade] ?? f.properties.holc_grade}
              </span>
            </div>
          </Tooltip>
        </GeoJSONLayer>
      ))}
    </MapContainer>
  );
}
