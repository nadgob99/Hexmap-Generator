import { DrawPath, HexMapSnapshot } from '../context/HexMapContext';

export function exportToJson(snapshot: HexMapSnapshot): void {
  const json = JSON.stringify(snapshot, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hexmap.hexmap.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function readJsonFile(file: File): Promise<HexMapSnapshot> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as HexMapSnapshot;
        if (data.version !== 1) {
          reject(new Error('Unknown file version'));
          return;
        }
        resolve(data);
      } catch {
        reject(new Error('Invalid file format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export async function exportToPng(
  svgEl: SVGSVGElement,
  drawCanvasEl: HTMLCanvasElement | null,
  drawPaths: DrawPath[],
): Promise<void> {
  const svgRect = svgEl.getBoundingClientRect();
  const width = svgRect.width;
  const height = svgRect.height;
  if (width === 0 || height === 0) return;

  const svgClone = svgEl.cloneNode(true) as SVGSVGElement;
  svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', String(svgRect.width));
  bg.setAttribute('height', String(svgRect.height));
  bg.setAttribute('fill', '#ffffff');
  svgClone.insertBefore(bg, svgClone.firstChild);

  const svgStr = new XMLSerializer().serializeToString(svgClone);
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  await new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = window.devicePixelRatio || 1;
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = Math.round(width * scale);
      exportCanvas.height = Math.round(height * scale);
      const ctx = exportCanvas.getContext('2d')!;
      ctx.scale(scale, scale);

      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(svgUrl);

      if (drawPaths.length > 0 && drawCanvasEl) {
        const canvasRect = drawCanvasEl.getBoundingClientRect();
        const offsetX = canvasRect.left - svgRect.left;
        const offsetY = canvasRect.top - svgRect.top;

        for (const path of drawPaths) {
          if (path.points.length < 2) continue;
          ctx.beginPath();
          ctx.strokeStyle = path.color;
          ctx.lineWidth = path.width;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.moveTo(path.points[0].x + offsetX, path.points[0].y + offsetY);
          for (let i = 1; i < path.points.length; i++) {
            ctx.lineTo(path.points[i].x + offsetX, path.points[i].y + offsetY);
          }
          ctx.stroke();
        }
      }

      exportCanvas.toBlob((blob) => {
        if (!blob) { resolve(); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hexmap.png';
        a.click();
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(svgUrl); resolve(); };
    img.src = svgUrl;
  });
}
