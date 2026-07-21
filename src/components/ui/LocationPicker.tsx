"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { useEffect } from "react";

// The actual map component — only rendered client-side
let L: any;

interface Props {
  lat: number | null;
  lng: number | null;
  onSelect: (lat: number, lng: number) => void;
}

// We use a simple approach: dynamic import the map inside a client component
const LeafletMap = dynamic(
  async () => {
    const { MapContainer, TileLayer, Marker, useMapEvents } = await import("react-leaflet");
    const leaflet = await import("leaflet");

    // Fix default icon issue in Next.js
    const icon = leaflet.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    function ClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
      useMapEvents({ click: (e) => onSelect(e.latlng.lat, e.latlng.lng) });
      return null;
    }

    return function Map({ lat, lng, onSelect }: Props) {
      return (
        <MapContainer
          center={[lat ?? 12.9716, lng ?? 77.5946]}
          zoom={lat ? 15 : 12}
          style={{ height: "200px", width: "100%", borderRadius: "16px" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <ClickHandler onSelect={onSelect} />
          {lat && lng && <Marker position={[lat, lng]} icon={icon} />}
        </MapContainer>
      );
    };
  },
  { ssr: false }
);

export default function LocationPicker({ lat, lng, onSelect }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-gray-500" />
        <p className="text-xs font-bold text-gray-700">Pin on Map <span className="text-gray-400 font-normal">(tap to set location)</span></p>
      </div>
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <LeafletMap lat={lat} lng={lng} onSelect={onSelect} />
      </div>
      {lat && lng && (
        <p className="text-xs text-emerald-700 font-semibold text-center">
          📍 Pinned: {lat.toFixed(5)}, {lng.toFixed(5)}
        </p>
      )}
    </div>
  );
}
