import { useState } from 'react';
import {
  Type,
  Crop,
  Palette,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Clock,
  Layout,
  Target,
  Maximize2,
  Sparkles,
  ShieldAlert,
  Image as ImageIcon,
} from 'lucide-react';
import { useEditorStore } from '@/stores/editorStore';
import type { Caption, FitMode, PlatformCategory } from '@/types';
import { cn } from '@/lib/utils';
import {
  PRESET_TEMPLATES,
  getPresetsByCategory,
  getPlatformCategoryLabel,
  getFitModeLabel,
  getFitModeDescription,
  formatAspectRatio,
} from '@/utils/canvasAdapter';

interface PanelSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function PanelSection({ title, icon, children, defaultOpen = true }: PanelSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-slate-200">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

function CaptionEditor({ caption }: { caption: Caption }) {
  const { updateCaption, deleteCaption, frames } = useEditorStore();
  const maxFrame = Math.max(0, frames.length - 1);

  return (
    <div className="bg-slate-800/50 rounded-lg p-3 space-y-2 border border-slate-700">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">字幕内容</span>
        <button
          onClick={() => deleteCaption(caption.id)}
          className="p-1 hover:bg-slate-700 text-slate-400 hover:text-orange-400 rounded transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <input
        type="text"
        value={caption.text}
        onChange={(e) => updateCaption(caption.id, { text: e.target.value })}
        className="w-full px-2 py-1.5 bg-slate-900 border border-slate-600 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
        placeholder="输入字幕内容"
      />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-1">字体大小</label>
          <input
            type="number"
            value={caption.fontSize}
            onChange={(e) => updateCaption(caption.id, { fontSize: Number(e.target.value) })}
            className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-violet-500"
            min={8}
            max={200}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">对齐</label>
          <select
            value={caption.align}
            onChange={(e) =>
              updateCaption(caption.id, { align: e.target.value as 'left' | 'center' | 'right' })
            }
            className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-violet-500"
          >
            <option value="left">左对齐</option>
            <option value="center">居中</option>
            <option value="right">右对齐</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-1">X 位置</label>
          <input
            type="number"
            value={caption.x}
            onChange={(e) => updateCaption(caption.id, { x: Number(e.target.value) })}
            className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Y 位置</label>
          <input
            type="number"
            value={caption.y}
            onChange={(e) => updateCaption(caption.id, { y: Number(e.target.value) })}
            className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-1">文字颜色</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={caption.color}
              onChange={(e) => updateCaption(caption.id, { color: e.target.value })}
              className="w-8 h-8 rounded border border-slate-600 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={caption.color}
              onChange={(e) => updateCaption(caption.id, { color: e.target.value })}
              className="flex-1 px-2 py-1 bg-slate-900 border border-slate-600 rounded text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">描边颜色</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={caption.strokeColor}
              onChange={(e) => updateCaption(caption.id, { strokeColor: e.target.value })}
              className="w-8 h-8 rounded border border-slate-600 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={caption.strokeColor}
              onChange={(e) => updateCaption(caption.id, { strokeColor: e.target.value })}
              className="flex-1 px-2 py-1 bg-slate-900 border border-slate-600 rounded text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 block mb-1">
          帧范围: {caption.frameRange[0] + 1} - {caption.frameRange[1] + 1}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={maxFrame}
            value={caption.frameRange[0]}
            onChange={(e) =>
              updateCaption(caption.id, {
                frameRange: [Number(e.target.value), Math.max(Number(e.target.value), caption.frameRange[1])],
              })
            }
            className="flex-1 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer accent-violet-500"
          />
          <input
            type="range"
            min={0}
            max={maxFrame}
            value={caption.frameRange[1]}
            onChange={(e) =>
              updateCaption(caption.id, {
                frameRange: [Math.min(caption.frameRange[0], Number(e.target.value)), Number(e.target.value)],
              })
            }
            className="flex-1 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>
    </div>
  );
}

const FIT_MODES: { value: FitMode; label: string; icon: React.ReactNode }[] = [
  { value: 'cover', label: '智能裁剪', icon: <Crop className="w-4 h-4" /> },
  { value: 'contain', label: '完整填充', icon: <Maximize2 className="w-4 h-4" /> },
  { value: 'fill', label: '拉伸适应', icon: <Layout className="w-4 h-4" /> },
];

const CATEGORIES: PlatformCategory[] = ['social', 'messaging', 'video'];

export default function PropertyPanel() {
  const {
    captions,
    addCaption,
    crop,
    setCrop,
    exportConfig,
    setExportConfig,
    frames,
    canvasWidth,
    canvasHeight,
    setCanvasSize,
    canvasAdapter,
    setCanvasAdapter,
    setFitMode,
    applyPreset,
    autoSuggestPreset,
    setAllFrameDelays,
  } = useEditorStore();

  const [globalDelay, setGlobalDelay] = useState(100);
  const [selectedCategory, setSelectedCategory] = useState<PlatformCategory>('social');

  return (
    <div className="w-80 bg-slate-900/50 border-l border-slate-700 flex flex-col flex-shrink-0 overflow-y-auto">
      <div className="p-3 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-slate-200">属性设置</h3>
      </div>

      <PanelSection
        title="画布尺寸"
        icon={<Layout className="w-4 h-4 text-cyan-400" />}
        defaultOpen={true}
      >
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-400 block mb-1">宽度</label>
            <input
              type="number"
              value={canvasWidth}
              onChange={(e) => {
                const w = Number(e.target.value);
                if (w > 0) setCanvasSize(w, canvasHeight);
              }}
              className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-cyan-500"
              min={1}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">高度</label>
            <input
              type="number"
              value={canvasHeight}
              onChange={(e) => {
                const h = Number(e.target.value);
                if (h > 0) setCanvasSize(canvasWidth, h);
              }}
              className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-cyan-500"
              min={1}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">宽高比</span>
          <span className="text-xs text-slate-300 font-mono">
            {formatAspectRatio(canvasWidth, canvasHeight)}
          </span>
        </div>
        <button
          onClick={autoSuggestPreset}
          disabled={frames.length === 0}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 disabled:opacity-50 disabled:cursor-not-allowed text-cyan-300 text-xs rounded-lg transition-colors border border-cyan-500/30"
        >
          <Sparkles className="w-3.5 h-3.5" />
          智能推荐预设
        </button>
      </PanelSection>

      <PanelSection
        title="平台预设"
        icon={<Target className="w-4 h-4 text-violet-400" />}
        defaultOpen={true}
      >
        <div className="flex flex-wrap gap-1 mb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-2 py-1 rounded text-xs transition-colors',
                selectedCategory === cat
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              )}
            >
              {getPlatformCategoryLabel(cat)}
            </button>
          ))}
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {getPresetsByCategory(selectedCategory).map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all',
                canvasAdapter.currentPresetId === preset.id
                  ? 'bg-violet-600/20 border border-violet-500/50'
                  : 'bg-slate-800/50 border border-slate-700 hover:border-violet-500/30 hover:bg-slate-800'
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <ImageIcon className={cn(
                  'w-4 h-4 flex-shrink-0',
                  canvasAdapter.currentPresetId === preset.id ? 'text-violet-400' : 'text-slate-500'
                )} />
                <div className="min-w-0">
                  <div className={cn(
                    'text-xs font-medium truncate',
                    canvasAdapter.currentPresetId === preset.id ? 'text-violet-200' : 'text-slate-200'
                  )}>
                    {preset.platform} · {preset.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {preset.width} × {preset.height} ({preset.aspectRatio})
                  </div>
                </div>
              </div>
              {preset.safeArea && (
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </PanelSection>

      <PanelSection
        title="适配模式"
        icon={<Layout className="w-4 h-4 text-orange-400" />}
        defaultOpen={true}
      >
        <div className="grid grid-cols-3 gap-1.5">
          {FIT_MODES.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setFitMode(mode.value)}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all text-center',
                canvasAdapter.fitMode === mode.value
                  ? 'bg-orange-600/20 border border-orange-500/50 text-orange-300'
                  : 'bg-slate-800/50 border border-slate-700 hover:border-orange-500/30 text-slate-400 hover:text-slate-200'
              )}
            >
              {mode.icon}
              <span className="text-[10px] font-medium">{mode.label}</span>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 text-center">
          {getFitModeDescription(canvasAdapter.fitMode)}
        </p>

        {canvasAdapter.fitMode === 'contain' && (
          <div>
            <label className="text-xs text-slate-400 block mb-1">填充背景色</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={canvasAdapter.backgroundColor}
                onChange={(e) => setCanvasAdapter({ backgroundColor: e.target.value })}
                className="w-8 h-8 rounded border border-slate-600 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={canvasAdapter.backgroundColor}
                onChange={(e) => setCanvasAdapter({ backgroundColor: e.target.value })}
                className="flex-1 px-2 py-1 bg-slate-900 border border-slate-600 rounded text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>
          </div>
        )}

        <label className="flex items-center gap-2 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={canvasAdapter.showSafeArea}
            onChange={(e) => setCanvasAdapter({ showSafeArea: e.target.checked })}
            className="w-4 h-4 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 bg-slate-900"
          />
          <span className="text-xs text-slate-300">显示安全区域指示</span>
        </label>
      </PanelSection>

      <PanelSection
        title="全局帧时长"
        icon={<Clock className="w-4 h-4 text-cyan-400" />}
        defaultOpen={false}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-slate-400">统一设置时长</label>
            <span className="text-xs text-slate-300 font-mono">{globalDelay}ms</span>
          </div>
          <input
            type="range"
            min="10"
            max="5000"
            step="10"
            value={globalDelay}
            onChange={(e) => setGlobalDelay(Number(e.target.value))}
            className="w-full h-1 bg-slate-700 rounded-full appearance-none cursor-pointer accent-violet-500"
          />
          <button
            onClick={() => setAllFrameDelays(globalDelay)}
            disabled={frames.length === 0}
            className="w-full py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
          >
            应用到所有帧
          </button>
        </div>
      </PanelSection>

      <PanelSection
        title="字幕"
        icon={<Type className="w-4 h-4 text-violet-400" />}
        defaultOpen={false}
      >
        <button
          onClick={() => addCaption()}
          disabled={frames.length === 0}
          className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 rounded-lg text-sm font-medium transition-colors mb-2"
        >
          <Plus className="w-4 h-4" />
          添加字幕
        </button>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {captions.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">暂无字幕</p>
          ) : (
            captions.map((caption) => (
              <CaptionEditor key={caption.id} caption={caption} />
            ))
          )}
        </div>
      </PanelSection>

      <PanelSection
        title="裁切"
        icon={<Crop className="w-4 h-4 text-orange-400" />}
        defaultOpen={false}
      >
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={crop.enabled}
              onChange={(e) => setCrop({ enabled: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600 text-violet-600 focus:ring-violet-500 bg-slate-900"
            />
            <span className="text-sm text-slate-300">启用裁切</span>
          </label>

          <div className={cn('space-y-2', !crop.enabled && 'opacity-50 pointer-events-none')}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-400 block mb-1">X 起点</label>
                <input
                  type="number"
                  value={crop.x}
                  onChange={(e) => setCrop({ x: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-violet-500"
                  min={0}
                  max={canvasWidth}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Y 起点</label>
                <input
                  type="number"
                  value={crop.y}
                  onChange={(e) => setCrop({ y: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-violet-500"
                  min={0}
                  max={canvasHeight}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-400 block mb-1">宽度</label>
                <input
                  type="number"
                  value={crop.width}
                  onChange={(e) => setCrop({ width: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-violet-500"
                  min={1}
                  max={canvasWidth}
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">高度</label>
                <input
                  type="number"
                  value={crop.height}
                  onChange={(e) => setCrop({ height: Number(e.target.value) })}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-violet-500"
                  min={1}
                  max={canvasHeight}
                />
              </div>
            </div>
            <button
              onClick={() =>
                setCrop({
                  x: 0,
                  y: 0,
                  width: canvasWidth,
                  height: canvasHeight,
                })
              }
              className="w-full py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded transition-colors"
            >
              重置为画布尺寸
            </button>
          </div>
        </div>
      </PanelSection>

      <PanelSection
        title="调色板优化"
        icon={<Palette className="w-4 h-4 text-emerald-400" />}
        defaultOpen={false}
      >
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-400">颜色数量</label>
              <span className="text-xs text-slate-300 font-mono">{exportConfig.colors}</span>
            </div>
            <input
              type="range"
              min={2}
              max={256}
              step={1}
              value={exportConfig.colors}
              onChange={(e) => setExportConfig({ colors: Number(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-xs text-slate-500 mt-1">颜色越少文件越小</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-400">质量</label>
              <span className="text-xs text-slate-300 font-mono">{exportConfig.quality}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={exportConfig.quality}
              onChange={(e) => setExportConfig({ quality: Number(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={exportConfig.dither}
              onChange={(e) => setExportConfig({ dither: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 bg-slate-900"
            />
            <span className="text-sm text-slate-300">启用抖动 (提升画质)</span>
          </label>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-400">输出帧率 (FPS)</label>
              <span className="text-xs text-slate-300 font-mono">{exportConfig.fps}</span>
            </div>
            <input
              type="range"
              min={1}
              max={60}
              step={1}
              value={exportConfig.fps}
              onChange={(e) => setExportConfig({ fps: Number(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-full appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">输出宽度</label>
              <input
                type="number"
                value={exportConfig.width || canvasWidth}
                onChange={(e) => setExportConfig({ width: Number(e.target.value) })}
                className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-violet-500"
                min={1}
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">输出高度</label>
              <input
                type="number"
                value={exportConfig.height || canvasHeight}
                onChange={(e) => setExportConfig({ height: Number(e.target.value) })}
                className="w-full px-2 py-1 bg-slate-900 border border-slate-600 rounded text-sm text-white focus:outline-none focus:border-violet-500"
                min={1}
              />
            </div>
          </div>
        </div>
      </PanelSection>
    </div>
  );
}
