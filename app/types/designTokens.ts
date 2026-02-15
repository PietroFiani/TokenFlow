// === Form/Configuration State Types ===

export type ColorRole = 'primary' | 'secondary' | 'tertiary';

export interface BrandColorEntry {
  role: ColorRole;
  seedColor: string;
  enabled: boolean;
}

export interface FontFamilyEntry {
  role: 'primary' | 'secondary';
  familyName: string;
  fallbacks: string[];
  enabled: boolean;
}

export type SpacingBase = 4 | 8;

export interface BreakpointEntry {
  name: 'mobile' | 'tablet' | 'desktop' | 'wide';
  value: number; // in pixels
}

export interface BreakpointsConfig {
  enabled: boolean;
  breakpoints: BreakpointEntry[];
}

export interface DesignSystemConfig {
  brandColors: BrandColorEntry[];
  fonts: FontFamilyEntry[];
  spacingBase: SpacingBase;
  breakpoints: BreakpointsConfig;
}

// === W3C Design Token Format Types ===

export interface ColorTokenValue {
  colorSpace: 'hsl';
  components: [number, number, number];
  alpha: number;
  hex: string;
}

export interface ColorToken {
  $type: 'color';
  $value: ColorTokenValue;
  $description: string;
}

export interface TransparencyToken {
  $type: 'color';
  $value: ColorTokenValue;
  $description: string;
  $extensions?: {
    elevation: {
      offsetX: string;
      offsetY: string;
      blur: string;
      spread: string;
    };
  };
}

export interface DimensionValue {
  value: number;
  unit: string;
}

export interface DimensionToken {
  $type: 'dimension';
  $value: DimensionValue;
  $description: string;
}

export interface NumberToken {
  $type: 'number';
  $value: number;
  $description: string;
}

export interface FontFamilyToken {
  $type: 'fontFamily';
  $value: string[];
  $description: string;
}

// === Top-Level primitive.json Structure ===

export type ColorScale = Record<string, ColorToken>;

export interface PrimitiveTokens {
  color: {
    primary: ColorScale;
    secondary?: ColorScale;
    tertiary?: ColorScale;
    neutral: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    error: ColorScale;
    white: ColorToken;
    black: ColorToken;
  };
  opacity: Record<string, NumberToken>;
  fontFamily: {
    primary: FontFamilyToken;
    secondary?: FontFamilyToken;
  };
  fontSize: Record<string, DimensionToken>;
  fontWeight: Record<string, NumberToken>;
  lineHeight: Record<string, NumberToken>;
  letterSpacing: Record<string, DimensionToken>;
  spacing: Record<string, DimensionToken>;
  borderRadius: Record<string, DimensionToken>;
  borderWidth: Record<string, DimensionToken>;
  breakpoint?: Record<string, DimensionToken>;
}

// === Semantic Token Types ===

export interface SemanticTokenReference {
  $type: string;
  $value: string; // e.g., "{color.neutral.100}"
  $description: string;
  $extensions?: Record<string, any>;
}

export interface SemanticTokens {
  color: {
    background: {
      neutral: Record<string, Record<string, Record<string, SemanticTokenReference>>>;
      brand: Record<string, Record<string, Record<string, SemanticTokenReference>>>;
      intent: Record<string, Record<string, Record<string, SemanticTokenReference>> | SemanticTokenReference>;
      overlay: Record<string, SemanticTokenReference>;
    };
    text: {
      neutral: Record<string, Record<string, SemanticTokenReference>>;
      brand: Record<string, Record<string, SemanticTokenReference>>;
      intent: Record<string, Record<string, SemanticTokenReference> | Record<string, Record<string, SemanticTokenReference>>>;
    };
    border: {
      neutral: Record<string, Record<string, SemanticTokenReference>>;
      brand: Record<string, Record<string, SemanticTokenReference>>;
      intent: Record<string, Record<string, SemanticTokenReference> | Record<string, Record<string, SemanticTokenReference>>>;
    };
  };
  spacing: {
    padding: Record<string, SemanticTokenReference>;
    gap: Record<string, SemanticTokenReference>;
  };
  border: {
    radius: Record<string, SemanticTokenReference>;
    width: Record<string, SemanticTokenReference>;
  };
  typography: Record<string, any>;
  transition: {
    duration: Record<string, any>;
  };
  zIndex: Record<string, any>;
  shadow: Record<string, any>;
  iconSize: Record<string, SemanticTokenReference>;
}

// === CSS Custom Property Type Definitions ===
// These types enable type-safe usage of CSS design tokens

export type PrimitiveColorToken =
  | `--color-primary-${100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100 | 1200}`
  | `--color-neutral-${100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100 | 1200}`
  | `--color-success-${100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100 | 1200}`
  | `--color-warning-${100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100 | 1200}`
  | `--color-error-${100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100 | 1200}`
  | '--color-white'
  | '--color-black';

export type SemanticBackgroundToken =
  | '--color-background-neutral-base-default'
  | '--color-background-neutral-base-hover'
  | '--color-background-neutral-base-pressed'
  | '--color-background-neutral-muted-default'
  | '--color-background-neutral-muted-hover'
  | '--color-background-neutral-muted-pressed'
  | '--color-background-brand-primary-default'
  | '--color-background-brand-primary-hover'
  | '--color-background-brand-primary-inverse-default'
  | '--color-background-brand-primary-inverse-hover'
  | '--color-background-brand-primary-inverse-pressed'
  | '--color-background-intent-error-default'
  | '--color-background-intent-warning-default'
  | '--color-background-intent-success-default';

export type SemanticTextToken =
  | '--color-text-neutral-base-default'
  | '--color-text-neutral-muted-default'
  | '--color-text-neutral-subtle-default'
  | '--color-text-neutral-inverse-default'
  | '--color-text-brand-primary-default'
  | '--color-text-intent-error-default'
  | '--color-text-intent-warning-default'
  | '--color-text-intent-success-default';

export type SemanticBorderToken =
  | '--color-border-neutral-base-default'
  | '--color-border-neutral-base-hover'
  | '--color-border-neutral-muted-default'
  | '--color-border-brand-primary-default'
  | '--color-border-intent-error-default'
  | '--color-border-intent-warning-default'
  | '--color-border-intent-success-default';

export type SpacingToken =
  | '--spacing-0'
  | '--spacing-1'
  | '--spacing-2'
  | '--spacing-3'
  | '--spacing-4'
  | '--spacing-5'
  | '--spacing-6'
  | '--spacing-8'
  | '--spacing-10'
  | '--spacing-12'
  | '--spacing-16'
  | '--spacing-20'
  | '--spacing-24'
  | '--spacing-32'
  | '--spacing-40';

export type DesignToken =
  | PrimitiveColorToken
  | SemanticBackgroundToken
  | SemanticTextToken
  | SemanticBorderToken
  | SpacingToken;
