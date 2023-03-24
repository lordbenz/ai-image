import { createRef } from 'react';

export interface IFabricCanvas extends fabric.Canvas {
  upperCanvasEl: HTMLCanvasElement;
  lowerCanvasEl: HTMLCanvasElement;
  cacheCanvasEl: HTMLCanvasElement;
}

export const cardCanvasRef = createRef<IFabricCanvas>();

export const useCardCanvas = () => cardCanvasRef;
