/// <reference lib="webworker" />

import { AssetImageData } from '../interfaces/asset';

addEventListener('message', ({ data }) => {
  let assetImageData = data as AssetImageData | null;
  if (assetImageData === null) {
    postMessage(null);
    return;
  }
  let canvasRef = new OffscreenCanvas(
    assetImageData.width,
    assetImageData.height,
  );
  const ctx = canvasRef.getContext('2d');
  if (ctx === null) {
    console.error('Failed to get canvas context.');
    postMessage(null);
    return;
  }
  ctx.putImageData(
    new ImageData(
      Uint8ClampedArray.from(assetImageData.rgba8),
      assetImageData.width,
      assetImageData.height,
    ),
    0,
    0,
  );
  canvasRef
    .convertToBlob()
    .then((blob) => {
      postMessage(URL.createObjectURL(blob));
    })
    .catch((error) => {
      console.error(
        'Failed to create blob from canvas. Got the following error:',
        error as string,
      );
      postMessage(null);
    });
});
