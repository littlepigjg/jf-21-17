export interface Frame {
  id: string;
  imageData: ImageData;
  delay: number;
  width: number;
  height: number;
  disposalMethod: number;
}

export interface Caption {
  id: string;
  text: string;
  frameRange: [number, number];
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  align: 'left' | 'center' | 'right';
}

export interface CropConfig {
  enabled: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type FitMode = 'cover' | 'contain' | 'fill';

export type PlatformCategory = 'social' | 'messaging' | 'video' | 'custom';

export interface PresetTemplate {
  id: string;
  name: string;
  platform: string;
  category: PlatformCategory;
  width: number;
  height: number;
  aspectRatio: string;
  description?: string;
  icon?: string;
  safeArea?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

export interface CanvasAdapterConfig {
  fitMode: FitMode;
  backgroundColor: string;
  showSafeArea: boolean;
  currentPresetId: string | null;
}

export interface ExportConfig {
  colors: number;
  quality: number;
  fps: number;
  dither: boolean;
  repeat: number;
  width: number;
  height: number;
}

export interface EditorState {
  frames: Frame[];
  selectedFrameIndex: number;
  captions: Caption[];
  crop: CropConfig;
  exportConfig: ExportConfig;
  isPlaying: boolean;
  playbackSpeed: number;
  currentFrameIndex: number;
  canvasWidth: number;
  canvasHeight: number;
  canvasAdapter: CanvasAdapterConfig;
}
