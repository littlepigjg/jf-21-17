export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function imageDataToDataURL(imageData: ImageData): string {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

export function dataURLToImageData(dataUrl: string, width: number, height: number): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context not available'));
      ctx.drawImage(img, 0, 0, width, height);
      resolve(ctx.getImageData(0, 0, width, height));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export function cloneImageData(imageData: ImageData): ImageData {
  return new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
}

export function resizeImageData(imageData: ImageData, newWidth: number, newHeight: number): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return imageData;
  ctx.putImageData(imageData, 0, 0);

  const resizedCanvas = document.createElement('canvas');
  resizedCanvas.width = newWidth;
  resizedCanvas.height = newHeight;
  const resizedCtx = resizedCanvas.getContext('2d');
  if (!resizedCtx) return imageData;
  resizedCtx.imageSmoothingEnabled = true;
  resizedCtx.imageSmoothingQuality = 'high';
  resizedCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
  return resizedCtx.getImageData(0, 0, newWidth, newHeight);
}

export function cropImageData(
  imageData: ImageData,
  x: number,
  y: number,
  width: number,
  height: number
): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return imageData;
  ctx.putImageData(imageData, 0, 0);

  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = width;
  croppedCanvas.height = height;
  const croppedCtx = croppedCanvas.getContext('2d');
  if (!croppedCtx) return imageData;
  croppedCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
  return croppedCtx.getImageData(0, 0, width, height);
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function imageElementToImageData(img: HTMLImageElement): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function createBlankImageData(width: number, height: number): ImageData {
  return new ImageData(width, height);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export interface AdaptImageOptions {
  targetWidth: number;
  targetHeight: number;
  fitMode: 'cover' | 'contain' | 'fill';
  backgroundColor?: string;
}

export function adaptImageData(
  imageData: ImageData,
  options: AdaptImageOptions
): ImageData {
  const { targetWidth, targetHeight, fitMode, backgroundColor = '#000000' } = options;

  if (imageData.width === targetWidth && imageData.height === targetHeight) {
    return imageData;
  }

  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = imageData.width;
  sourceCanvas.height = imageData.height;
  const sourceCtx = sourceCanvas.getContext('2d');
  if (!sourceCtx) return imageData;
  sourceCtx.putImageData(imageData, 0, 0);

  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = targetWidth;
  targetCanvas.height = targetHeight;
  const targetCtx = targetCanvas.getContext('2d');
  if (!targetCtx) return imageData;

  const rgb = hexToRgb(backgroundColor);
  targetCtx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  targetCtx.fillRect(0, 0, targetWidth, targetHeight);

  targetCtx.imageSmoothingEnabled = true;
  targetCtx.imageSmoothingQuality = 'high';

  const sourceRatio = imageData.width / imageData.height;
  const targetRatio = targetWidth / targetHeight;

  if (fitMode === 'fill') {
    targetCtx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);
  } else if (fitMode === 'cover') {
    let sx = 0;
    let sy = 0;
    let sw = imageData.width;
    let sh = imageData.height;

    if (sourceRatio > targetRatio) {
      sw = imageData.height * targetRatio;
      sx = (imageData.width - sw) / 2;
    } else {
      sh = imageData.width / targetRatio;
      sy = (imageData.height - sh) / 2;
    }

    targetCtx.drawImage(
      sourceCanvas,
      sx, sy, sw, sh,
      0, 0, targetWidth, targetHeight
    );
  } else {
    let dw: number;
    let dh: number;

    if (sourceRatio > targetRatio) {
      dw = targetWidth;
      dh = targetWidth / sourceRatio;
    } else {
      dh = targetHeight;
      dw = targetHeight * sourceRatio;
    }

    const dx = (targetWidth - dw) / 2;
    const dy = (targetHeight - dh) / 2;

    targetCtx.drawImage(sourceCanvas, dx, dy, dw, dh);
  }

  return targetCtx.getImageData(0, 0, targetWidth, targetHeight);
}
