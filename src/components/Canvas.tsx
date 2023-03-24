import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useCardCanvas } from '@/hooks/useCardCanvas';
const CardCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardCanvasRef = useCardCanvas();

  useEffect(() => {
    if (!canvasRef.current) return;
    const width = canvasRef.current?.clientWidth;
    const height = canvasRef.current?.clientHeight;

    const canvas = new fabric.Canvas(canvasRef.current, {
      height,
      width,
      enableRetinaScaling: false,
      selection: false,
      skipOffscreen: true,
      renderOnAddRemove: false,
    });
    // @ts-ignore
    cardCanvasRef.current = canvas;

    // @ts-ignore
    fabric.perfLimitSizeTotal = 2097152 * 4;
    fabric.textureSize = 8129;

    const resize = () => {
      canvas.setDimensions({
        width,
        height,
      });

      canvas.requestRenderAll();
    };
    resize();

    window.addEventListener('resize', resize);
    canvas.on('object:modified', (e) => {
      console.debug(e);
    });
    return () => {
      canvas.dispose();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      touch-action="none"
      ref={canvasRef}
      id="fabricCanvas"
      style={{
        height: '1024px',
        width: '1024px',
        visibility: 'hidden',
      }}
    />
  );
};

export default CardCanvas;
