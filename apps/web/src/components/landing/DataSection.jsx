import { useEffect, useRef, useState } from 'react';
import api from '../../utils/api';

const FALLBACK_WASTE = [
  { label: 'PET Plastic', pct: 60, color: 'var(--darkBlue-800)' },
  { label: 'HDPE/LDPE',  pct: 30, color: 'var(--lightBlue-500)' },
  { label: 'Lainnya',    pct: 10, color: 'var(--orange-500)' },
];

const FALLBACK_TPS = [
  { id:'f1',  nama_tps:'TPS Bantar Gebang',         kota:'Bekasi',        kecamatan:'Bantar Gebang',    latitude:-6.3728,  longitude:107.0047 },
  { id:'f2',  nama_tps:'TPS Sunter Agung',           kota:'Jakarta Utara', kecamatan:'Sunter Agung',     latitude:-6.1382,  longitude:106.8724 },
  { id:'f3',  nama_tps:'TPS Cakung',                 kota:'Jakarta Timur', kecamatan:'Cakung',           latitude:-6.1872,  longitude:106.9453 },
  { id:'f4',  nama_tps:'TPS Rorotan',                kota:'Jakarta Utara', kecamatan:'Cilincing',        latitude:-6.0981,  longitude:106.9312 },
  { id:'f5',  nama_tps:'TPS Pulo Gadung',            kota:'Jakarta Timur', kecamatan:'Pulo Gadung',      latitude:-6.1756,  longitude:106.9024 },
  { id:'f6',  nama_tps:'TPS Benowo',                 kota:'Surabaya',      kecamatan:'Pakal',            latitude:-7.2519,  longitude:112.6489 },
  { id:'f7',  nama_tps:'TPS Keputih',                kota:'Surabaya',      kecamatan:'Sukolilo',         latitude:-7.3103,  longitude:112.8028 },
  { id:'f8',  nama_tps:'TPS Greges',                 kota:'Surabaya',      kecamatan:'Asemrowo',         latitude:-7.2214,  longitude:112.6851 },
  { id:'f9',  nama_tps:'TPS Wonorejo',               kota:'Surabaya',      kecamatan:'Rungkut',          latitude:-7.3289,  longitude:112.8180 },
  { id:'f10', nama_tps:'TPS Sarimukti',              kota:'Bandung Barat', kecamatan:'Cipatat',          latitude:-6.7892,  longitude:107.3245 },
  { id:'f11', nama_tps:'TPS Legok Nangka',           kota:'Bandung',       kecamatan:'Nagreg',           latitude:-7.0234,  longitude:107.7821 },
  { id:'f12', nama_tps:'TPS Pasir Impun',            kota:'Bandung',       kecamatan:'Mandalajati',      latitude:-6.8765,  longitude:107.6823 },
  { id:'f13', nama_tps:'TPS Terjun',                 kota:'Medan',         kecamatan:'Medan Marelan',    latitude:3.6891,   longitude:98.6234  },
  { id:'f14', nama_tps:'TPS Namo Bintang',           kota:'Medan',         kecamatan:'Pancur Batu',      latitude:3.4523,   longitude:98.5678  },
  { id:'f15', nama_tps:'TPS Jatibarang',             kota:'Semarang',      kecamatan:'Mijen',            latitude:-7.0456,  longitude:110.3234 },
  { id:'f16', nama_tps:'TPS Plombokan',              kota:'Semarang',      kecamatan:'Semarang Utara',   latitude:-6.9523,  longitude:110.4012 },
  { id:'f17', nama_tps:'TPS Antang',                 kota:'Makassar',      kecamatan:'Manggala',         latitude:-5.1423,  longitude:119.4923 },
  { id:'f18', nama_tps:'TPS Tamangapa',              kota:'Makassar',      kecamatan:'Manggala',         latitude:-5.1678,  longitude:119.5134 },
  { id:'f19', nama_tps:'TPS Sukawinatan',            kota:'Palembang',     kecamatan:'Sukarami',         latitude:-2.9234,  longitude:104.7123 },
  { id:'f20', nama_tps:'TPS Karya Jaya',             kota:'Palembang',     kecamatan:'Kertapati',        latitude:-3.0123,  longitude:104.7456 },
  { id:'f21', nama_tps:'TPS Suwung',                 kota:'Denpasar',      kecamatan:'Denpasar Selatan', latitude:-8.7234,  longitude:115.2345 },
  { id:'f22', nama_tps:'TPS Temesi',                 kota:'Gianyar',       kecamatan:'Gianyar',          latitude:-8.5678,  longitude:115.3456 },
  { id:'f23', nama_tps:'TPS Mandung',                kota:'Tabanan',       kecamatan:'Kerambitan',       latitude:-8.5123,  longitude:115.1234 },
  { id:'f24', nama_tps:'TPS Piyungan',               kota:'Bantul',        kecamatan:'Piyungan',         latitude:-7.8234,  longitude:110.4567 },
  { id:'f25', nama_tps:'TPS Kranon',                 kota:'Yogyakarta',    kecamatan:'Wirobrajan',       latitude:-7.7956,  longitude:110.3512 },
  { id:'f26', nama_tps:'TPS Manggar',                kota:'Balikpapan',    kecamatan:'Balikpapan Timur', latitude:-1.1823,  longitude:117.0234 },
  { id:'f27', nama_tps:'TPS Bukit Pinang',           kota:'Samarinda',     kecamatan:'Samarinda Ulu',    latitude:-0.5023,  longitude:117.1345 },
  { id:'f28', nama_tps:'TPS Batu Layang',            kota:'Pontianak',     kecamatan:'Pontianak Utara',  latitude:-0.0123,  longitude:109.3456 },
  { id:'f29', nama_tps:'TPS Sumompo',                kota:'Manado',        kecamatan:'Tuminting',        latitude:1.4823,   longitude:124.8456 },
  { id:'f30', nama_tps:'TPS Wawonasa',               kota:'Manado',        kecamatan:'Singkil',          latitude:1.4634,   longitude:124.8234 },
  { id:'f31', nama_tps:'TPS Kebon Kongok',           kota:'Lombok Barat',  kecamatan:'Gerung',           latitude:-8.6523,  longitude:116.0678 },
  { id:'f32', nama_tps:'TPS Pagutan',                kota:'Mataram',       kecamatan:'Mataram',          latitude:-8.5934,  longitude:116.1123 },
  { id:'f33', nama_tps:'TPS Alak',                   kota:'Kupang',        kecamatan:'Alak',             latitude:-10.1823, longitude:123.5678 },
  { id:'f34', nama_tps:'TPS Koya',                   kota:'Jayapura',      kecamatan:'Muara Tami',       latitude:-2.7234,  longitude:140.6789 },
  { id:'f35', nama_tps:'TPS Toisapu',                kota:'Ambon',         kecamatan:'Leitimur Selatan', latitude:-3.7023,  longitude:128.1234 },
  { id:'f36', nama_tps:'TPS Muara Baru',             kota:'Jakarta Utara', kecamatan:'Penjaringan',      latitude:-6.1100,  longitude:106.8050 },
  { id:'f37', nama_tps:'TPS Pelabuhan Tanjung Emas', kota:'Semarang',      kecamatan:'Semarang Utara',   latitude:-6.9300,  longitude:110.4230 },
  { id:'f38', nama_tps:'TPS Pelabuhan Belawan',      kota:'Medan',         kecamatan:'Medan Belawan',    latitude:3.7845,   longitude:98.6923  },
  { id:'f39', nama_tps:'TPS Pesisir Kenjeran',       kota:'Surabaya',      kecamatan:'Kenjeran',         latitude:-7.2312,  longitude:112.7923 },
  { id:'f40', nama_tps:'TPS Muara Angke',            kota:'Jakarta Utara', kecamatan:'Pluit',            latitude:-6.1023,  longitude:106.7823 },
  { id:'f41', nama_tps:'TPS Pantai Losari',          kota:'Makassar',      kecamatan:'Ujung Pandang',    latitude:-5.1356,  longitude:119.4123 },
  { id:'f42', nama_tps:'TPS Ternate Pesisir',        kota:'Ternate',       kecamatan:'Ternate Selatan',  latitude:0.7823,   longitude:127.3734 },
  { id:'f43', nama_tps:'TPS Bitung Pelabuhan',       kota:'Bitung',        kecamatan:'Maesa',            latitude:1.4412,   longitude:125.1923 },
  { id:'f44', nama_tps:'TPS Sorong Pelabuhan',       kota:'Sorong',        kecamatan:'Sorong',           latitude:-0.8734,  longitude:131.2534 },
  { id:'f45', nama_tps:'TPS Merauke Pesisir',        kota:'Merauke',       kecamatan:'Merauke',          latitude:-8.4923,  longitude:140.3823 },
];

async function fetchOSMWastePoints() {
  try {
    const query = `
      [out:json][timeout:20];
      (
        node["amenity"="recycling"](-11,95,6,141);
        node["amenity"="waste_transfer_station"](-11,95,6,141);
      );
      out body 80;
    `;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    return data.elements
      .filter(el => el.lat && el.lon)
      .map((el, i) => ({
        id: `osm-${el.id}`,
        nama_tps: el.tags?.name || el.tags?.['name:id'] || `Titik Daur Ulang ${i + 1}`,
        kota: el.tags?.['addr:city'] || '',
        kecamatan: el.tags?.['addr:district'] || '',
        latitude: el.lat,
        longitude: el.lon,
      }));
  } catch {
    return [];
  }
}

function DonutChart({ data }) {
  const R = 85, CX = 140, CY = 140, SW = 44;
  const C = 2 * Math.PI * R;
  const segs = data.reduce((acc, { pct, color }) => {
    const prev = acc.length ? acc[acc.length - 1] : { off: 0, d: 0 };
    const d = (pct / 100) * C;
    acc.push({ color, d, off: prev.off + prev.d });
    return acc;
  }, []);
  return (
    <svg width="280" height="280" viewBox="0 0 280 280">
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--grey-light)" strokeWidth={SW} />
      <g transform={`rotate(-90,${CX},${CY})`}>
        {segs.map(({ color, d, off: o }, i) => (
          <circle
            key={i} cx={CX} cy={CY} r={R}
            fill="none" stroke={color} strokeWidth={SW}
            strokeDasharray={`${d} ${C - d}`}
            strokeDashoffset={-o}
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        ))}
      </g>
    </svg>
  );
}

function LeafletMap({ tpsMarkers, tpsCount, mapLoading }) {
  const mapRef         = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef     = useRef([]);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id    = 'leaflet-css';
      link.rel   = 'stylesheet';
      link.href  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      const L = window.L;

      const map = L.map(mapRef.current, {
        center: [-2.5, 118],
        zoom: 5,
        minZoom: 4,
        maxZoom: 14,
        zoomControl: true,
        attributionControl: true,
      });

      map.setMaxBounds([[-13, 92], [9, 142]]);

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          subdomains: 'abcd',
          maxZoom: 14,
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a>',
        }
      ).addTo(map);

      map.attributionControl.setPrefix('');
      mapInstanceRef.current = map;
    };

    if (window.L) {
      initMap();
    } else {
      const script  = document.createElement('script');
      script.src    = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const L   = window.L;
    const map = mapInstanceRef.current;
    if (!L || !map) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    tpsMarkers.forEach((tps) => {
      const isOceanEarn = !String(tps.id).startsWith('osm-') && !String(tps.id).startsWith('f');
      const color       = isOceanEarn ? '#D97925' : '#0460D9';

      const icon = L.divIcon({
        className: '',
        html: `<div style="width:11px;height:11px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.30);cursor:pointer;"></div>`,
        iconSize:    [11, 11],
        iconAnchor:  [5, 5],
        popupAnchor: [0, -8],
      });

      const nama = tps.nama_tps || 'TPS';
      const loc  = [tps.kecamatan, tps.kota].filter(Boolean).join(', ') || 'Indonesia';
      const src  = isOceanEarn
        ? '<span style="color:#D97925;font-size:10px;font-weight:600">OceanEarn Mitra</span>'
        : '<span style="color:#0460D9;font-size:10px">TPS Umum</span>';

      const marker = L.marker([tps.latitude, tps.longitude], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:155px;padding:2px 0"><p style="font-weight:700;font-size:13px;margin:0 0 3px;color:#022f69">${nama}</p><p style="font-size:11px;margin:0 0 5px;color:#555">${loc}</p>${src}</div>`,
          { maxWidth: 220 }
        );

      markersRef.current.push(marker);
    });
  }, [tpsMarkers]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Info badge */}
      <div style={{
        position: 'absolute', top: '16px', left: '16px', zIndex: 1000,
        borderRadius: '14px', padding: '8px 16px',
        background: 'rgba(2,47,105,0.90)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(217,121,37,0.35)',
      }}>
        <p style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontWeight: 600, fontSize: '14px', color: '#D97925', margin: 0, lineHeight: '22px' }}>
          Wilayah Operasional
        </p>
        <p style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.70)', margin: 0, lineHeight: '18px' }}>
          {mapLoading ? 'Memuat lokasi TPS...' : `${tpsMarkers.length} titik TPS ditemukan`}
        </p>
      </div>

      {/* Legend */}
      {!mapLoading && (
        <div style={{
          position: 'absolute', bottom: '40px', left: '16px', zIndex: 1000,
          borderRadius: '10px', padding: '8px 14px',
          background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(4px)',
          border: '1px solid rgba(0,0,0,0.08)',
          display: 'flex', flexDirection: 'column', gap: '6px',
        }}>
          {tpsCount.backend > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D97925', border: '1.5px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '11px', color: '#333' }}>
                TPS OceanEarn ({tpsCount.backend})
              </span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0460D9', border: '1.5px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', flexShrink: 0 }} />
            <span style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: '11px', color: '#333' }}>
              TPS Umum ({tpsCount.osm})
            </span>
          </div>
        </div>
      )}

      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default function DataSection() {
  const [wasteData,   setWasteData]   = useState(FALLBACK_WASTE);
  const [tpsMarkers,  setTpsMarkers]  = useState([]);
  const [tpsCount,    setTpsCount]    = useState({ backend: 0, osm: 0 });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [mapLoading,  setMapLoading]  = useState(true);

  useEffect(() => {
    api.get('/submissions/stats/')
      .then(({ data }) => {
        if (data.waste_composition) setWasteData(data.waste_composition);
        setLastUpdated(new Date().toLocaleTimeString('id-ID'));
      })
      .catch(() => {});

    const backendFetch = api.get('/users/tps/public/').then(({ data }) => data).catch(() => []);
    const osmFetch     = fetchOSMWastePoints();

    Promise.all([backendFetch, osmFetch]).then(([backend, osm]) => {
      const osmData = osm.length > 0 ? osm : FALLBACK_TPS;

      const combined = [
        ...backend,
        ...osmData.filter(o =>
          !backend.some(b =>
            Math.abs(b.latitude  - o.latitude)  < 0.005 &&
            Math.abs(b.longitude - o.longitude) < 0.005
          )
        ),
      ];

      setTpsMarkers(combined);
      setTpsCount({
        backend: backend.length,
        osm: osm.length > 0 ? osm.length : FALLBACK_TPS.length,
      });
      setMapLoading(false);
    });
  }, []);

  return (
    <section className="w-full bg-white py-[80px]">
      <div style={{ maxWidth: '1920px', margin: '0 auto', paddingLeft: '64px', paddingRight: '64px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '56px' }}>
          <h2 className="font-body font-semibold text-darkBlue-800 m-0" style={{ fontSize: '40px', lineHeight: 1 }}>
            Data Sampah Real-Time
          </h2>
          {lastUpdated && (
            <span className="font-ui" style={{ fontSize: '12px', color: 'rgba(0,0,0,0.35)' }}>
              Diperbarui: {lastUpdated}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '24px', height: '560px' }}>

          {/* Donut Chart */}
          <div style={{
            width: '460px', flexShrink: 0, borderRadius: '20px', background: 'white',
            boxShadow: '0 2px 24px rgba(3,62,140,0.10)',
            border: '1px solid rgba(3,62,140,0.08)',
            padding: '40px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '28px',
          }}>
            <DonutChart data={wasteData} />
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {wasteData.map(({ label, pct, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span className="font-ui text-black" style={{ fontSize: '17px', flex: 1 }}>{label}</span>
                  <span className="font-ui font-semibold text-black" style={{ fontSize: '17px' }}>{pct}%</span>
                </div>
              ))}
            </div>
            <p className="font-ui m-0" style={{ fontSize: '11px', color: 'rgba(0,0,0,0.30)', textAlign: 'center' }}>
              Sumber: Data Platform OceanEarn
            </p>
          </div>

          {/* Leaflet Map */}
          <div style={{ flex: 1, borderRadius: '20px', overflow: 'hidden', background: '#e8e8e8' }}>
            <LeafletMap
              tpsMarkers={tpsMarkers}
              tpsCount={tpsCount}
              mapLoading={mapLoading}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
