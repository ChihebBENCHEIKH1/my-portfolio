export type Building = { x: number; w: number; h: number; c: 1 | 2 | 3 };
export function getCityProfile(width: number) {
  const compact = width < 600, medium = width < 1050;
  return {
    defaultCount: compact ? 10 : medium ? 13 : 16,
    widthScale: compact ? 1.4 : medium ? 1.15 : 1,
    maxBuildingRatio: compact ? .5 : medium ? .42 : Infinity,
    towerWidthScale: compact ? .68 : medium ? .84 : 1,
    compact,
  };
}
const BASE: Building[] = [
  {x:-1,w:5,h:32,c:1},{x:5,w:3,h:52,c:2},{x:10,w:4.5,h:16,c:3},{x:18,w:3,h:60,c:1},
  {x:23,w:5,h:40,c:2},{x:30,w:4,h:64,c:3},{x:36,w:6,h:34,c:1},{x:44,w:3,h:56,c:2},
  {x:49,w:5,h:42,c:3},{x:56,w:4,h:68,c:1},{x:62,w:6,h:38,c:2},{x:70,w:3,h:54,c:3},
  {x:75,w:5,h:46,c:1},{x:82,w:4,h:62,c:2},{x:88,w:6,h:36,c:3},{x:95,w:5,h:50,c:1},
];
export function getCityBuildings(count: number, widthScale = 1): Building[] {
  const total = Math.max(6, Math.min(26, Math.round(count)));
  const buildings = total <= BASE.length
    ? Array.from({ length: total }, (_, i) => BASE[Math.round(i * (BASE.length-1) / (total-1))])
    : [...BASE, ...Array.from({ length: total-BASE.length }, (_, i) => ({ x: 8 + i * 9, w: 2.5, h: 22 + (i*13)%35, c: (i%3+1) as 1|2|3 }))];
  return buildings.map(building => {
    const width = Math.min(building.w * widthScale, 100 / total * .95);
    return { ...building, x: building.x + (building.w - width) / 2, w: width };
  });
}
