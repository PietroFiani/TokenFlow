import type {
  ColorScale,
  ColorToken,
  DimensionToken,
  NumberToken,
  BreakpointEntry,
} from '~/app/types/designTokens';

// === Helper to build a color token ===

function colorToken(
  h: number, s: number, l: number, hex: string, description: string
): ColorToken {
  return {
    $type: 'color',
    $value: { colorSpace: 'hsl', components: [h, s, l], alpha: 1, hex },
    $description: description,
  };
}

// === Shade descriptions (suffixes for brand color descriptions) ===

export const SHADE_DESCRIPTIONS: Record<number, string> = {
  100: 'Lightest shade for subtle backgrounds.',
  200: 'Very light shade for hover states.',
  300: 'Light shade for backgrounds.',
  400: 'Medium-light shade.',
  500: 'Medium shade.',
  600: 'Core brand shade.',
  700: 'Main identity shade.',
  800: 'Dark shade for hover states.',
  900: 'Darker shade.',
  1000: 'Very dark shade.',
  1100: 'Near-darkest shade.',
  1200: 'Darkest shade.',
};

// === Fixed Color Scales (from primitive.json) ===

export const NEUTRAL_COLOR_SCALE: ColorScale = {
  '100': colorToken(0, 0, 98, '#fafafa', 'Neutral at 100 weight. Near-white for subtle backgrounds.'),
  '200': colorToken(0, 0, 96, '#f5f5f5', 'Neutral at 200 weight. Very light gray for backgrounds.'),
  '300': colorToken(0, 0, 90, '#e5e5e5', 'Neutral at 300 weight. Light gray for borders and dividers.'),
  '400': colorToken(0, 0, 83, '#d4d4d4', 'Neutral at 400 weight. Medium-light gray for borders.'),
  '500': colorToken(0, 0, 64, '#a3a3a3', 'Neutral at 500 weight. Medium gray for disabled states.'),
  '600': colorToken(0, 0, 45, '#737373', 'Neutral at 600 weight. True gray for icons and secondary text.'),
  '700': colorToken(0, 0, 32, '#525252', 'Neutral at 700 weight. Dark gray for secondary text.'),
  '800': colorToken(0, 0, 25, '#404040', 'Neutral at 800 weight. Darker gray for text.'),
  '900': colorToken(0, 0, 15, '#262626', 'Neutral at 900 weight. Very dark gray for headings.'),
  '1000': colorToken(0, 0, 9, '#171717', 'Neutral at 1000 weight. Near-black for primary text.'),
  '1100': colorToken(0, 0, 4, '#0a0a0a', 'Neutral at 1100 weight. Almost black for high contrast.'),
  '1200': colorToken(0, 0, 2, '#050505', 'Neutral at 1200 weight. Near-pure black for maximum contrast.'),
};

export const SUCCESS_COLOR_SCALE: ColorScale = {
  '100': colorToken(142, 76, 97, '#f0fdf4', 'Success color at 100 weight. Lightest shade for subtle backgrounds.'),
  '200': colorToken(142, 76, 92, '#dcfce7', 'Success color at 200 weight. Very light shade.'),
  '300': colorToken(142, 76, 85, '#bbf7d0', 'Success color at 300 weight. Light shade.'),
  '400': colorToken(142, 76, 73, '#86efac', 'Success color at 400 weight. Medium-light shade.'),
  '500': colorToken(142, 76, 57, '#4ade80', 'Success color at 500 weight. Medium shade.'),
  '600': colorToken(142, 76, 45, '#22c55e', 'Success color at 600 weight. Core success shade.'),
  '700': colorToken(142, 76, 36, '#16a34a', 'Success color at 700 weight. Main success identity.'),
  '800': colorToken(142, 71, 30, '#15803d', 'Success color at 800 weight. Dark shade.'),
  '900': colorToken(142, 64, 24, '#166534', 'Success color at 900 weight. Darker shade.'),
  '1000': colorToken(142, 61, 20, '#14532d', 'Success color at 1000 weight. Very dark shade.'),
  '1100': colorToken(142, 58, 13, '#0f3a1f', 'Success color at 1100 weight. Near-darkest shade.'),
  '1200': colorToken(142, 55, 8, '#092413', 'Success color at 1200 weight. Darkest shade.'),
};

export const WARNING_COLOR_SCALE: ColorScale = {
  '100': colorToken(38, 92, 97, '#fffbeb', 'Warning color at 100 weight. Lightest shade for subtle backgrounds.'),
  '200': colorToken(38, 92, 92, '#fef3c7', 'Warning color at 200 weight. Very light shade.'),
  '300': colorToken(38, 92, 85, '#fde68a', 'Warning color at 300 weight. Light shade.'),
  '400': colorToken(38, 92, 73, '#fcd34d', 'Warning color at 400 weight. Medium-light shade.'),
  '500': colorToken(38, 92, 57, '#fbbf24', 'Warning color at 500 weight. Medium shade.'),
  '600': colorToken(38, 92, 50, '#f59e0b', 'Warning color at 600 weight. Core warning shade.'),
  '700': colorToken(32, 95, 44, '#d97706', 'Warning color at 700 weight. Main warning identity.'),
  '800': colorToken(32, 88, 36, '#b45309', 'Warning color at 800 weight. Dark shade.'),
  '900': colorToken(32, 81, 29, '#92400e', 'Warning color at 900 weight. Darker shade.'),
  '1000': colorToken(32, 75, 24, '#78350f', 'Warning color at 1000 weight. Very dark shade.'),
  '1100': colorToken(32, 70, 16, '#55220a', 'Warning color at 1100 weight. Near-darkest shade.'),
  '1200': colorToken(32, 65, 10, '#361605', 'Warning color at 1200 weight. Darkest shade.'),
};

export const ERROR_COLOR_SCALE: ColorScale = {
  '100': colorToken(0, 86, 97, '#fef2f2', 'Error color at 100 weight. Lightest shade for subtle backgrounds.'),
  '200': colorToken(0, 86, 93, '#fee2e2', 'Error color at 200 weight. Very light shade.'),
  '300': colorToken(0, 86, 87, '#fecaca', 'Error color at 300 weight. Light shade.'),
  '400': colorToken(0, 86, 76, '#fca5a5', 'Error color at 400 weight. Medium-light shade.'),
  '500': colorToken(0, 84, 65, '#f87171', 'Error color at 500 weight. Medium shade.'),
  '600': colorToken(0, 84, 60, '#ef4444', 'Error color at 600 weight. Core error shade.'),
  '700': colorToken(0, 72, 51, '#dc2626', 'Error color at 700 weight. Main error identity.'),
  '800': colorToken(0, 74, 42, '#b91c1c', 'Error color at 800 weight. Dark shade.'),
  '900': colorToken(0, 70, 35, '#991b1b', 'Error color at 900 weight. Darker shade.'),
  '1000': colorToken(0, 63, 31, '#7f1d1d', 'Error color at 1000 weight. Very dark shade.'),
  '1100': colorToken(0, 58, 20, '#5c1010', 'Error color at 1100 weight. Near-darkest shade.'),
  '1200': colorToken(0, 52, 12, '#3d0909', 'Error color at 1200 weight. Darkest shade.'),
};

// === Opacity Tokens ===

export const OPACITY_TOKENS: Record<string, NumberToken> = {
  '5':   { $type: 'number', $value: 0.05, $description: '5% opacity. Extremely subtle overlay for hover states and subtle layers.' },
  '10':  { $type: 'number', $value: 0.1, $description: '10% opacity. Very subtle overlay for dropdown shadows and light overlays.' },
  '20':  { $type: 'number', $value: 0.2, $description: '20% opacity. Subtle overlay for card shadows and medium overlays.' },
  '40':  { $type: 'number', $value: 0.4, $description: '40% opacity. Medium overlay for disabled states and backgrounds.' },
  '60':  { $type: 'number', $value: 0.6, $description: '60% opacity. Semi-transparent overlay for modal backdrops.' },
  '80':  { $type: 'number', $value: 0.8, $description: '80% opacity. Strong overlay for high emphasis modals and overlays.' },
  '100': { $type: 'number', $value: 1, $description: '100% opacity. Fully opaque, no transparency.' },
};

// === White and Black Base Colors ===

export const WHITE_TOKEN: ColorToken = colorToken(0, 0, 100, '#ffffff', 'Pure white. Base white color for light backgrounds and text on dark surfaces.');
export const BLACK_TOKEN: ColorToken = colorToken(0, 0, 0, '#000000', 'Pure black. Base black color for dark backgrounds and overlays.');

// === Font Size Tokens ===

export const FONT_SIZE_TOKENS: Record<string, DimensionToken> = {
  xs:   { $type: 'dimension', $value: { value: 12, unit: 'px' }, $description: 'Extra small (12px). Fine print, captions.' },
  sm:   { $type: 'dimension', $value: { value: 14, unit: 'px' }, $description: 'Small (14px). Small text, labels.' },
  md:   { $type: 'dimension', $value: { value: 16, unit: 'px' }, $description: 'Medium (16px). Base size for body text.' },
  lg:   { $type: 'dimension', $value: { value: 18, unit: 'px' }, $description: 'Large (18px). Emphasized body text.' },
  xl:   { $type: 'dimension', $value: { value: 20, unit: 'px' }, $description: 'Extra large (20px). Small headings.' },
  '2xl': { $type: 'dimension', $value: { value: 24, unit: 'px' }, $description: '2XL (24px). H4 headings.' },
  '3xl': { $type: 'dimension', $value: { value: 30, unit: 'px' }, $description: '3XL (30px). H3 headings.' },
  '4xl': { $type: 'dimension', $value: { value: 36, unit: 'px' }, $description: '4XL (36px). H2 headings.' },
  '5xl': { $type: 'dimension', $value: { value: 48, unit: 'px' }, $description: '5XL (48px). H1 headings.' },
  '6xl': { $type: 'dimension', $value: { value: 60, unit: 'px' }, $description: '6XL (60px). Hero headings.' },
};

// === Font Weight Tokens ===

export const FONT_WEIGHT_TOKENS: Record<string, NumberToken> = {
  regular:  { $type: 'number', $value: 400, $description: 'Regular weight (400). Default for body text and most UI elements.' },
  medium:   { $type: 'number', $value: 500, $description: 'Medium weight (500). For emphasis, labels, and navigation items.' },
  semibold: { $type: 'number', $value: 600, $description: 'Semibold weight (600). For subheadings and strong labels.' },
  bold:     { $type: 'number', $value: 700, $description: 'Bold weight (700). For headings, strong emphasis, and CTAs.' },
};

// === Line Height Tokens ===

export const LINE_HEIGHT_TOKENS: Record<string, NumberToken> = {
  tight:  { $type: 'number', $value: 1.10, $description: 'Tight (1.10). For headings and compact single-line text.' },
  snug:   { $type: 'number', $value: 1.25, $description: 'Snug (1.25). For subheadings and compact text blocks.' },
  normal: { $type: 'number', $value: 1.5, $description: 'Normal (1.5). Default for body text and most UI elements. Optimal readability.' },
};

// === Letter Spacing Tokens ===

export const LETTER_SPACING_TOKENS: Record<string, DimensionToken> = {
  tight:  { $type: 'dimension', $value: { value: -0.02, unit: 'em' }, $description: 'Tight letter spacing (-0.02em). Use for large headings to create compact typography.' },
  normal: { $type: 'dimension', $value: { value: 0, unit: 'em' }, $description: 'Normal letter spacing (0em). Default for most text.' },
  wide:   { $type: 'dimension', $value: { value: 0.05, unit: 'em' }, $description: 'Wide letter spacing (0.05em). Use for uppercase text and labels.' },
};

// === Spacing Scales ===

function spacingToken(value: number, description: string): DimensionToken {
  return {
    $type: 'dimension',
    $value: { value, unit: 'px' },
    $description: description,
  };
}

export const SPACING_SCALE_4PX: Record<string, DimensionToken> = {
  '0':  spacingToken(0, 'Zero spacing. Used for removing gaps.'),
  '1':  spacingToken(4, 'Smallest spacing unit (4px). Tight spacing for compact layouts.'),
  '2':  spacingToken(8, 'Base spacing unit (8px). Foundation of spacing scale.'),
  '3':  spacingToken(12, 'Small spacing (12px). For compact padding.'),
  '4':  spacingToken(16, 'Medium spacing (16px). Default for most layouts.'),
  '5':  spacingToken(20, 'Medium-large spacing (20px).'),
  '6':  spacingToken(24, 'Large spacing (24px). For comfortable padding.'),
  '8':  spacingToken(32, 'Extra large spacing (32px). Section separation.'),
  '10': spacingToken(40, '2XL spacing (40px). Major section separation.'),
  '12': spacingToken(48, '3XL spacing (48px). Large section gaps.'),
  '16': spacingToken(64, '4XL spacing (64px). Hero section spacing.'),
  '20': spacingToken(80, '5XL spacing (80px). Large section spacing.'),
  '24': spacingToken(96, '6XL spacing (96px). Extra large section spacing.'),
  '32': spacingToken(128, '7XL spacing (128px). Hero section spacing.'),
  '40': spacingToken(160, '8XL spacing (160px). Maximum spacing for large layouts.'),
};

export const SPACING_SCALE_8PX: Record<string, DimensionToken> = {
  '0':  spacingToken(0, 'Zero spacing. Used for removing gaps.'),
  '1':  spacingToken(8, 'Smallest spacing unit (8px). Tight spacing for compact layouts.'),
  '2':  spacingToken(16, 'Base spacing unit (16px). Foundation of spacing scale.'),
  '3':  spacingToken(24, 'Small spacing (24px). For compact padding.'),
  '4':  spacingToken(32, 'Medium spacing (32px). Default for most layouts.'),
  '5':  spacingToken(40, 'Medium-large spacing (40px).'),
  '6':  spacingToken(48, 'Large spacing (48px). For comfortable padding.'),
  '8':  spacingToken(64, 'Extra large spacing (64px). Section separation.'),
  '10': spacingToken(80, '2XL spacing (80px). Major section separation.'),
  '12': spacingToken(96, '3XL spacing (96px). Large section gaps.'),
  '16': spacingToken(128, '4XL spacing (128px). Hero section spacing.'),
  '20': spacingToken(160, '5XL spacing (160px). Large section spacing.'),
  '24': spacingToken(192, '6XL spacing (192px). Extra large section spacing.'),
  '32': spacingToken(256, '7XL spacing (256px). Hero section spacing.'),
  '40': spacingToken(320, '8XL spacing (320px). Maximum spacing for large layouts.'),
};

// === Border Radius Tokens ===

export const BORDER_RADIUS_TOKENS: Record<string, DimensionToken> = {
  none: { $type: 'dimension', $value: { value: 0, unit: 'px' }, $description: 'No rounding. Sharp corners.' },
  sm:   { $type: 'dimension', $value: { value: 4, unit: 'px' }, $description: 'Small radius (4px). Subtle rounding.' },
  md:   { $type: 'dimension', $value: { value: 8, unit: 'px' }, $description: 'Medium radius (8px). Standard for buttons, inputs.' },
  lg:   { $type: 'dimension', $value: { value: 12, unit: 'px' }, $description: 'Large radius (12px). Cards and containers.' },
  xl:   { $type: 'dimension', $value: { value: 16, unit: 'px' }, $description: 'Extra large radius (16px). Prominent cards.' },
  '2xl': { $type: 'dimension', $value: { value: 24, unit: 'px' }, $description: '2XL radius (24px). Large cards.' },
  full: { $type: 'dimension', $value: { value: 9999, unit: 'px' }, $description: 'Fully rounded. Pills and badges.' },
};

// === Border Width Tokens ===

export const BORDER_WIDTH_TOKENS: Record<string, DimensionToken> = {
  none:   { $type: 'dimension', $value: { value: 0, unit: 'px' }, $description: 'No border.' },
  thin:   { $type: 'dimension', $value: { value: 1, unit: 'px' }, $description: 'Thin border (1px). Default for most borders.' },
  medium: { $type: 'dimension', $value: { value: 2, unit: 'px' }, $description: 'Medium border (2px). Emphasis.' },
  thick:  { $type: 'dimension', $value: { value: 4, unit: 'px' }, $description: 'Thick border (4px). Strong emphasis.' },
};

// === Font Fallback Stacks ===

export const FONT_FALLBACK_STACKS: Record<string, string[]> = {
  'System Sans':  ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  'System Serif': ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
  'System Mono':  ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
};

// === Default Breakpoint Values ===

export const DEFAULT_BREAKPOINTS: BreakpointEntry[] = [
  { name: 'mobile', value: 320 },
  { name: 'tablet', value: 768 },
  { name: 'desktop', value: 1280 },
  { name: 'wide', value: 1720 },
];
