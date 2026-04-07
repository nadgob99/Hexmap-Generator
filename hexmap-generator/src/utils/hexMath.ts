export const hexDistance = (hexA: { q: number; r: number }, hexB: { q: number; r: number }): number => {
    return (Math.abs(hexA.q - hexB.q) + Math.abs(hexA.q + hexA.r - hexB.q - hexB.r) + Math.abs(hexA.r - hexB.r)) / 2;
};

export const hexToPixel = (hex: { q: number; r: number }, size: number): { x: number; y: number } => {
    const x = size * (Math.sqrt(3) * hex.q + Math.sqrt(3) / 2 * hex.r);
    const y = size * (3 / 2 * hex.r);
    return { x, y };
};

export const pixelToHex = (point: { x: number; y: number }, size: number): { q: number; r: number } => {
    const q = (Math.sqrt(3) / 3 * point.x - 1 / 3 * point.y) / size;
    const r = (2 / 3 * point.y) / size;
    return { q: Math.round(q), r: Math.round(r) };
};

export const roundHex = (hex: { q: number; r: number }): { q: number; r: number } => {
    const q = Math.round(hex.q);
    const r = Math.round(hex.r);
    const s = -q - r;
    const qDiff = Math.abs(q - hex.q);
    const rDiff = Math.abs(r - hex.r);
    const sDiff = Math.abs(s - (-hex.q - hex.r));

    if (qDiff > rDiff && qDiff > sDiff) {
        return { q: -r - s, r: r };
    } else if (rDiff > sDiff) {
        return { q: q, r: -q - s };
    } else {
        return { q: q, r: -q - r };
    }
};