"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { StartupHub } from "../data/gujarat-startups";

interface MapProps {
  startups: StartupHub[];
  onStartupSelect: (startup: StartupHub) => void;
}

export default function Map({ startups, onStartupSelect }: MapProps) {
  useEffect(() => {
    // Create a custom icon instance
    const customIcon = L.icon({
      iconUrl: 'https://res.cloudinary.com/dumfswc0u/image/upload/v1733156829/loc_drcogs.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Set it as the default icon for all markers
    L.Marker.prototype.options.icon = customIcon;
  }, []);

  return (
    <MapContainer
      center={[22.2587, 71.1924]}
      zoom={7}
      style={{ height: "600px", width: "100%" }}
      className="rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {startups.map((startup) => (
        <div key={startup.id}>
          {/* Heat circle to show density */}
          <CircleMarker
            center={[startup.coordinates.lat, startup.coordinates.lng]}
            radius={20 * (startup.startupCount / 100)} // Scale based on startup count
            fillColor="#3b82f6"
            fillOpacity={0.2}
            stroke={false}
          />
          
          {/* Main marker */}
          <Marker
            position={[startup.coordinates.lat, startup.coordinates.lng]}
            eventHandlers={{
              click: () => onStartupSelect(startup),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-3">
                <h3 className="font-semibold text-lg">{startup.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{startup.city}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Startups:</span>
                    <span className="font-medium ml-1">{startup.startupCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Growth:</span>
                    <span className="font-medium ml-1 text-green-600">{startup.growth}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Click to view details
                </div>
              </div>
            </Popup>
          </Marker>
        </div>
      ))}
    </MapContainer>
  );
} 