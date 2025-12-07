import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  arrayBufferToBase64(buffer: number[]) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    for (var i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  imageUrlFromRgba8(
    rgba8: number[],
    width: number,
    height: number,
  ): Promise<string> {
    let canvasRef = new OffscreenCanvas(width, height);
    const ctx = canvasRef.getContext('2d');
    if (ctx === null) {
      return Promise.reject('Failed to get canvas context.');
    }
    ctx.putImageData(
      new ImageData(Uint8ClampedArray.from(rgba8), width, height),
      0,
      0,
    );
    return canvasRef.convertToBlob().then((blob) => {
      return URL.createObjectURL(blob);
    });
  }
}
