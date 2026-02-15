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
