import { useEffect, useRef, useState } from 'react';

let mapsPromise;

function loadGoogleMaps(key) {
  if (window.google?.maps?.importLibrary) return Promise.resolve(window.google.maps);
  if (!mapsPromise) {
    mapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      window.initOfficeGoogleMaps = () => {
        delete window.initOfficeGoogleMaps;
        resolve(window.google.maps);
      };
      script.src = `https://maps.googleapis.com/maps/api/js?${new URLSearchParams({ key, v: 'weekly', loading: 'async', callback: 'initOfficeGoogleMaps', language: 'pt-BR', region: 'BR' })}`;
      script.async = true;
      script.onerror = () => {
        delete window.initOfficeGoogleMaps;
        script.remove();
        mapsPromise = undefined;
        reject(new Error('Google Maps could not load.'));
      };
      document.head.appendChild(script);
    });
  }
  return mapsPromise;
}

export default function OfficeMap({ address }) {
  const containerRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) return;
    let disposed = false;
    let marker;
    let map;

    async function initialize() {
      try {
        const googleMaps = await loadGoogleMaps(apiKey);
        const [{ Map }, { ColorScheme }, { Geocoder }, { AdvancedMarkerElement }] = await Promise.all([
          googleMaps.importLibrary('maps'),
          googleMaps.importLibrary('core'),
          googleMaps.importLibrary('geocoding'),
          googleMaps.importLibrary('marker'),
        ]);
        if (disposed) return;
        const { results } = await new Geocoder().geocode({ address, region: 'BR' });
        if (disposed) return;
        if (!results[0]) throw new Error('Office address not found.');
        const position = results[0].geometry.location;
        map = new Map(containerRef.current, {
          center: position,
          zoom: 17,
          mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID',
          colorScheme: ColorScheme.DARK,
          mapTypeId: 'roadmap',
          gestureHandling: 'cooperative',
          streetViewControl: false,
          mapTypeControl: false,
        });
        marker = new AdvancedMarkerElement({ map, position, title: `Cruz e Rodrigues — ${address}` });
      } catch {
        if (!disposed) setFailed(true);
      }
    }
    initialize();
    return () => {
      disposed = true;
      if (marker) marker.map = null;
      if (map) window.google.maps.event.clearInstanceListeners(map);
    };
  }, [apiKey, address]);

  // Keep the location usable while credentials are missing or the API is unavailable.
  if (!apiKey || failed) {
    return <iframe title={`Mapa do escritório Cruz e Rodrigues — ${address}`} src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&z=17&output=embed`} width="1200" height="420" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />;
  }
  return <div ref={containerRef} className="office-google-map" aria-label={`Mapa do escritório Cruz e Rodrigues — ${address}`} />;
}
