// Genereert map-data.js (landgrenzen, hoofdsteden, buren, locaties) voor de kaart "Europa" en "Wereld".
// Gebruik:  npm i world-atlas topojson-client d3-geo world-countries country-state-city
//           node build-map-data.mjs
import fs from 'fs';
import { createRequire } from 'module';
import * as d3 from 'd3-geo';
import { feature } from 'topojson-client';

const require = createRequire(import.meta.url);
const countries = require('world-countries').filter(c => c.independent);
const { City } = require('country-state-city');
const topo = f => JSON.parse(fs.readFileSync(`node_modules/world-atlas/${f}`, 'utf8'));
const R = 6371, W = 1000;
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');

// Hoofdsteden die niet in de stedendatabase staan: [lon, lat]
const CAPITAL_FIX = {
  AE: [54.37, 24.47], CO: [-74.07, 4.71], KZ: [71.43, 51.13], MG: [47.51, -18.91], MX: [-99.13, 19.43],
  MM: [96.08, 19.76], MN: [106.92, 47.92], MR: [-15.98, 18.09], NE: [2.11, 13.51], PA: [-79.52, 8.98],
  PY: [-57.58, -25.28], SS: [31.58, 4.85], TD: [15.04, 12.13], TJ: [68.78, 38.56]
};
const cities = {};
for (const c of City.getAllCities()) (cities[c.countryCode] ??= []).push(c);
function capitalLonLat(c) {
  if (CAPITAL_FIX[c.cca2]) return CAPITAL_FIX[c.cca2];
  const hit = (cities[c.cca2] || []).find(x => norm(x.name) === norm(c.capital[0] || ''));
  return hit ? [+hit.longitude, +hit.latitude] : null;
}

// [naam, plaats, lon, lat]
const EUROPE_SPOTS = [
  ['de Eiffeltoren', 'Parijs', 2.2945, 48.8584], ['het Colosseum', 'Rome', 12.4924, 41.8902],
  ['de Sagrada Família', 'Barcelona', 2.1744, 41.4036], ['de Akropolis', 'Athene', 23.7257, 37.9715],
  ['Big Ben', 'Londen', -0.1246, 51.5007], ['de Brandenburger Tor', 'Berlijn', 13.3777, 52.5163],
  ['de Scheve Toren van Pisa', 'Pisa', 10.3966, 43.723], ['het Atomium', 'Brussel', 4.3415, 50.8949],
  ['Stonehenge', 'Salisbury', -1.8262, 51.1789], ['Slot Neuschwanstein', 'Beieren', 10.7498, 47.5576],
  ['de Matterhorn', 'Zwitserland', 7.6586, 45.9763], ['Mont-Saint-Michel', 'Normandië', -1.5115, 48.636],
  ['de Hagia Sophia', 'Istanbul', 28.98, 41.0086]
];
const WORLD_SPOTS = [
  ['het Vrijheidsbeeld', 'New York', -74.0445, 40.6892], ['Machu Picchu', 'Peru', -72.545, -13.1631],
  ['Christus de Verlosser', 'Rio de Janeiro', -43.2105, -22.9519], ['Chichén Itzá', 'Mexico', -88.5686, 20.6843],
  ['de Grote Piramide', 'Gizeh', 31.1342, 29.9792], ['de Taj Mahal', 'Agra', 78.0421, 27.1751],
  ['de Chinese Muur', 'nabij Peking', 116.5704, 40.4319], ['het Operahuis', 'Sydney', 151.2153, -33.8568],
  ['Mount Everest', 'Himalaya', 86.925, 27.9881], ['Angkor Wat', 'Cambodja', 103.867, 13.4125],
  ['de Kilimanjaro', 'Tanzania', 37.3556, -3.0674], ['de Grand Canyon', 'Arizona', -112.1129, 36.1069],
  ['Petra', 'Jordanië', 35.4444, 30.3285], ['Uluru', 'Australië', 131.0369, -25.3444],
  ['de Burj Khalifa', 'Dubai', 55.2744, 25.1972], ['de Fuji', 'Japan', 138.7274, 35.3606]
];

function build({ file, proj, h, minArea, spots, skip = [] }) {
  const path = d3.geoPath(proj).digits(1);
  const feats = feature(topo(file), topo(file).objects.countries).features.filter(f => !skip.includes(f.id));
  const inside = ([x, y], m = 8) => x > m && x < W - m && y > m && y < h - m;
  const drawn = [], byId = new Map(countries.map(c => [c.ccn3, c]));
  feats.forEach((f, i) => {
    const d = path(f);
    if (d) drawn.push({ f, d, id: f.id || `x${i}` });
  });
  const drawnIds = new Set(drawn.map(c => c.id));
  const a3 = new Map(countries.map(c => [c.cca3, c.ccn3]));
  const quiz = [];
  for (const { f, id } of drawn) {
    const c = byId.get(id);
    if (!c || d3.geoArea(f) * R * R < minArea) continue;
    // grootste deelgebied (hoofdland, geen overzeese gebieden)
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    const main = { type: 'Polygon', coordinates: polys.reduce((a, b) => (d3.geoArea({ type: 'Polygon', coordinates: b }) > d3.geoArea({ type: 'Polygon', coordinates: a }) ? b : a)) };
    const cands = [d3.geoCentroid(main), [c.latlng[1], c.latlng[0]]];
    const ll = cands.find(p => d3.geoContains(main, p)) || cands[0];
    const p = proj(ll);
    if (!p || !inside(p, 12)) continue;
    const cl = c.capital[0] && capitalLonLat(c);
    const cp = cl && proj(cl);
    const round = q => q.map(n => Math.round(n * 10) / 10);
    quiz.push({
      i: id, n: c.translations.nld.common, f: c.flag, p: round(p),
      c: cp && inside(cp, 4) ? c.capital[0] : null, cp: cp && inside(cp, 4) ? round(cp) : null,
      b: c.borders.map(x => a3.get(x)).filter(x => drawnIds.has(x))
    });
  }
  const mapSpots = spots.map(([n, w, lon, lat]) => ({ n, w, p: proj([lon, lat]).map(v => Math.round(v * 10) / 10) })).filter(s => inside(s.p, 6));
  // km per SVG-eenheid, gemeten in het midden van de kaart
  const [A, B] = h === 750 ? [[2.35, 48.86], [13.4, 52.52]] : [[0, 0], [30, 0]];
  const pa = proj(A), pb = proj(B);
  const kmPerUnit = Math.round((d3.geoDistance(A, B) * R / Math.hypot(pa[0] - pb[0], pa[1] - pb[1])) * 100) / 100;
  return { w: W, h, kmPerUnit, countries: drawn.map(({ id, d }) => ({ i: id, d })), quiz, spots: mapSpots };
}

// Europa
const eu = d3.geoConicConformal().parallels([40, 62]).rotate([-14, 0]).center([0, 52]);
const euPts = [];
for (let lon = -11; lon <= 33; lon++) euPts.push([lon, 34.5], [lon, 71.5]);
for (let lat = 34.5; lat <= 71.5; lat++) euPts.push([-11, lat], [33, lat]);
eu.fitExtent([[0, 0], [W, 750]], { type: 'MultiPoint', coordinates: euPts }).clipExtent([[0, 0], [W, 750]]).precision(0.2);

// Wereld (zonder Antarctica)
const wp = d3.geoNaturalEarth1();
const wPts = [];
for (let lon = -180; lon <= 180; lon += 5) wPts.push([lon, -58], [lon, 84]);
for (let lat = -58; lat <= 84; lat += 2) wPts.push([-180, lat], [180, lat]);
const wGeo = { type: 'MultiPoint', coordinates: wPts };
wp.fitWidth(W, wGeo);
const wH = Math.ceil(d3.geoPath(wp).bounds(wGeo)[1][1]);
wp.clipExtent([[0, 0], [W, wH]]).precision(0.2);

const data = {
  europe: build({ file: 'countries-50m.json', proj: eu, h: 750, minArea: 8000, spots: EUROPE_SPOTS }),
  world: build({ file: 'countries-110m.json', proj: wp, h: wH, minArea: 60000, spots: [...EUROPE_SPOTS, ...WORLD_SPOTS], skip: ['010'] })
};
fs.writeFileSync('map-data.js', `// Automatisch gegenereerd door build-map-data.mjs (Natural Earth / world-atlas).\n// Grenzen, steden en locaties delen dezelfde projectie: wat je ziet is wat je aanklikt.\nconst MAP_DATA = ${JSON.stringify(data)};\n`);
for (const k in data) console.log(k, 'h', data[k].h, 'countries', data[k].countries.length, 'quiz', data[k].quiz.length,
  'capitals', data[k].quiz.filter(q => q.cp).length, 'spots', data[k].spots.length, 'km/unit', data[k].kmPerUnit);
const ch = data.europe.quiz.find(q => q.i === '756');
console.log('CH', ch && ch.p, ch && ch.b);
