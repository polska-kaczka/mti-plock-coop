const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  // Optymalizacja WebSocket
  pingInterval: 10000,
  pingTimeout: 5000,
  transports: ['websocket'] // wyłącz polling
});

app.use(express.static(path.join(__dirname, 'public')));

// ==================== MAPA ====================
const T = 40, MW = 120, MH = 90;
let map = [];
for (let y = 0; y < MH; y++) { map[y] = []; for (let x = 0; x < MW; x++) map[y][x] = 0; }

function fm(x1, y1, w, h, t) { for (let y = y1; y < y1 + h; y++) for (let x = x1; x < x1 + w; x++) if (y >= 0 && y < MH && x >= 0 && x < MW) map[y][x] = t; }
function rect(x1, y1, w, h, t) { fm(x1, y1, w, 1, t); fm(x1, y1 + h - 1, w, 1, t); fm(x1, y1, 1, h, t); fm(x1 + w - 1, y1, 1, h, t); }

// Roads
fm(0, 58, MW, 2, 15); fm(0, 75, MW, 2, 15); fm(55, 0, 2, MH, 15); fm(95, 0, 2, MH, 15);
fm(0, 57, MW, 1, 3); fm(0, 60, MW, 1, 3); fm(0, 74, MW, 1, 3); fm(0, 77, MW, 1, 3);
fm(54, 0, 1, MH, 3); fm(57, 0, 1, MH, 3); fm(94, 0, 1, MH, 3); fm(97, 0, 1, MH, 3);

// MTI Building
rect(20, 15, 35, 28, 1); fm(21, 16, 33, 27, 16); fm(21, 28, 33, 3, 16);
fm(21, 16, 3, 27, 16); fm(51, 16, 3, 27, 16);
fm(24, 16, 1, 8, 1); fm(32, 16, 1, 8, 1); fm(40, 16, 1, 8, 1); fm(48, 16, 1, 8, 1);
fm(24, 24, 29, 1, 1); fm(24, 31, 1, 8, 1); fm(32, 31, 1, 8, 1); fm(40, 31, 1, 8, 1); fm(48, 31, 1, 8, 1);
fm(24, 38, 29, 1, 1); fm(24, 31, 29, 1, 1);
fm(25, 17, 7, 7, 10); fm(33, 17, 7, 7, 13); fm(41, 17, 7, 7, 13); fm(49, 17, 4, 7, 20);
for (let r = 0; r < 3; r++) { fm(26 + r * 2, 18, 1, 1, 11); fm(26 + r * 2, 20, 1, 1, 11); fm(26 + r * 2, 22, 1, 1, 11); }
for (let r = 0; r < 3; r++) { fm(34 + r * 2, 18, 1, 1, 11); fm(34 + r * 2, 20, 1, 1, 11); }
fm(42, 18, 1, 1, 11); fm(44, 18, 1, 1, 11); fm(46, 18, 1, 1, 11); fm(42, 20, 1, 1, 11); fm(44, 20, 1, 1, 11);
fm(50, 18, 1, 1, 11); fm(50, 20, 1, 1, 11);
map[24][27] = 8; map[24][36] = 8; map[24][44] = 8; map[24][50] = 8;
fm(25, 32, 7, 6, 10); fm(33, 32, 7, 6, 2); fm(41, 32, 7, 6, 12); fm(49, 32, 4, 6, 2);
fm(26, 33, 1, 1, 11); fm(28, 33, 1, 1, 11); fm(30, 33, 1, 1, 11);
fm(34, 33, 1, 1, 11); fm(36, 33, 1, 1, 11); fm(38, 33, 1, 1, 11);
fm(50, 33, 2, 1, 11);
map[31][27] = 8; map[31][36] = 8; map[31][44] = 8; map[31][50] = 8;
map[42][35] = 8; map[42][36] = 8; map[42][37] = 8; map[42][38] = 8;
fm(34, 43, 6, 3, 3); fm(23, 25, 1, 3, 18); fm(23, 29, 1, 3, 18);
map[28][38] = 19;

// Basement
fm(20, 78, 35, 10, 1); fm(21, 79, 33, 8, 25); fm(21, 82, 33, 1, 25);
fm(25, 79, 1, 8, 1); fm(30, 79, 1, 8, 1); fm(35, 79, 1, 8, 1); fm(40, 79, 1, 8, 1); fm(45, 79, 1, 8, 1); fm(50, 79, 1, 8, 1);
fm(21, 79, 4, 3, 25); fm(26, 79, 4, 3, 25); fm(31, 79, 4, 3, 25); fm(36, 79, 4, 3, 25); fm(41, 79, 4, 3, 25); fm(46, 79, 4, 3, 25); fm(51, 79, 4, 3, 25);
fm(21, 83, 4, 3, 25); fm(26, 83, 4, 3, 25); fm(31, 83, 4, 3, 25); fm(36, 83, 4, 3, 25); fm(41, 83, 4, 3, 25); fm(46, 83, 4, 3, 25); fm(51, 83, 4, 3, 25);
fm(21, 82, 33, 1, 29);
for (let bx = 22; bx < 53; bx += 5) map[82][bx] = 8;
fm(52, 40, 2, 2, 9); fm(52, 78, 2, 2, 9); fm(53, 42, 1, 36, 3);

// Gym
rect(62, 15, 18, 16, 1); fm(63, 16, 16, 14, 14); map[28][62] = 8;
fm(66, 18, 10, 1, 7); fm(66, 27, 10, 1, 7); fm(66, 18, 1, 10, 7); fm(75, 18, 1, 10, 7);
fm(58, 28, 4, 1, 3);

// HADU Restaurant
rect(62, 35, 20, 18, 1); fm(63, 36, 18, 16, 22); fm(63, 36, 6, 6, 27);
fm(64, 37, 1, 1, 11); fm(64, 39, 1, 1, 11); fm(66, 37, 1, 1, 11); fm(69, 36, 1, 6, 1);
fm(70, 36, 10, 16, 26);
for (let ty = 0; ty < 4; ty++) for (let tx = 0; tx < 3; tx++) fm(71 + tx * 3, 38 + ty * 3, 1, 1, 17);
fm(63, 42, 6, 1, 11); map[52][72] = 8; map[52][73] = 8; fm(71, 53, 4, 2, 3);
fm(63, 48, 4, 3, 12); map[48][67] = 1; map[47][65] = 8;
fm(76, 36, 4, 6, 21); fm(77, 37, 2, 1, 17); map[42][76] = 8;

// Shop
rect(5, 35, 14, 12, 1); fm(6, 36, 12, 10, 2);
fm(7, 37, 2, 1, 11); fm(7, 39, 2, 1, 11); fm(7, 41, 2, 1, 11); fm(10, 37, 2, 1, 11); fm(10, 39, 2, 1, 11);
fm(13, 37, 2, 1, 18); fm(13, 39, 2, 1, 18); fm(13, 41, 2, 1, 18);
map[46][10] = 8; map[46][11] = 8; fm(9, 47, 4, 2, 3);

// Park
fm(5, 10, 12, 20, 0);
fm(6, 11, 2, 2, 4); fm(9, 11, 2, 2, 4); fm(13, 11, 2, 2, 4);
fm(6, 16, 2, 2, 4); fm(9, 16, 2, 2, 4); fm(13, 16, 2, 2, 4);
fm(8, 14, 1, 1, 17); fm(12, 14, 1, 1, 17); fm(8, 19, 1, 1, 17); fm(12, 19, 1, 1, 17);
fm(9, 22, 4, 4, 6); fm(6, 20, 2, 2, 5); fm(14, 20, 2, 2, 5); fm(6, 27, 2, 2, 5); fm(14, 27, 2, 2, 5);
fm(8, 27, 6, 1, 3);

// Boisko
fm(62, 55, 16, 12, 7); fm(64, 57, 12, 8, 0); fm(63, 60, 1, 2, 1); fm(77, 60, 1, 2, 1);

// Parking
fm(3, 50, 15, 6, 15);
for (let i = 0; i < 5; i++) { fm(4 + i * 3, 51, 2, 1, 1); fm(4 + i * 3, 54, 2, 1, 1); }

// Gas Station
rect(100, 35, 14, 10, 1); fm(101, 36, 12, 8, 15); fm(104, 38, 2, 4, 19); fm(108, 38, 2, 4, 19);
map[44][106] = 8; fm(105, 45, 4, 2, 3);

// Police
rect(100, 15, 16, 14, 1); fm(101, 16, 14, 12, 16); fm(102, 17, 4, 4, 10); fm(108, 17, 4, 4, 10);
fm(102, 23, 4, 4, 12); fm(108, 23, 4, 4, 12); fm(106, 16, 1, 12, 1);
map[28][108] = 8; map[21][106] = 8; map[21][102] = 8; map[27][102] = 8; map[27][108] = 8;
fm(107, 29, 4, 2, 3);

// Apartment
rect(100, 50, 16, 18, 1); fm(101, 51, 14, 16, 2); fm(101, 54, 14, 1, 1); fm(101, 58, 14, 1, 1); fm(101, 62, 14, 1, 1); fm(108, 51, 1, 16, 1);
for (let fl = 0; fl < 4; fl++) { fm(102, 51 + fl * 4, 5, 3, 10); fm(109, 51 + fl * 4, 5, 3, 10); map[51 + fl * 4 + 3][104] = 8; map[51 + fl * 4 + 3][111] = 8; }
map[67][108] = 8;

// Secret Lab
fm(2, 80, 10, 8, 1); fm(3, 81, 8, 6, 25); fm(4, 82, 2, 2, 20); fm(7, 82, 2, 2, 20); map[80][6] = 8;

// Trees
for (let i = 0; i < MW; i++) { if (map[0][i] === 0 && Math.random() < .4) map[0][i] = 5; if (map[MH - 1][i] === 0 && Math.random() < .4) map[MH - 1][i] = 5; }
for (let j = 0; j < MH; j++) { if (map[j][0] === 0 && Math.random() < .4) map[j][0] = 5; if (map[j][MW - 1] === 0 && Math.random() < .4) map[j][MW - 1] = 5; }
for (let i = 0; i < 80; i++) { let rx = Math.random() * MW | 0, ry = Math.random() * MH | 0; if (map[ry][rx] === 0 && Math.random() < .15) map[ry][rx] = 5; }

// Paths
fm(34, 46, 6, 12, 3); fm(18, 46, 16, 1, 3); fm(58, 28, 4, 1, 3); fm(57, 46, 5, 1, 3);
fm(58, 35, 4, 1, 3); fm(58, 46, 14, 1, 3); fm(97, 28, 5, 1, 3); fm(97, 44, 5, 1, 3); fm(97, 60, 5, 1, 3);
fm(18, 57, 36, 1, 3); fm(58, 57, 36, 1, 3); fm(58, 74, 36, 1, 3);

function isW(tx, ty) { if (tx < 0 || ty < 0 || tx >= MW || ty >= MH) return true; let t = map[ty][tx]; return t === 1 || t === 11 || t === 4 || t === 5 || t === 6 || t === 18; }
function canWalk(tx, ty) { return !isW(tx, ty); }

// ==================== BRONIE ====================
const WPS = [
  { id: 'fists', d: 8, rng: 1.5, spd: .3, tp: 'm', ps: 0, sp: 0, ex: false },
  { id: 'bat', d: 18, rng: 2, spd: .4, tp: 'm', ps: 0, sp: 0, ex: false },
  { id: 'knife', d: 25, rng: 1.8, spd: .2, tp: 'm', ps: 0, sp: 0, ex: false },
  { id: 'katana', d: 45, rng: 2.2, spd: .35, tp: 'm', ps: 0, sp: 0, ex: false },
  { id: 'pistol', d: 20, rng: 15, spd: .25, tp: 'r', am: 80, mx: 80, ps: 18, sp: .05, ex: false },
  { id: 'shotgun', d: 12, rng: 10, spd: .55, tp: 'r', pl: 5, am: 40, mx: 40, ps: 16, sp: .25, ex: false },
  { id: 'rifle', d: 35, rng: 20, spd: .15, tp: 'r', am: 120, mx: 120, ps: 25, sp: .02, ex: false },
  { id: 'smg', d: 10, rng: 12, spd: .06, tp: 'r', am: 200, mx: 200, ps: 20, sp: .12, ex: false },
  { id: 'sniper', d: 90, rng: 30, spd: 1, tp: 'r', am: 20, mx: 20, ps: 35, sp: .005, ex: false },
  { id: 'rpg', d: 120, rng: 25, spd: 1.2, tp: 'r', am: 8, mx: 8, ps: 10, sp: 0, ex: true, br: 3 },
  { id: 'minigun', d: 8, rng: 14, spd: .04, tp: 'r', am: 500, mx: 500, ps: 22, sp: .15, ex: false },
];
function getWpn(id) { return WPS.find(w => w.id === id) || WPS[0]; }

// ==================== GAME STATE ====================
const players = {};
let projectiles = [];
let damageNumbers = [];

// NPCs — każdy NPC
const npcsTemplate = [
  { id: 'cinek', nm: 'Dyrektor Cinek', x: 44, y: 34, hp: 9e9, mhp: 9e9, c: '#e74c3c', hc: '#333', h: false, ma: { x1: 42, y1: 32, x2: 47, y2: 37 }, mt: 0, md: 4, sp: .6 },
  { id: 'nowak', nm: 'Pan Nowak', x: 26, y: 20, hp: 9e9, mhp: 9e9, c: '#3498db', hc: '#654', h: false, ma: { x1: 25, y1: 17, x2: 31, y2: 23 }, mt: 0, md: 4, sp: .5 },
  { id: 'matma', nm: 'P. Wiśniewska', x: 35, y: 20, hp: 9e9, mhp: 9e9, c: '#9b59b6', hc: '#8B0000', h: false, ma: { x1: 33, y1: 17, x2: 39, y2: 23 }, mt: 0, md: 4, sp: .4 },
  { id: 'biblio', nm: 'P. Kamińska', x: 43, y: 20, hp: 9e9, mhp: 9e9, c: '#1abc9c', hc: '#A05', h: false, ma: { x1: 41, y1: 17, x2: 47, y2: 23 }, mt: 0, md: 4, sp: .3 },
  { id: 'wf', nm: 'P. Zawadzki', x: 70, y: 22, hp: 9e9, mhp: 9e9, c: '#2ecc71', hc: '#000', h: false, ma: { x1: 63, y1: 16, x2: 78, y2: 29 }, mt: 0, md: 4, sp: 1 },
  { id: 'wozny', nm: 'P. Stanisław', x: 34, y: 50, hp: 9e9, mhp: 9e9, c: '#795548', hc: '#aaa', h: false, ma: { x1: 30, y1: 48, x2: 40, y2: 56 }, mt: 0, md: 4, sp: .7 },
  { id: 'fizyk', nm: 'P. Dąbrowski', x: 27, y: 34, hp: 9e9, mhp: 9e9, c: '#00bcd4', hc: '#555', h: false, ma: { x1: 25, y1: 32, x2: 31, y2: 37 }, mt: 0, md: 4, sp: .4 },
  { id: 'kuba', nm: 'Kuba', x: 30, y: 28, hp: 9e9, mhp: 9e9, c: '#f39c12', hc: '#654', h: false, ma: { x1: 21, y1: 28, x2: 53, y2: 30 }, mt: 0, md: 4, sp: 1.5 },
  { id: 'asia', nm: 'Asia', x: 40, y: 28, hp: 9e9, mhp: 9e9, c: '#e91e63', hc: '#8B4', h: false, ma: { x1: 21, y1: 28, x2: 53, y2: 30 }, mt: 0, md: 4, sp: 1.2 },
  { id: 'hadu_mgr', nm: 'Marcin HADU', x: 72, y: 40, hp: 9e9, mhp: 9e9, c: '#ff6f00', hc: '#333', h: false, ma: { x1: 70, y1: 36, x2: 79, y2: 51 }, mt: 0, md: 4, sp: .6 },
  { id: 'sklep', nm: 'Zosia', x: 10, y: 40, hp: 9e9, mhp: 9e9, c: '#4caf50', hc: '#D4A', h: false, ma: { x1: 6, y1: 36, x2: 17, y2: 45 }, mt: 0, md: 4, sp: .4 },
  { id: 'sierzant', nm: 'Sierżant Kowal', x: 104, y: 20, hp: 9e9, mhp: 9e9, c: '#1565c0', hc: '#333', h: false, ma: { x1: 101, y1: 16, x2: 115, y2: 27 }, mt: 0, md: 4, sp: .7 },
  { id: 'notch', nm: 'Notch', x: 5, y: 83, hp: 9e9, mhp: 9e9, c: '#8B4513', hc: '#333', h: false, ma: { x1: 3, y1: 81, x2: 9, y2: 86 }, mt: 0, md: 0, sp: 0 },
  { id: 'ghost', nm: 'Duch', x: 38, y: 82, hp: 9e9, mhp: 9e9, c: 'rgba(200,200,255,0.5)', hc: '#fff', h: false, ma: { x1: 21, y1: 79, x2: 53, y2: 86 }, mt: 0, md: 4, sp: 1 },
];

let npcs = JSON.parse(JSON.stringify(npcsTemplate));

let enemies = [];
function spawnEnemies() {
  enemies = [];
  for (let i = 0; i < 4; i++) enemies.push({ id: 'bul' + i, nm: 'Chuligan', tp: 'bully', x: 64 + i * 3, y: 58 + Math.random() * 4, hp: 60, mhp: 60, c: '#886600', hc: '#111', sp: 1.8, dmg: 10, ar: 1.8, acd: 0, agr: 8, ma: { x1: 60, y1: 55, x2: 77, y2: 66 }, mt: 0, md: Math.random() * 4 | 0, boss: false, loot: i === 3 ? 'apteczka' : null });
  enemies.push({ id: 'mecha', nm: 'MECHA-MAREK', tp: 'boss201', x: 50, y: 19, hp: 600, mhp: 600, c: '#f00', hc: '#333', sp: 1, dmg: 25, ar: 9, acd: 0, agr: 12, ma: { x1: 49, y1: 17, x2: 52, y2: 23 }, mt: 0, md: 0, boss: true, sh: 120, msh: 120, sr: 0, phase: 1, loot: 'super_apteczka' });
  for (let i = 0; i < 5; i++) enemies.push({ id: 'rat' + i, nm: 'Szczur', tp: 'basement', x: 25 + i * 5, y: 81 + Math.random() * 3, hp: 40, mhp: 40, c: '#555', hc: '#333', sp: 2.5, dmg: 12, ar: 1.5, acd: 0, agr: 6, ma: { x1: 21, y1: 79, x2: 53, y2: 86 }, mt: 0, md: Math.random() * 4 | 0, boss: false, loot: null });
  enemies.push({ id: 'shadow', nm: 'Cień', tp: 'basement_boss', x: 40, y: 84, hp: 250, mhp: 250, c: '#220044', hc: '#000', sp: 1.5, dmg: 20, ar: 5, acd: 0, agr: 10, ma: { x1: 21, y1: 79, x2: 53, y2: 86 }, mt: 0, md: 0, boss: true, loot: 'katana' });
  enemies.push({ id: 'trevor', nm: 'Trevor', tp: 'gta', x: 103, y: 40, hp: 200, mhp: 200, c: '#8B0000', hc: '#654', sp: 2, dmg: 20, ar: 6, acd: 0, agr: 10, ma: { x1: 98, y1: 35, x2: 113, y2: 44 }, mt: 0, md: 0, boss: true, loot: 'minigun' });
  enemies.push({ id: 'michael', nm: 'Michael', tp: 'gta', x: 108, y: 55, hp: 180, mhp: 180, c: '#1a237e', hc: '#333', sp: 1.5, dmg: 30, ar: 12, acd: 0, agr: 12, ma: { x1: 100, y1: 50, x2: 115, y2: 66 }, mt: 0, md: 0, boss: true, loot: 'super_apteczka' });
  enemies.push({ id: 'franklin', nm: 'Franklin', tp: 'gta', x: 112, y: 62, hp: 150, mhp: 150, c: '#1b5e20', hc: '#111', sp: 3, dmg: 15, ar: 4, acd: 0, agr: 10, ma: { x1: 100, y1: 55, x2: 115, y2: 67 }, mt: 0, md: 0, boss: true, loot: 'apteczka' });
}
spawnEnemies();

let vehicles = [
  { id: 'fiat', name: 'Fiat 126p', x: 8, y: 52, angle: 0, speed: 0, maxSpeed: 8, color: '#4a9', w: 2.5, h: 1.5, fuel: 100, driver: null },
  { id: 'suv', name: 'SUV', x: 12, y: 52, angle: 0, speed: 0, maxSpeed: 12, color: '#369', w: 3, h: 1.8, fuel: 100, driver: null },
  { id: 'police', name: 'Radiowóz', x: 109, y: 30, angle: Math.PI, speed: 0, maxSpeed: 15, color: '#fff', w: 3, h: 1.8, fuel: 100, driver: null },
  { id: 'sports', name: 'Infernus', x: 105, y: 40, angle: 0, speed: 0, maxSpeed: 20, color: '#f22', w: 3.2, h: 1.6, fuel: 100, driver: null },
];

// ==================== PLAYER ====================
function createPlayer(id) {
  return {
    id, x: 36 + (Math.random() - .5) * 4, y: 56 + (Math.random() - .5) * 2,
    hp: 100, mhp: 100, dir: 0, mv: false, aim: 0, dead: false,
    inv: [], q: [], qd: [], money: 50, xp: 0, lvl: 1,
    ulk: ['fists'], cwi: 0, wcd: 0, ammo: {},
    vehicleId: null, godMode: false,
    name: 'Gracz', color: '#3498db', kills: 0,
    keys: {}, shooting: false, lastInput: 0
  };
}

function getPlayerWeapon(p) { return getWpn(p.ulk[p.cwi] || 'fists'); }

// ==================== DIALOGI (per player) ====================
const dialogDefs = {
  cinek: [
    { t: 'Witam w MTI! Jestem dyrektor Cinek.', ch: [{ t: 'Co się dzieje?', n: 1 }, { t: 'O szkole', n: 6 }, { t: 'Pa', n: -1 }] },
    { t: 'Mamy problemy:\n1) Pendrive Nowaka\n2) Chuligani\n3) Boss MECHA-MAREK\n4) Piwnica\n5) Tajne lab\nI gang GTA!', ch: [{ t: 'Biorę!', n: 2 }, { t: 'Za dużo', n: 3 }] },
    { t: 'Oto pistolet i kij!', give: ['pistol', 'bat'], quests: ['find_pendrive', 'clear_bullies', 'boss_201', 'explore_basement', 'secret_lab', 'gta_gang'], ch: [{ t: 'Dzięki!', n: -1 }] },
    { t: 'Weź chociaż kij...', give: ['bat'], ch: [{ t: 'OK', n: -1 }] },
    { t: 'Pokonaj bossa w 201!', ch: [{ t: 'OK', n: -1 }] },
    { t: 'BRAWO! Katana i 100zł!', give: ['katana'], money: 100, ch: [{ t: 'Super!', n: -1 }] },
    { t: 'MTI od 1965 roku! 800 uczniów, pracownie z RTX 4060!', ch: [{ t: 'Wow!', n: -1 }] }
  ],
  nowak: [
    { t: 'Cześć! Mój pendrive zaginął!', ch: [{ t: 'Mam go!', n: 1, rq: 'pendrive' }, { t: 'Broń?', n: 2 }, { t: 'Pa', n: -1 }] },
    { t: 'Super! Oto karabin!', give: ['rifle'], remove: 'pendrive', cq: 'find_pendrive', ch: [{ t: 'Dzięki!', n: -1 }] },
    { t: 'Shotgun i SMG!', give: ['shotgun', 'smg'], ch: [{ t: 'Wow!', n: -1 }] }
  ],
  matma: [
    { t: 'Quiz! x²-5x+6=0, suma pierwiastków?', ch: [{ t: '5', n: 1 }, { t: '6', n: 2 }, { t: '11', n: 2 }] },
    { t: 'Brawo! Nóż i apteczka!', give: ['knife', 'apteczka'], ch: [{ t: 'Dzięki!', n: -1 }] },
    { t: 'Źle! -b/a = 5.', ch: [{ t: 'Spróbuję', n: 0 }] }
  ],
  biblio: [
    { t: 'Biblioteka! Szukasz?', ch: [{ t: 'Pendrive?', n: 1 }, { t: 'Nie', n: -1 }] },
    { t: 'Pod biurkiem!', give: ['pendrive'], ch: [{ t: 'Dzięki!', n: -1 }] }
  ],
  wf: [{ t: 'RPG na bossa!', give: ['rpg'], quests: ['clear_bullies'], ch: [{ t: 'Dzięki!', n: -1 }] }],
  wozny: [
    { t: 'Klucz do piwnicy?', ch: [{ t: 'Tak!', n: 1 }, { t: 'Pa', n: -1 }] },
    { t: 'Uważaj tam!', give: ['klucz_piwnica'], quests: ['explore_basement'], ch: [{ t: 'OK!', n: -1 }] }
  ],
  fizyk: [{ t: 'Super apteczka!', give: ['super_apteczka'], ch: [{ t: 'Dzięki!', n: -1 }] }],
  kuba: [{ t: 'Boss tip: faza 2 przy 50%HP, faza 3 przy 20%!', ch: [{ t: 'OK!', n: -1 }] }],
  asia: [{ t: 'W stawie w parku jest minigun!', ch: [{ t: 'Dzięki!', n: -1 }] }],
  hadu_mgr: [
    { t: 'HADU! Burger 10zł(+30HP), Pizza 15zł(+50HP), Stek 25zł(+80HP)', ch: [{ t: 'Burger', n: 1 }, { t: 'Pizza', n: 2 }, { t: 'Stek', n: 3 }, { t: 'Pa', n: -1 }] },
    { t: '+30HP!', cost: 10, heal: 30, ch: [{ t: 'Mniam', n: 0 }] },
    { t: '+50HP!', cost: 15, heal: 50, ch: [{ t: 'Mniam', n: 0 }] },
    { t: '+80HP +10maxHP!', cost: 25, heal: 80, maxhp: 10, ch: [{ t: 'Mniam', n: 0 }] }
  ],
  sklep: [
    { t: 'Sklep! Apteczka 15zł, Super 25zł, Ammo 20zł, Kamizelka 40zł', ch: [{ t: 'Apteczka', n: 1 }, { t: 'Super', n: 2 }, { t: 'Ammo', n: 3 }, { t: 'Kamizelka', n: 4 }, { t: 'Pa', n: -1 }] },
    { t: 'Apteczka!', cost: 15, give: ['apteczka'], ch: [{ t: 'OK', n: 0 }] },
    { t: 'Super!', cost: 25, give: ['super_apteczka'], ch: [{ t: 'OK', n: 0 }] },
    { t: 'Przeładowano!', cost: 20, refillAmmo: true, ch: [{ t: 'OK', n: 0 }] },
    { t: '+25 maxHP!', cost: 40, maxhp: 25, healExtra: 25, ch: [{ t: 'OK', n: 0 }] }
  ],
  sierzant: [
    { t: 'Gang GTA grasuje! 100zł + snajperka!', quests: ['gta_gang'], ch: [{ t: 'Biorę!', n: 1 }, { t: 'Pa', n: -1 }] },
    { t: 'Trevor=minigun, Michael=snajper, Franklin=szybki!', give: ['sniper'], ch: [{ t: 'Idę!', n: -1 }] }
  ],
  notch: [{ t: 'Tajne lab! Oto minigun.', give: ['minigun'], cq: 'secret_lab', ch: [{ t: 'Whoa!', n: -1 }] }],
  ghost: [{ t: 'Jestem duchem... KONAMI=God Mode!', give: ['kapsula_czasu'], cq: 'explore_basement', ch: [{ t: 'Wow', n: -1 }] }]
};

function processDialog(pid, npcId, stepIdx) {
  let p = players[pid];
  if (!p) return;
  let dlg = dialogDefs[npcId];
  if (!dlg || stepIdx < 0 || stepIdx >= dlg.length) return;
  let s = dlg[stepIdx];
  if (s.cost && p.money < s.cost) { io.to(pid).emit('notify', 'Brak kasy!'); return; }
  if (s.cost) p.money -= s.cost;
  if (s.heal) p.hp = Math.min(p.mhp + (s.maxhp || 0), p.hp + s.heal);
  if (s.maxhp) { p.mhp += s.maxhp; if (s.healExtra) p.hp += s.healExtra; }
  if (s.money) p.money += s.money;
  if (s.give) s.give.forEach(g => { if (!p.inv.includes(g)) p.inv.push(g); let wp = getWpn(g); if (wp.id !== 'fists' && !p.ulk.includes(g)) p.ulk.push(g); });
  if (s.remove) p.inv = p.inv.filter(i => i !== s.remove);
  if (s.quests) s.quests.forEach(q => { if (!p.q.includes(q) && !p.qd.includes(q)) p.q.push(q); });
  if (s.cq) { p.q = p.q.filter(q => q !== s.cq); if (!p.qd.includes(s.cq)) p.qd.push(s.cq); }
  if (s.refillAmmo) { let w = getPlayerWeapon(p); if (w.mx) p.ammo[w.id] = w.mx; }
}

// ==================== COMBAT ====================
function hitEntity(target, dmg, attackerId, isPlayer = false) {
  if (target.dead) return;
  if (target.sh && target.sh > 0) {
    target.sh -= dmg;
    damageNumbers.push({ x: target.x, y: target.y - 1.5, t: '-' + dmg + '🛡️', c: '#4fc3f7', tm: 1 });
    if (target.sh <= 0) target.sh = 0;
    return;
  }
  target.hp -= dmg;
  damageNumbers.push({ x: target.x, y: target.y - 1.5, t: '-' + dmg, c: '#f44', tm: 1 });

  if (target.hp <= 0) {
    target.hp = 0;
    target.dead = true;
    let attacker = players[attackerId];
    if (attacker) {
      attacker.kills++;
      attacker.xp += target.boss ? 50 : (isPlayer ? 25 : 10);
      attacker.money += target.boss ? 50 : (isPlayer ? 20 : 10);
      if (attacker.xp >= attacker.lvl * 100) { attacker.lvl++; attacker.mhp += 10; attacker.hp = attacker.mhp; io.to(attackerId).emit('notify', '⭐ LEVEL UP!'); }
      if (target.loot && !isPlayer) {
        attacker.inv.push(target.loot);
        let wp = getWpn(target.loot);
        if (wp.id !== 'fists' && !attacker.ulk.includes(target.loot)) attacker.ulk.push(target.loot);
      }
      // Quests
      if (target.tp === 'bully' && !enemies.some(e => e.tp === 'bully' && !e.dead) && attacker.q.includes('clear_bullies')) {
        attacker.q = attacker.q.filter(q => q !== 'clear_bullies'); attacker.qd.push('clear_bullies');
        io.to(attackerId).emit('notify', '🎉 Chuligani pokonani!');
      }
      if (target.tp === 'boss201' && attacker.q.includes('boss_201')) {
        attacker.q = attacker.q.filter(q => q !== 'boss_201'); attacker.qd.push('boss_201');
        io.to(attackerId).emit('notify', '🏆 BOSS DEFEATED!');
      }
      if (target.tp === 'gta' && !enemies.some(e => e.tp === 'gta' && !e.dead) && attacker.q.includes('gta_gang')) {
        attacker.q = attacker.q.filter(q => q !== 'gta_gang'); attacker.qd.push('gta_gang');
        attacker.money += 100;
        io.to(attackerId).emit('notify', '🎉 Gang GTA pokonany! +100zł');
      }
    }
    if (isPlayer) {
      io.to(target.id).emit('died');
      damageNumbers.push({ x: target.x, y: target.y - 2, t: '☠️ KILLED BY ' + (attacker ? attacker.name : '?'), c: '#f00', tm: 2 });
    }
  }
}

function hitPlayer(target, dmg, attackerId) {
  if (target.dead || target.godMode) return;
  target.hp -= dmg;
  damageNumbers.push({ x: target.x, y: target.y - 1.5, t: '-' + dmg, c: '#f44', tm: 1 });
  if (target.hp <= 0) {
    target.hp = 0;
    target.dead = true;
    io.to(target.id).emit('died');
    let attacker = players[attackerId];
    if (attacker) {
      attacker.kills++;
      attacker.money += 20;
      attacker.xp += 25;
      if (attacker.xp >= attacker.lvl * 100) { attacker.lvl++; attacker.mhp += 10; attacker.hp = attacker.mhp; io.to(attackerId).emit('notify', '⭐ LEVEL UP!'); }
      io.to(attackerId).emit('notify', '💀 Zabiłeś ' + target.name + '!');
    }
    damageNumbers.push({ x: target.x, y: target.y - 2, t: '☠️ ' + target.name, c: '#f00', tm: 2 });
  }
}

function boom(x, y, r, dmg, attackerId) {
  enemies.forEach(t => { if (!t.dead && Math.hypot(t.x - x, t.y - y) < r) hitEntity(t, dmg, attackerId); });
  for (let pid in players) {
    let p = players[pid];
    if (!p.dead && !p.godMode && Math.hypot(p.x - x, p.y - y) < r && pid !== attackerId) {
      hitPlayer(p, Math.floor(dmg * .5), attackerId);
    }
  }
}

function serverAttack(pid) {
  let p = players[pid];
  if (!p || p.dead || p.wcd > 0) return;
  let w = getPlayerWeapon(p);

  // Check ammo
  if (w.mx) {
    if (!p.ammo[w.id]) p.ammo[w.id] = w.mx;
    if (p.ammo[w.id] <= 0) { io.to(pid).emit('notify', 'BRAK AMUNICJI!'); return; }
    p.ammo[w.id]--;
  }

  p.wcd = w.spd;

  if (w.tp === 'm') {
    // Melee - hit enemies
    enemies.forEach(t => {
      if (t.dead) return;
      let d = Math.hypot(p.x - t.x, p.y - t.y);
      if (d < w.rng) {
        let a = Math.atan2(t.y - p.y, t.x - p.x), df = Math.abs(a - p.aim);
        if (df > Math.PI) df = Math.PI * 2 - df;
        if (df < 1.2) hitEntity(t, w.d, pid);
      }
    });
    // PvP melee
    for (let oid in players) {
      if (oid === pid) continue;
      let other = players[oid];
      if (other.dead) continue;
      let d = Math.hypot(p.x - other.x, p.y - other.y);
      if (d < w.rng) {
        let a = Math.atan2(other.y - p.y, other.x - p.x), df = Math.abs(a - p.aim);
        if (df > Math.PI) df = Math.PI * 2 - df;
        if (df < 1.2) hitPlayer(other, w.d, pid);
      }
    }
  } else {
    // Ranged
    let pl = w.pl || 1;
    for (let i = 0; i < pl; i++) {
      let a = p.aim + (Math.random() - .5) * (w.sp || 0) * 2;
      projectiles.push({ x: p.x, y: p.y, vx: Math.cos(a) * w.ps, vy: Math.sin(a) * w.ps, d: w.d, rng: w.rng, dst: 0, ow: pid, ex: w.ex || false, br: w.br || 0 });
    }
  }
}

// ==================== UPDATE FUNCTIONS ====================
function findClosestPlayer(x, y, maxDist) {
  let closest = null, cd = maxDist;
  for (let pid in players) {
    let p = players[pid];
    if (p.dead) continue;
    let d = Math.hypot(p.x - x, p.y - y);
    if (d < cd) { cd = d; closest = p; }
  }
  return closest;
}

function updateAI(dt) {
  [...npcs, ...enemies].forEach(n => {
    if (n.dead) return;
    let cp = findClosestPlayer(n.x, n.y, n.h ? (n.agr || 8) : 3);

    if (n.h && cp) {
      let d = Math.hypot(cp.x - n.x, cp.y - n.y);
      n.acd = Math.max(0, (n.acd || 0) - dt);
      if (d < (n.agr || 8)) {
        let a = Math.atan2(cp.y - n.y, cp.x - n.x);
        if (d > (n.ar || 1.8) * .8) {
          let nx = n.x + Math.cos(a) * n.sp * dt, ny = n.y + Math.sin(a) * n.sp * dt;
          if (canWalk(Math.floor(nx), Math.floor(ny))) { n.x = nx; n.y = ny; }
        }
        if (d < (n.ar || 1.8) && n.acd <= 0) {
          n.acd = n.boss ? .7 : 1;
          if (n.boss && n.ar > 3) {
            let a2 = Math.atan2(cp.y - n.y, cp.x - n.x);
            projectiles.push({ x: n.x, y: n.y, vx: Math.cos(a2) * 8, vy: Math.sin(a2) * 8, d: n.dmg, rng: 15, dst: 0, ow: 'enemy', ex: false });
            if (n.phase && n.hp < n.mhp * .5 && n.phase === 1) { n.phase = 2; n.sp = 1.8; }
            if (n.phase === 2) for (let i = -1; i <= 1; i++) projectiles.push({ x: n.x, y: n.y, vx: Math.cos(a2 + i * .4) * 9, vy: Math.sin(a2 + i * .4) * 9, d: Math.floor(n.dmg * .5), rng: 12, dst: 0, ow: 'enemy', ex: false });
            if (n.phase && n.hp < n.mhp * .2 && n.phase === 2) { n.phase = 3; n.sp = 2; }
            if (n.phase === 3) projectiles.push({ x: n.x, y: n.y, vx: Math.cos(a2) * 6, vy: Math.sin(a2) * 6, d: 40, rng: 15, dst: 0, ow: 'enemy', ex: true, br: 2 });
            if (n.sh !== undefined && n.sh < n.msh) { n.sr = (n.sr || 0) + dt; if (n.sr > 6) { n.sh = Math.min(n.msh, n.sh + 25); n.sr = 0; } }
          } else if (n.boss) {
            let a2 = Math.atan2(cp.y - n.y, cp.x - n.x);
            projectiles.push({ x: n.x, y: n.y, vx: Math.cos(a2) * 10, vy: Math.sin(a2) * 10, d: n.dmg, rng: n.ar, dst: 0, ow: 'enemy', ex: false });
          } else {
            if (!cp.godMode) hitPlayer(cp, n.dmg, null);
          }
        }
        return;
      }
    }
    // Patrol
    n.mt = (n.mt || 0) - dt;
    if (n.mt <= 0) { n.md = Math.floor(Math.random() * 6); n.mt = 1 + Math.random() * 3; }
    if (n.md < 4 && n.ma) {
      let dirs = [[0, 1], [-1, 0], [0, -1], [1, 0]], dd = dirs[n.md];
      let nx = n.x + dd[0] * (n.sp || .5) * dt, ny = n.y + dd[1] * (n.sp || .5) * dt;
      if (nx >= n.ma.x1 && nx <= n.ma.x2 && ny >= n.ma.y1 && ny <= n.ma.y2 && canWalk(Math.floor(nx), Math.floor(ny))) { n.x = nx; n.y = ny; }
      else n.md = (n.md + 1) % 4;
    }
  });
}

function updateProjectiles(dt) {
  projectiles.forEach(p => {
    p.x += p.vx * dt; p.y += p.vy * dt; p.dst += Math.hypot(p.vx, p.vy) * dt;
    if (isW(Math.floor(p.x), Math.floor(p.y))) { if (p.ex) boom(p.x, p.y, p.br, p.d, p.ow); p.dead = true; return; }
    if (p.dst > p.rng) { if (p.ex) boom(p.x, p.y, p.br, p.d, p.ow); p.dead = true; return; }

    if (p.ow !== 'enemy') {
      // Hit enemies
      enemies.forEach(t => {
        if (t.dead || p.dead) return;
        if (Math.hypot(t.x - p.x, t.y - p.y) < .8) { if (p.ex) boom(p.x, p.y, p.br, p.d, p.ow); else hitEntity(t, p.d, p.ow); p.dead = true; }
      });
      // PvP - hit other players
      for (let pid in players) {
        if (pid === p.ow || p.dead) continue;
        let pl = players[pid];
        if (pl.dead) continue;
        if (Math.hypot(pl.x - p.x, pl.y - p.y) < .6) {
          if (p.ex) boom(p.x, p.y, p.br, p.d, p.ow);
          else hitPlayer(pl, p.d, p.ow);
          p.dead = true;
        }
      }
    } else {
      // Enemy projectile - hit players
      for (let pid in players) {
        let pl = players[pid];
        if (pl.dead || p.dead) continue;
        if (Math.hypot(pl.x - p.x, pl.y - p.y) < .6 && !pl.godMode) {
          hitPlayer(pl, p.d, null);
          p.dead = true;
        }
      }
    }
  });
  projectiles = projectiles.filter(p => !p.dead);
}

function updatePlayers(dt) {
  for (let pid in players) {
    let p = players[pid];
    if (p.dead) continue;
    p.wcd = Math.max(0, p.wcd - dt);
    let K = p.keys;

    if (p.vehicleId) {
      let v = vehicles.find(ve => ve.id === p.vehicleId);
      if (!v || v.driver !== pid) { p.vehicleId = null; continue; }
      if (K.w) v.speed = Math.min(v.maxSpeed, v.speed + dt * 8);
      else if (K.s) v.speed = Math.max(-v.maxSpeed / 2, v.speed - dt * 8);
      else v.speed *= .97;
      if (K.a) v.angle -= dt * 2.5;
      if (K.d) v.angle += dt * 2.5;
      let nx = v.x + Math.cos(v.angle) * v.speed * dt, ny = v.y + Math.sin(v.angle) * v.speed * dt;
      if (canWalk(Math.floor(nx), Math.floor(ny))) { v.x = nx; v.y = ny; p.x = v.x; p.y = v.y; } else v.speed *= -.3;
      v.fuel -= Math.abs(v.speed) * dt * .1;
      if (v.fuel <= 0) { v.fuel = 0; v.speed = 0; }
    } else {
      let dx = 0, dy = 0; p.mv = false;
      if (K.w) { dy = -1; p.dir = 2; p.mv = true; }
      if (K.s) { dy = 1; p.dir = 0; p.mv = true; }
      if (K.a) { dx = -1; p.dir = 1; p.mv = true; }
      if (K.d) { dx = 1; p.dir = 3; p.mv = true; }
      if (dx && dy) { dx *= .707; dy *= .707; }
      let nx = p.x + dx * 4 * dt, ny = p.y + dy * 4 * dt, m = .25;
      if (canWalk(Math.floor(nx - m), Math.floor(p.y - m)) && canWalk(Math.floor(nx + m), Math.floor(p.y + m))) p.x = nx;
      if (canWalk(Math.floor(p.x - m), Math.floor(ny - m)) && canWalk(Math.floor(p.x + m), Math.floor(ny + m))) p.y = ny;
    }

    if (p.shooting) serverAttack(pid);
  }
}

// ==================== INTERAKCJE ====================
function handleInteract(pid) {
  let p = players[pid];
  if (!p || p.dead) return;

  for (let n of npcs) {
    if (!n.dead && !n.h && Math.hypot(p.x - n.x, p.y - n.y) < 3) {
      let dlg = dialogDefs[n.id];
      if (dlg) io.to(pid).emit('openDialog', { npcId: n.id, npcName: n.nm, steps: dlg, playerInv: p.inv, playerMoney: p.money });
      return;
    }
  }

  // Interaktywne obiekty
  let ix = Math.floor(p.x), iy = Math.floor(p.y);
  if (Math.hypot(p.x - 38, p.y - 28) < 2) { p.hp = Math.min(p.mhp, p.hp + 10); io.to(pid).emit('notify', '+10HP Cola!'); return; }
  if (Math.hypot(p.x - 10, p.y - 23) < 2) { p.hp = Math.min(p.mhp, p.hp + 20); io.to(pid).emit('notify', '+20HP Fontanna!'); return; }
  if (Math.hypot(p.x - 52, p.y - 40) < 2) { if (p.inv.includes('klucz_piwnica')) { p.x = 52; p.y = 78; io.to(pid).emit('notify', '⚠️ PIWNICA'); } else io.to(pid).emit('notify', 'Potrzebujesz klucza!'); return; }
  if (Math.hypot(p.x - 52, p.y - 78) < 2) { p.x = 52; p.y = 41; io.to(pid).emit('notify', 'Parter MTI'); return; }
  if (Math.hypot(p.x - 10, p.y - 24) < 2 && !p.inv.includes('minigun')) { p.inv.push('minigun'); p.ulk.push('minigun'); io.to(pid).emit('notify', '🔥 Minigun!'); return; }
  if (Math.hypot(p.x - 106, p.y - 44) < 2 && p.vehicleId) { let v = vehicles.find(ve => ve.id === p.vehicleId); if (v) { v.fuel = 100; io.to(pid).emit('notify', '⛽ Zatankowano!'); } return; }
}

function handleVehicle(pid) {
  let p = players[pid];
  if (!p || p.dead) return;

  if (p.vehicleId) {
    let v = vehicles.find(ve => ve.id === p.vehicleId);
    if (v) { v.speed = 0; v.driver = null; p.x = v.x + 2; p.y = v.y; }
    p.vehicleId = null;
    return;
  }

  for (let v of vehicles) {
    if (v.driver) continue;
    if (Math.hypot(p.x - v.x, p.y - v.y) < 3) {
      p.vehicleId = v.id;
      v.driver = pid;
      io.to(pid).emit('notify', '🚗 ' + v.name);
      return;
    }
  }
}

// ==================== GAME LOOP ====================
const TICK_RATE = 20;
let lastTick = Date.now();

function gameTick() {
  let now = Date.now();
  let dt = Math.min((now - lastTick) / 1000, .1);
  lastTick = now;

  updatePlayers(dt);
  updateAI(dt);
  updateProjectiles(dt);

  damageNumbers.forEach(d => d.tm -= dt);
  damageNumbers = damageNumbers.filter(d => d.tm > 0);

  // Build minimal state
  let ps = {};
  for (let pid in players) {
    let p = players[pid];
    ps[pid] = {
      x: Math.round(p.x * 100) / 100,
      y: Math.round(p.y * 100) / 100,
      hp: p.hp, mhp: p.mhp, dir: p.dir, mv: p.mv, aim: Math.round(p.aim * 100) / 100,
      dead: p.dead, name: p.name, color: p.color, vehicleId: p.vehicleId, godMode: p.godMode,
      inv: p.inv, q: p.q, qd: p.qd, money: p.money, xp: p.xp, lvl: p.lvl,
      ulk: p.ulk, cwi: p.cwi, kills: p.kills, ammo: p.ammo
    };
  }

  let ns = npcs.map(n => ({ id: n.id, nm: n.nm, x: Math.round(n.x * 100) / 100, y: Math.round(n.y * 100) / 100, c: n.c, hc: n.hc, h: n.h, dead: n.dead }));
  let es = enemies.filter(e => !e.dead).map(e => ({ id: e.id, nm: e.nm, x: Math.round(e.x * 100) / 100, y: Math.round(e.y * 100) / 100, hp: e.hp, mhp: e.mhp, c: e.c, hc: e.hc, boss: e.boss, sh: e.sh, msh: e.msh, phase: e.phase }));
  let pj = projectiles.map(p => ({ x: Math.round(p.x * 100) / 100, y: Math.round(p.y * 100) / 100, ow: p.ow }));
  let vs = vehicles.map(v => ({ id: v.id, name: v.name, x: Math.round(v.x * 100) / 100, y: Math.round(v.y * 100) / 100, angle: Math.round(v.angle * 100) / 100, speed: Math.round(v.speed * 10) / 10, color: v.color, w: v.w, h: v.h, fuel: Math.round(v.fuel), driver: v.driver }));
  let dm = damageNumbers.map(d => ({ x: Math.round(d.x * 100) / 100, y: Math.round(d.y * 100) / 100, t: d.t, c: d.c, tm: Math.round(d.tm * 100) / 100 }));

  io.volatile.emit('state', { p: ps, n: ns, e: es, pr: pj, v: vs, d: dm });
}

setInterval(gameTick, 1000 / TICK_RATE);

// ==================== SOCKET ====================
let playerCount = 0;
const COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c', '#e91e63', '#00bcd4'];

io.on('connection', (socket) => {
  console.log('+ Gracz:', socket.id);
  playerCount++;

  let p = createPlayer(socket.id);
  p.name = 'Gracz ' + playerCount;
  p.color = COLORS[(playerCount - 1) % COLORS.length];
  players[socket.id] = p;

  socket.emit('init', { map, playerId: socket.id, playerName: p.name, playerColor: p.color });

  socket.on('input', data => {
    let p = players[socket.id];
    if (!p) return;
    p.keys = data.k || {};
    p.aim = data.a || 0;
    p.shooting = data.s || false;
  });

  socket.on('interact', () => handleInteract(socket.id));
  socket.on('switchWeapon', () => { let p = players[socket.id]; if (p) p.cwi = (p.cwi + 1) % p.ulk.length; });
  socket.on('useItem', data => {
    let p = players[socket.id];
    if (!p) return;
    if (data.i === 'apteczka' && p.inv.includes('apteczka')) { p.inv = p.inv.filter(i => i !== 'apteczka'); p.hp = Math.min(p.mhp, p.hp + 30); }
    if (data.i === 'super_apteczka' && p.inv.includes('super_apteczka')) { p.inv = p.inv.filter(i => i !== 'super_apteczka'); p.hp = Math.min(p.mhp, p.hp + 50); }
  });
  socket.on('toggleVehicle', () => handleVehicle(socket.id));
  socket.on('dialogChoice', data => processDialog(socket.id, data.npcId, data.stepIdx));
  socket.on('respawn', () => {
    let p = players[socket.id];
    if (!p) return;
    p.dead = false; p.hp = p.mhp; p.x = 36 + (Math.random() - .5) * 4; p.y = 56;
    if (p.vehicleId) { let v = vehicles.find(ve => ve.id === p.vehicleId); if (v) v.driver = null; p.vehicleId = null; }
  });
  socket.on('teleport', data => {
    let p = players[socket.id];
    if (!p) return;
    let bx = Math.floor(data.x), by = Math.floor(data.y);
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { let cx = bx + dx, cy = by + dy; if (canWalk(cx, cy)) { bx = cx; by = cy; dy = 99; break; } }
    if (canWalk(bx, by)) { p.x = bx + .5; p.y = by + .5; if (p.vehicleId) { let v = vehicles.find(ve => ve.id === p.vehicleId); if (v) { v.x = p.x; v.y = p.y; } } }
  });
  socket.on('setName', name => { let p = players[socket.id]; if (p) p.name = (name || 'Gracz').substring(0, 15); });
  socket.on('konami', () => { let p = players[socket.id]; if (p) { p.godMode = !p.godMode; if (p.godMode) p.hp = p.mhp; io.to(socket.id).emit('notify', p.godMode ? '🔥 GOD MODE!' : 'God Mode OFF'); } });

  socket.on('disconnect', () => {
    console.log('- Gracz:', socket.id);
    let p = players[socket.id];
    if (p && p.vehicleId) { let v = vehicles.find(ve => ve.id === p.vehicleId); if (v) v.driver = null; }
    delete players[socket.id];
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`\n🎮 MTI Płock Co-op: http://localhost:${PORT}\n`));
