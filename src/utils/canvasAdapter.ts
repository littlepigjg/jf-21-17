import type { PresetTemplate, FitMode, PlatformCategory } from '@/types';

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'instagram-story',
    name: '故事',
    platform: 'Instagram',
    category: 'social',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: '竖屏全屏故事格式',
    safeArea: { top: 250, bottom: 250, left: 40, right: 40 },
  },
  {
    id: 'instagram-post',
    name: '正方形帖子',
    platform: 'Instagram',
    category: 'social',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    description: '经典正方形帖子',
  },
  {
    id: 'instagram-post-4-5',
    name: '竖版帖子',
    platform: 'Instagram',
    category: 'social',
    width: 1080,
    height: 1350,
    aspectRatio: '4:5',
    description: '优化的竖版帖子',
  },
  {
    id: 'instagram-reel',
    name: 'Reel 短视频',
    platform: 'Instagram',
    category: 'social',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'Reel 短视频格式',
    safeArea: { top: 250, bottom: 400, left: 40, right: 40 },
  },
  {
    id: 'twitter-cover',
    name: '封面图',
    platform: 'Twitter/X',
    category: 'social',
    width: 1500,
    height: 500,
    aspectRatio: '3:1',
    description: '个人主页横幅',
    safeArea: { top: 0, bottom: 0, left: 300, right: 300 },
  },
  {
    id: 'twitter-post',
    name: '推文图片',
    platform: 'Twitter/X',
    category: 'social',
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    description: '推文附带图片',
  },
  {
    id: 'discord-emoji',
    name: '表情符号',
    platform: 'Discord',
    category: 'messaging',
    width: 128,
    height: 128,
    aspectRatio: '1:1',
    description: '服务器自定义表情',
  },
  {
    id: 'discord-sticker',
    name: '贴纸',
    platform: 'Discord',
    category: 'messaging',
    width: 320,
    height: 320,
    aspectRatio: '1:1',
    description: '消息贴纸',
  },
  {
    id: 'discord-banner',
    name: '服务器横幅',
    platform: 'Discord',
    category: 'messaging',
    width: 960,
    height: 540,
    aspectRatio: '16:9',
    description: '服务器顶部横幅',
  },
  {
    id: 'discord-avatar',
    name: '头像',
    platform: 'Discord',
    category: 'messaging',
    width: 512,
    height: 512,
    aspectRatio: '1:1',
    description: '用户头像',
  },
  {
    id: 'youtube-thumbnail',
    name: '视频缩略图',
    platform: 'YouTube',
    category: 'video',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    description: '视频封面缩略图',
  },
  {
    id: 'youtube-banner',
    name: '频道横幅',
    platform: 'YouTube',
    category: 'video',
    width: 2560,
    height: 1440,
    aspectRatio: '16:9',
    description: '频道主页横幅',
    safeArea: { top: 240, bottom: 240, left: 560, right: 560 },
  },
  {
    id: 'youtube-shorts',
    name: 'Shorts 短视频',
    platform: 'YouTube',
    category: 'video',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'Shorts 竖屏视频',
  },
  {
    id: 'tiktok',
    name: 'TikTok 视频',
    platform: 'TikTok',
    category: 'video',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'TikTok 标准格式',
    safeArea: { top: 200, bottom: 400, left: 40, right: 40 },
  },
  {
    id: 'facebook-cover',
    name: '封面图',
    platform: 'Facebook',
    category: 'social',
    width: 820,
    height: 312,
    aspectRatio: '2.63:1',
    description: '个人主页封面',
  },
  {
    id: 'facebook-post',
    name: '帖子图片',
    platform: 'Facebook',
    category: 'social',
    width: 1200,
    height: 630,
    aspectRatio: '1.91:1',
    description: '动态帖子图片',
  },
  {
    id: 'wechat-article',
    name: '公众号封面',
    platform: '微信',
    category: 'messaging',
    width: 900,
    height: 383,
    aspectRatio: '2.35:1',
    description: '公众号文章封面',
  },
  {
    id: 'wechat-moments',
    name: '朋友圈图片',
    platform: '微信',
    category: 'messaging',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    description: '朋友圈分享图片',
  },
  {
    id: 'weibo-post',
    name: '微博配图',
    platform: '微博',
    category: 'social',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    description: '微博发布配图',
  },
  {
    id: 'custom',
    name: '自定义',
    platform: 'Custom',
    category: 'custom',
    width: 640,
    height: 480,
    aspectRatio: '4:3',
    description: '自定义尺寸',
  },
];

export function getPresetById(id: string): PresetTemplate | undefined {
  return PRESET_TEMPLATES.find((t) => t.id === id);
}

export function getPresetsByCategory(category: PlatformCategory): PresetTemplate[] {
  return PRESET_TEMPLATES.filter((t) => t.category === category);
}

export function getPresetsByPlatform(platform: string): PresetTemplate[] {
  return PRESET_TEMPLATES.filter(
    (t) => t.platform.toLowerCase() === platform.toLowerCase()
  );
}

export function suggestPreset(width: number, height: number): PresetTemplate {
  const targetRatio = width / height;

  let bestMatch = PRESET_TEMPLATES[0];
  let bestDiff = Infinity;

  for (const template of PRESET_TEMPLATES) {
    if (template.id === 'custom') continue;
    const templateRatio = template.width / template.height;
    const diff = Math.abs(targetRatio - templateRatio);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestMatch = template;
    }
  }

  return bestMatch;
}

export interface FitResult {
  drawX: number;
  drawY: number;
  drawWidth: number;
  drawHeight: number;
  sourceX: number;
  sourceY: number;
  sourceWidth: number;
  sourceHeight: number;
}

export function calculateFit(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  mode: FitMode
): FitResult {
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;

  if (mode === 'fill') {
    return {
      drawX: 0,
      drawY: 0,
      drawWidth: targetWidth,
      drawHeight: targetHeight,
      sourceX: 0,
      sourceY: 0,
      sourceWidth,
      sourceHeight,
    };
  }

  if (mode === 'cover') {
    let drawWidth: number;
    let drawHeight: number;
    let sourceX = 0;
    let sourceY = 0;
    let sourceW = sourceWidth;
    let sourceH = sourceHeight;

    if (sourceRatio > targetRatio) {
      sourceW = sourceHeight * targetRatio;
      sourceX = (sourceWidth - sourceW) / 2;
      drawWidth = targetWidth;
      drawHeight = targetHeight;
    } else {
      sourceH = sourceWidth / targetRatio;
      sourceY = (sourceHeight - sourceH) / 2;
      drawWidth = targetWidth;
      drawHeight = targetHeight;
    }

    return {
      drawX: 0,
      drawY: 0,
      drawWidth,
      drawHeight,
      sourceX,
      sourceY,
      sourceWidth: sourceW,
      sourceHeight: sourceH,
    };
  }

  let drawWidth: number;
  let drawHeight: number;

  if (sourceRatio > targetRatio) {
    drawWidth = targetWidth;
    drawHeight = targetWidth / sourceRatio;
  } else {
    drawHeight = targetHeight;
    drawWidth = targetHeight * sourceRatio;
  }

  return {
    drawX: (targetWidth - drawWidth) / 2,
    drawY: (targetHeight - drawHeight) / 2,
    drawWidth,
    drawHeight,
    sourceX: 0,
    sourceY: 0,
    sourceWidth,
    sourceHeight,
  };
}

export function parseAspectRatio(ratioString: string): number {
  const [w, h] = ratioString.split(':').map(Number);
  if (!w || !h) return 1;
  return w / h;
}

export function formatAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(Math.round(width), Math.round(height));
  return `${Math.round(width / g)}:${Math.round(height / g)}`;
}

export function getPlatformCategoryLabel(category: PlatformCategory): string {
  const labels: Record<PlatformCategory, string> = {
    social: '社交媒体',
    messaging: '即时通讯',
    video: '视频平台',
    custom: '自定义',
  };
  return labels[category];
}

export function getFitModeLabel(mode: FitMode): string {
  const labels: Record<FitMode, string> = {
    cover: '智能裁剪',
    contain: '完整填充',
    fill: '拉伸适应',
  };
  return labels[mode];
}

export function getFitModeDescription(mode: FitMode): string {
  const descriptions: Record<FitMode, string> = {
    cover: '居中裁剪填满画布，保持比例',
    contain: '完整显示内容，空白处填充背景色',
    fill: '拉伸内容填满画布，可能变形',
  };
  return descriptions[mode];
}
