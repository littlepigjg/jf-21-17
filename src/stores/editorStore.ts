import { create } from 'zustand';
import type { Frame, Caption, CropConfig, ExportConfig, CanvasAdapterConfig, FitMode, PresetTemplate } from '@/types';
import { generateId, cloneImageData, createBlankImageData } from '@/utils/imageUtils';
import { getPresetById, suggestPreset } from '@/utils/canvasAdapter';

interface EditorStore {
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
  showImportDialog: boolean;
  showExportDialog: boolean;

  setFrames: (frames: Frame[]) => void;
  setSelectedFrameIndex: (index: number) => void;
  setCurrentFrameIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setShowImportDialog: (show: boolean) => void;
  setShowExportDialog: (show: boolean) => void;

  addFrame: (imageData?: ImageData, afterIndex?: number) => void;
  deleteFrame: (index: number) => void;
  duplicateFrame: (index: number) => void;
  moveFrame: (fromIndex: number, toIndex: number) => void;
  setFrameDelay: (index: number, delay: number) => void;
  setAllFrameDelays: (delay: number) => void;

  addCaption: (caption?: Partial<Caption>) => void;
  updateCaption: (id: string, updates: Partial<Caption>) => void;
  deleteCaption: (id: string) => void;

  setCrop: (crop: Partial<CropConfig>) => void;
  setExportConfig: (config: Partial<ExportConfig>) => void;

  setCanvasSize: (width: number, height: number) => void;
  setCanvasAdapter: (config: Partial<CanvasAdapterConfig>) => void;
  setFitMode: (mode: FitMode) => void;
  applyPreset: (presetId: string) => void;
  applyPresetTemplate: (template: PresetTemplate) => void;
  autoSuggestPreset: () => void;

  clearAll: () => void;
}

const defaultCrop: CropConfig = {
  enabled: false,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

const defaultExportConfig: ExportConfig = {
  colors: 256,
  quality: 80,
  fps: 15,
  dither: true,
  repeat: 0,
  width: 0,
  height: 0,
};

const defaultCanvasAdapter: CanvasAdapterConfig = {
  fitMode: 'contain',
  backgroundColor: '#000000',
  showSafeArea: false,
  currentPresetId: null,
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  frames: [],
  selectedFrameIndex: -1,
  captions: [],
  crop: defaultCrop,
  exportConfig: defaultExportConfig,
  isPlaying: false,
  playbackSpeed: 1,
  currentFrameIndex: 0,
  canvasWidth: 640,
  canvasHeight: 480,
  canvasAdapter: defaultCanvasAdapter,
  showImportDialog: false,
  showExportDialog: false,

  setFrames: (frames) => {
    if (frames.length > 0) {
      const firstFrame = frames[0];
      const exportCfg = get().exportConfig;
      const suggestedPreset = suggestPreset(firstFrame.width, firstFrame.height);
      set({
        frames,
        selectedFrameIndex: 0,
        currentFrameIndex: 0,
        canvasWidth: firstFrame.width,
        canvasHeight: firstFrame.height,
        crop: {
          ...get().crop,
          width: firstFrame.width,
          height: firstFrame.height,
        },
        exportConfig: {
          ...exportCfg,
          width: exportCfg.width || firstFrame.width,
          height: exportCfg.height || firstFrame.height,
        },
        canvasAdapter: {
          ...get().canvasAdapter,
          currentPresetId: suggestedPreset.id,
        },
      });
    } else {
      set({ frames, selectedFrameIndex: -1, currentFrameIndex: 0 });
    }
  },

  setSelectedFrameIndex: (index) => set({ selectedFrameIndex: index }),
  setCurrentFrameIndex: (index) => set({ currentFrameIndex: index }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setShowImportDialog: (show) => set({ showImportDialog: show }),
  setShowExportDialog: (show) => set({ showExportDialog: show }),

  addFrame: (imageData, afterIndex) => {
    const state = get();
    const width = state.canvasWidth;
    const height = state.canvasHeight;
    const newFrame: Frame = {
      id: generateId(),
      imageData: imageData || createBlankImageData(width, height),
      delay: 100,
      width,
      height,
      disposalMethod: 2,
    };

    const newFrames = [...state.frames];
    if (afterIndex !== undefined && afterIndex >= 0 && afterIndex < newFrames.length) {
      newFrames.splice(afterIndex + 1, 0, newFrame);
      set({ frames: newFrames, selectedFrameIndex: afterIndex + 1 });
    } else {
      newFrames.push(newFrame);
      set({ frames: newFrames, selectedFrameIndex: newFrames.length - 1 });
    }
  },

  deleteFrame: (index) => {
    const state = get();
    if (state.frames.length <= 1) {
      set({ frames: [], selectedFrameIndex: -1, currentFrameIndex: 0 });
      return;
    }
    const newFrames = state.frames.filter((_, i) => i !== index);
    const newSelected = index >= newFrames.length ? newFrames.length - 1 : index;
    set({
      frames: newFrames,
      selectedFrameIndex: newSelected,
      currentFrameIndex: Math.min(state.currentFrameIndex, newFrames.length - 1),
    });
  },

  duplicateFrame: (index) => {
    const state = get();
    const frame = state.frames[index];
    if (!frame) return;

    const newFrame: Frame = {
      ...frame,
      id: generateId(),
      imageData: cloneImageData(frame.imageData),
    };

    const newFrames = [...state.frames];
    newFrames.splice(index + 1, 0, newFrame);
    set({ frames: newFrames, selectedFrameIndex: index + 1 });
  },

  moveFrame: (fromIndex, toIndex) => {
    const state = get();
    if (fromIndex === toIndex) return;
    const newFrames = [...state.frames];
    const [removed] = newFrames.splice(fromIndex, 1);
    newFrames.splice(toIndex, 0, removed);
    set({ frames: newFrames, selectedFrameIndex: toIndex });
  },

  setFrameDelay: (index, delay) => {
    const state = get();
    const newFrames = [...state.frames];
    if (newFrames[index]) {
      newFrames[index] = { ...newFrames[index], delay: Math.max(10, delay) };
      set({ frames: newFrames });
    }
  },

  setAllFrameDelays: (delay) => {
    const state = get();
    const newFrames = state.frames.map((f) => ({ ...f, delay: Math.max(10, delay) }));
    set({ frames: newFrames });
  },

  addCaption: (caption) => {
    const state = get();
    const maxFrames = Math.max(0, state.frames.length - 1);
    const newCaption: Caption = {
      id: generateId(),
      text: caption?.text || '新字幕',
      frameRange: caption?.frameRange || [0, maxFrames],
      x: caption?.x ?? state.canvasWidth / 2,
      y: caption?.y ?? state.canvasHeight - 60,
      fontSize: caption?.fontSize || 32,
      fontFamily: caption?.fontFamily || 'Arial, sans-serif',
      color: caption?.color || '#FFFFFF',
      strokeColor: caption?.strokeColor || '#000000',
      strokeWidth: caption?.strokeWidth ?? 2,
      align: caption?.align || 'center',
    };
    set({ captions: [...state.captions, newCaption] });
  },

  updateCaption: (id, updates) => {
    const state = get();
    const newCaptions = state.captions.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    set({ captions: newCaptions });
  },

  deleteCaption: (id) => {
    const state = get();
    set({ captions: state.captions.filter((c) => c.id !== id) });
  },

  setCrop: (crop) => set({ crop: { ...get().crop, ...crop } }),
  setExportConfig: (config) => set({ exportConfig: { ...get().exportConfig, ...config } }),

  setCanvasSize: (width, height) => {
    set({
      canvasWidth: width,
      canvasHeight: height,
      crop: {
        ...get().crop,
        x: 0,
        y: 0,
        width,
        height,
      },
      canvasAdapter: {
        ...get().canvasAdapter,
        currentPresetId: 'custom',
      },
    });
  },

  setCanvasAdapter: (config) =>
    set({ canvasAdapter: { ...get().canvasAdapter, ...config } }),

  setFitMode: (mode) =>
    set({ canvasAdapter: { ...get().canvasAdapter, fitMode: mode } }),

  applyPreset: (presetId) => {
    const preset = getPresetById(presetId);
    if (!preset) return;
    const state = get();
    set({
      canvasWidth: preset.width,
      canvasHeight: preset.height,
      crop: {
        ...state.crop,
        x: 0,
        y: 0,
        width: preset.width,
        height: preset.height,
      },
      exportConfig: {
        ...state.exportConfig,
        width: preset.width,
        height: preset.height,
      },
      canvasAdapter: {
        ...state.canvasAdapter,
        currentPresetId: presetId,
        showSafeArea: !!preset.safeArea,
      },
    });
  },

  applyPresetTemplate: (template) => {
    const state = get();
    set({
      canvasWidth: template.width,
      canvasHeight: template.height,
      crop: {
        ...state.crop,
        x: 0,
        y: 0,
        width: template.width,
        height: template.height,
      },
      exportConfig: {
        ...state.exportConfig,
        width: template.width,
        height: template.height,
      },
      canvasAdapter: {
        ...state.canvasAdapter,
        currentPresetId: template.id,
        showSafeArea: !!template.safeArea,
      },
    });
  },

  autoSuggestPreset: () => {
    const state = get();
    if (state.frames.length === 0) return;
    const firstFrame = state.frames[0];
    const suggestedPreset = suggestPreset(firstFrame.width, firstFrame.height);
    get().applyPreset(suggestedPreset.id);
  },

  clearAll: () =>
    set({
      frames: [],
      selectedFrameIndex: -1,
      captions: [],
      crop: defaultCrop,
      isPlaying: false,
      currentFrameIndex: 0,
      canvasWidth: 640,
      canvasHeight: 480,
      canvasAdapter: defaultCanvasAdapter,
      exportConfig: defaultExportConfig,
      showImportDialog: false,
      showExportDialog: false,
    }),
}));
