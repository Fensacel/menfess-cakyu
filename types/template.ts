export type TextAlignment = 'left' | 'center' | 'right';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';

export interface TextStyle {
  fontFamily: string;
  fontSize: number; // base size in px for 1080x1080
  color: string;
  alignment: TextAlignment;
  lineHeight: number;
  fontWeight?: string;
  letterSpacing?: number;
}

export interface TextPosition {
  x: number; // as fraction of canvas width (0-1)
  y: number; // as fraction of canvas height (0-1)
  width: number; // as fraction of canvas width
  height: number; // as fraction of canvas height
}

export interface DecorationElement {
  type: 'rect' | 'text' | 'line' | 'torn-paper' | 'badge';
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  textColor?: string;
  opacity?: number;
  strokeWidth?: number;
  strokeColor?: string;
  letterSpacing?: number;
  alignment?: 'left' | 'center' | 'right';
  borderRadius?: number;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string; // color or gradient for thumbnail
  backgroundColor: string;
  backgroundType: 'solid' | 'gradient' | 'texture';
  gradientColors?: string[];
  width: number;
  height: number;
  titleText: string;
  titleStyle: TextStyle;
  titlePosition: TextPosition;
  textAreaPosition: TextPosition;
  textAreaBackground?: string;
  textAreaBorderRadius?: number;
  textStyle: TextStyle;
  senderStyle?: TextStyle;
  senderPosition?: TextPosition;
  decorations: DecorationElement[];
  accentColor: string;
}

export interface CustomColors {
  frameColor?: string; // Border luar
  cardColor?: string;  // Kotak tengah (box pesan)
  textColor?: string;  // Teks di dalam kotak
  bgInnerColor?: string; // Background tengah di dalam frame
  titleColor?: string; // Warna judul MENFESS!!
}

export interface MenfessConfig {
  templateId: string;
  message: string;
  senderName: string;
  isAnonymous: boolean;
  textAlignment: TextAlignment;
  fontSize: FontSize;
  recipientName?: string;
  hashtag?: string;
  song?: string;
  customColors?: CustomColors;
}

export const fontSizeMap: Record<FontSize, number> = {
  sm: 0.75,
  md: 1.0,
  lg: 1.25,
  xl: 1.5,
};
