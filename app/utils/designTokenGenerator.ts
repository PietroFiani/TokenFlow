import type { ColorShade } from '~/app/types/palette';
import type {
  DesignSystemConfig,
  PrimitiveTokens,
  ColorScale,
  ColorToken,
  DimensionToken,
  BreakpointEntry,
} from '~/app/types/designTokens';
import { generatePalette } from './paletteGenerator';
import {
  NEUTRAL_COLOR_SCALE,
  SUCCESS_COLOR_SCALE,
  WARNING_COLOR_SCALE,
  ERROR_COLOR_SCALE,
  OPACITY_TOKENS,
  WHITE_TOKEN,
  BLACK_TOKEN,
  FONT_SIZE_TOKENS,
  FONT_WEIGHT_TOKENS,
  LINE_HEIGHT_TOKENS,
  LETTER_SPACING_TOKENS,
  SPACING_SCALE_4PX,
  SPACING_SCALE_8PX,
  BORDER_RADIUS_TOKENS,
  BORDER_WIDTH_TOKENS,
  SHADE_DESCRIPTIONS,
} from './fixedTokens';

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Validates that breakpoint values are in ascending order.
 */
export function validateBreakpoints(breakpoints: BreakpointEntry[]): boolean {
  const values = breakpoints.map(bp => bp.value);
  for (let i = 1; i < values.length; i++) {
    if (values[i] <= values[i - 1]) return false;
  }
  return true;
}

/**
 * Maps a ColorShade[] (from generatePalette) to the primitive.json ColorScale format.
 */
export function shadesToColorScale(shades: ColorShade[], roleName: string): ColorScale {
  const scale: ColorScale = {};
  for (const shade of shades) {
    const key = String(shade.shade);
    scale[key] = {
      $type: 'color',
      $value: {
        colorSpace: 'hsl',
        components: [
          Math.round(shade.hsl.h),
          Math.round(shade.hsl.s),
          Math.round(shade.hsl.l),
        ],
        alpha: 1,
        hex: shade.hex.toLowerCase(),
      },
      $description: `${capitalize(roleName)} color at ${shade.shade} weight. ${SHADE_DESCRIPTIONS[shade.shade] || ''}`,
    } as ColorToken;
  }
  return scale;
}

/**
 * Generates the full primitive.json token structure from a DesignSystemConfig.
 */
export function generatePrimitiveTokens(config: DesignSystemConfig): PrimitiveTokens {
  // 1. Generate brand color scales (build in correct key order: primary, secondary, tertiary, then fixed)
  const colorSection: PrimitiveTokens['color'] = {} as PrimitiveTokens['color'];

  colorSection.primary = shadesToColorScale(generatePalette(config.brandColors[0].seedColor), 'primary');

  if (config.brandColors[1]?.enabled && config.brandColors[1].seedColor) {
    colorSection.secondary = shadesToColorScale(
      generatePalette(config.brandColors[1].seedColor),
      'secondary'
    );
  }
  if (config.brandColors[2]?.enabled && config.brandColors[2].seedColor) {
    colorSection.tertiary = shadesToColorScale(
      generatePalette(config.brandColors[2].seedColor),
      'tertiary'
    );
  }

  colorSection.neutral = NEUTRAL_COLOR_SCALE;
  colorSection.success = SUCCESS_COLOR_SCALE;
  colorSection.warning = WARNING_COLOR_SCALE;
  colorSection.error = ERROR_COLOR_SCALE;
  colorSection.white = WHITE_TOKEN;
  colorSection.black = BLACK_TOKEN;

  // 2. Opacity tokens (separate from colors)
  const opacitySection = OPACITY_TOKENS;

  // 3. Font families
  const fontFamilySection: PrimitiveTokens['fontFamily'] = {
    primary: {
      $type: 'fontFamily',
      $value: [config.fonts[0].familyName, ...config.fonts[0].fallbacks],
      $description: 'Primary font stack for UI and body text.',
    },
  };
  if (config.fonts[1]?.enabled && config.fonts[1].familyName) {
    fontFamilySection.secondary = {
      $type: 'fontFamily',
      $value: [config.fonts[1].familyName, ...config.fonts[1].fallbacks],
      $description: 'Secondary font stack for editorial content.',
    };
  }

  // 4. Spacing based on grid selection
  const spacingTokens = config.spacingBase === 4 ? SPACING_SCALE_4PX : SPACING_SCALE_8PX;

  // 5. Generate breakpoint tokens if enabled
  let breakpointTokens: Record<string, DimensionToken> | undefined;
  if (config.breakpoints.enabled) {
    breakpointTokens = {};
    const descriptions: Record<string, string> = {
      mobile: 'Minimum supported device width.',
      tablet: 'iPad and tablet devices.',
      desktop: 'Standard laptop and desktop screens.',
      wide: 'Large monitors and high-resolution displays.',
    };

    for (const bp of config.breakpoints.breakpoints) {
      breakpointTokens[bp.name] = {
        $type: 'dimension',
        $value: { value: bp.value, unit: 'px' },
        $description: `${capitalize(bp.name)} breakpoint (${bp.value}px). ${descriptions[bp.name]}`,
      };
    }
  }

  // 6. Assemble full token tree
  return {
    color: colorSection,
    opacity: opacitySection,
    fontFamily: fontFamilySection,
    fontSize: FONT_SIZE_TOKENS,
    fontWeight: FONT_WEIGHT_TOKENS,
    lineHeight: LINE_HEIGHT_TOKENS,
    letterSpacing: LETTER_SPACING_TOKENS,
    spacing: spacingTokens,
    borderRadius: BORDER_RADIUS_TOKENS,
    borderWidth: BORDER_WIDTH_TOKENS,
    ...(breakpointTokens && { breakpoint: breakpointTokens }),
  };
}

/**
 * Generates semantic tokens that reference primitive tokens.
 * Uses {token.path} syntax to create semantic layer.
 */
export function generateSemanticTokens(primitives: PrimitiveTokens): any {
  const hasSecondary = !!primitives.color.secondary;
  const hasTertiary = !!primitives.color.tertiary;

  return {
    color: {
      background: {
        neutral: {
          base: {
            default: { $type: 'color', $value: '{color.neutral.100}', $description: 'Default page and section background. Use for main content areas, app shell.' },
            hover: { $type: 'color', $value: '{color.neutral.200}', $description: 'Base background on hover.' },
            pressed: { $type: 'color', $value: '{color.neutral.300}', $description: 'Base background on pressed/active state.' }
          },
          muted: {
            default: { $type: 'color', $value: '{color.neutral.200}', $description: 'Muted background for secondary surfaces. Use for cards, panels, sidebars, containers.' },
            hover: { $type: 'color', $value: '{color.neutral.300}', $description: 'Muted background on hover.' },
            pressed: { $type: 'color', $value: '{color.neutral.400}', $description: 'Muted background on pressed/active state.' }
          },
          inverse: {
            default: { $type: 'color', $value: '{color.neutral.1100}', $description: 'Inverse dark background. Use for dark sections, hero banners, footers, dark navigation.' },
            hover: { $type: 'color', $value: '{color.neutral.1000}', $description: 'Inverse background on hover.' },
            pressed: { $type: 'color', $value: '{color.neutral.900}', $description: 'Inverse background on pressed/active state.' }
          }
        },
        brand: {
          primary: {
            default: { $type: 'color', $value: '{color.primary.100}', $description: 'Soft primary brand background. Use for tinted sections, subtle brand containers, light accents.' },
            hover: { $type: 'color', $value: '{color.primary.200}', $description: 'Soft primary brand background on hover.' },
            pressed: { $type: 'color', $value: '{color.primary.300}', $description: 'Soft primary brand background on pressed/active state.' }
          },
          ...(hasSecondary && {
            secondary: {
              default: { $type: 'color', $value: '{color.secondary.100}', $description: 'Soft secondary brand background. Use for tinted sections, subtle accent containers.' },
              hover: { $type: 'color', $value: '{color.secondary.200}', $description: 'Soft secondary brand background on hover.' },
              pressed: { $type: 'color', $value: '{color.secondary.300}', $description: 'Soft secondary brand background on pressed/active state.' }
            }
          }),
          primaryInverse: {
            default: { $type: 'color', $value: '{color.primary.700}', $description: 'Strong primary brand background. Use for CTAs, primary buttons, active toggles, hero sections.' },
            hover: { $type: 'color', $value: '{color.primary.800}', $description: 'Strong primary brand background on hover.' },
            pressed: { $type: 'color', $value: '{color.primary.900}', $description: 'Strong primary brand background on pressed/active state.' }
          },
          ...(hasSecondary && {
            secondaryInverse: {
              default: { $type: 'color', $value: '{color.secondary.700}', $description: 'Strong secondary brand background. Use for secondary CTAs, accent buttons, secondary actions.' },
              hover: { $type: 'color', $value: '{color.secondary.800}', $description: 'Strong secondary brand background on hover.' },
              pressed: { $type: 'color', $value: '{color.secondary.900}', $description: 'Strong secondary brand background on pressed/active state.' }
            }
          })
        },
        intent: {
          error: {
            default: { $type: 'color', $value: '{color.error.100}', $description: 'Soft error background. Use for inline error alerts, error banners, validation containers.' },
            hover: { $type: 'color', $value: '{color.error.200}', $description: 'Soft error background on hover.' },
            pressed: { $type: 'color', $value: '{color.error.300}', $description: 'Soft error background on pressed/active state.' }
          },
          errorInverse: {
            default: { $type: 'color', $value: '{color.error.600}', $description: 'Strong error background. Use for destructive buttons, critical error alerts, danger CTAs.' },
            hover: { $type: 'color', $value: '{color.error.700}', $description: 'Strong error background on hover.' },
            pressed: { $type: 'color', $value: '{color.error.800}', $description: 'Strong error background on pressed/active state.' }
          },
          warning: {
            default: { $type: 'color', $value: '{color.warning.100}', $description: 'Soft warning background. Use for inline warning alerts, caution banners, warning containers.' },
            hover: { $type: 'color', $value: '{color.warning.200}', $description: 'Soft warning background on hover.' },
            pressed: { $type: 'color', $value: '{color.warning.300}', $description: 'Soft warning background on pressed/active state.' }
          },
          warningInverse: {
            default: { $type: 'color', $value: '{color.warning.600}', $description: 'Strong warning background. Use for warning buttons, caution CTAs, high-alert warnings.' },
            hover: { $type: 'color', $value: '{color.warning.700}', $description: 'Strong warning background on hover.' },
            pressed: { $type: 'color', $value: '{color.warning.800}', $description: 'Strong warning background on pressed/active state.' }
          },
          success: {
            default: { $type: 'color', $value: '{color.success.100}', $description: 'Soft success background. Use for inline success alerts, confirmation banners, success containers.' },
            hover: { $type: 'color', $value: '{color.success.200}', $description: 'Soft success background on hover.' },
            pressed: { $type: 'color', $value: '{color.success.300}', $description: 'Soft success background on pressed/active state.' }
          },
          successInverse: {
            default: { $type: 'color', $value: '{color.success.600}', $description: 'Strong success background. Use for confirmation buttons, positive CTAs, success actions.' },
            hover: { $type: 'color', $value: '{color.success.700}', $description: 'Strong success background on hover.' },
            pressed: { $type: 'color', $value: '{color.success.800}', $description: 'Strong success background on pressed/active state.' }
          }
        },
        overlay: {
          modal: { $type: 'color', $value: '{color.black}', $description: 'Modal backdrop overlay. Semi-transparent dark overlay for modal dialogs, drawers, and popovers.', $extensions: { opacity: '{opacity.60}' } },
          image: { $type: 'color', $value: '{color.black}', $description: 'Image overlay. Dark overlay for text readability on images and media.', $extensions: { opacity: '{opacity.40}' } }
        }
      },
      text: {
        neutral: {
          base: {
            default: { $type: 'color', $value: '{color.neutral.1100}', $description: 'Primary text color. Near-black provides excellent readability. Use for body text, headings, primary content.' },
            hover: { $type: 'color', $value: '{color.neutral.1000}', $description: 'Base text on hover.' },
            pressed: { $type: 'color', $value: '{color.neutral.900}', $description: 'Base text on pressed/active state.' }
          },
          muted: {
            default: { $type: 'color', $value: '{color.neutral.800}', $description: 'Secondary text color. Use for labels, helper text, timestamps, less important content.' },
            hover: { $type: 'color', $value: '{color.neutral.900}', $description: 'Muted text on hover.' },
            pressed: { $type: 'color', $value: '{color.neutral.1000}', $description: 'Muted text on pressed/active state.' }
          },
          subtle: {
            default: { $type: 'color', $value: '{color.neutral.600}', $description: 'Tertiary text color. Use for placeholder text, disabled states. Meets WCAG AA for large text only.' },
            hover: { $type: 'color', $value: '{color.neutral.700}', $description: 'Subtle text on hover.' },
            pressed: { $type: 'color', $value: '{color.neutral.800}', $description: 'Subtle text on pressed/active state.' }
          },
          inverse: {
            default: { $type: 'color', $value: '{color.neutral.100}', $description: 'Inverse text for dark backgrounds. Use on brand backgrounds, dark surfaces. Examples: Text on primary buttons.' },
            hover: { $type: 'color', $value: '{color.neutral.200}', $description: 'Inverse text on hover.' },
            pressed: { $type: 'color', $value: '{color.neutral.300}', $description: 'Inverse text on pressed/active state.' }
          }
        },
        brand: {
          primary: {
            default: { $type: 'color', $value: '{color.primary.700}', $description: 'Primary brand text. Use for links, brand-colored text. Examples: Hyperlinks, brand labels.' },
            hover: { $type: 'color', $value: '{color.primary.800}', $description: 'Primary brand text on hover. Use for link hover states.' },
            pressed: { $type: 'color', $value: '{color.primary.900}', $description: 'Primary brand text on pressed/active state.' }
          },
          ...(hasSecondary && {
            secondary: {
              default: { $type: 'color', $value: '{color.secondary.700}', $description: 'Secondary brand text. Use for secondary links and accents.' },
              hover: { $type: 'color', $value: '{color.secondary.800}', $description: 'Secondary brand text on hover.' },
              pressed: { $type: 'color', $value: '{color.secondary.900}', $description: 'Secondary brand text on pressed/active state.' }
            }
          })
        },
        intent: {
          success: {
            default: { $type: 'color', $value: '{color.success.700}', $description: 'Success text for positive feedback. Examples: Success messages, confirmation text.' },
            hover: { $type: 'color', $value: '{color.success.800}', $description: 'Success text on hover.' },
            pressed: { $type: 'color', $value: '{color.success.900}', $description: 'Success text on pressed/active state.' },
            muted: {
              default: { $type: 'color', $value: '{color.success.500}', $description: 'Muted success text. Subtle positive feedback.' },
              hover: { $type: 'color', $value: '{color.success.600}', $description: 'Muted success text on hover.' },
              pressed: { $type: 'color', $value: '{color.success.700}', $description: 'Muted success text on pressed/active state.' }
            }
          },
          warning: {
            default: { $type: 'color', $value: '{color.warning.700}', $description: 'Warning text for cautionary feedback. Examples: Warning messages, caution text.' },
            hover: { $type: 'color', $value: '{color.warning.800}', $description: 'Warning text on hover.' },
            pressed: { $type: 'color', $value: '{color.warning.900}', $description: 'Warning text on pressed/active state.' },
            muted: {
              default: { $type: 'color', $value: '{color.warning.600}', $description: 'Muted warning text. Subtle cautionary feedback.' },
              hover: { $type: 'color', $value: '{color.warning.700}', $description: 'Muted warning text on hover.' },
              pressed: { $type: 'color', $value: '{color.warning.800}', $description: 'Muted warning text on pressed/active state.' }
            }
          },
          error: {
            default: { $type: 'color', $value: '{color.error.700}', $description: 'Error text for negative feedback. Examples: Error messages, validation text.' },
            hover: { $type: 'color', $value: '{color.error.800}', $description: 'Error text on hover.' },
            pressed: { $type: 'color', $value: '{color.error.900}', $description: 'Error text on pressed/active state.' },
            muted: {
              default: { $type: 'color', $value: '{color.error.500}', $description: 'Muted error text. Subtle negative feedback.' },
              hover: { $type: 'color', $value: '{color.error.600}', $description: 'Muted error text on hover.' },
              pressed: { $type: 'color', $value: '{color.error.700}', $description: 'Muted error text on pressed/active state.' }
            }
          }
        }
      },
      border: {
        neutral: {
          base: {
            default: { $type: 'color', $value: '{color.neutral.400}', $description: 'Default border color. Use for dividers, input borders, card outlines.' },
            hover: { $type: 'color', $value: '{color.neutral.500}', $description: 'Base border on hover.' },
            pressed: { $type: 'color', $value: '{color.neutral.600}', $description: 'Base border on pressed/active state.' }
          },
          muted: {
            default: { $type: 'color', $value: '{color.neutral.300}', $description: 'Subtle border color. Use for very subtle dividers.' },
            hover: { $type: 'color', $value: '{color.neutral.400}', $description: 'Muted border on hover.' },
            pressed: { $type: 'color', $value: '{color.neutral.500}', $description: 'Muted border on pressed/active state.' }
          },
          emphasis: {
            default: { $type: 'color', $value: '{color.neutral.500}', $description: 'Emphasized border. Use for focused states, stronger dividers.' },
            hover: { $type: 'color', $value: '{color.neutral.600}', $description: 'Emphasis border on hover.' },
            pressed: { $type: 'color', $value: '{color.neutral.700}', $description: 'Emphasis border on pressed/active state.' }
          }
        },
        brand: {
          primary: {
            default: { $type: 'color', $value: '{color.primary.700}', $description: 'Primary brand border. Use for focus rings, brand-accented containers.' },
            hover: { $type: 'color', $value: '{color.primary.800}', $description: 'Primary brand border on hover.' },
            pressed: { $type: 'color', $value: '{color.primary.900}', $description: 'Primary brand border on pressed/active state.' }
          },
          ...(hasSecondary && {
            secondary: {
              default: { $type: 'color', $value: '{color.secondary.700}', $description: 'Secondary brand border. Use for secondary accented containers.' },
              hover: { $type: 'color', $value: '{color.secondary.800}', $description: 'Secondary brand border on hover.' },
              pressed: { $type: 'color', $value: '{color.secondary.900}', $description: 'Secondary brand border on pressed/active state.' }
            }
          })
        },
        intent: {
          success: {
            default: { $type: 'color', $value: '{color.success.600}', $description: 'Success border for positive feedback. Examples: Valid input borders.' },
            hover: { $type: 'color', $value: '{color.success.700}', $description: 'Success border on hover.' },
            pressed: { $type: 'color', $value: '{color.success.800}', $description: 'Success border on pressed/active state.' },
            muted: {
              default: { $type: 'color', $value: '{color.success.400}', $description: 'Muted success border. Subtle positive feedback.' },
              hover: { $type: 'color', $value: '{color.success.500}', $description: 'Muted success border on hover.' },
              pressed: { $type: 'color', $value: '{color.success.600}', $description: 'Muted success border on pressed/active state.' }
            }
          },
          warning: {
            default: { $type: 'color', $value: '{color.warning.600}', $description: 'Warning border for cautionary feedback. Examples: Warning input borders.' },
            hover: { $type: 'color', $value: '{color.warning.700}', $description: 'Warning border on hover.' },
            pressed: { $type: 'color', $value: '{color.warning.800}', $description: 'Warning border on pressed/active state.' },
            muted: {
              default: { $type: 'color', $value: '{color.warning.400}', $description: 'Muted warning border. Subtle cautionary feedback.' },
              hover: { $type: 'color', $value: '{color.warning.500}', $description: 'Muted warning border on hover.' },
              pressed: { $type: 'color', $value: '{color.warning.600}', $description: 'Muted warning border on pressed/active state.' }
            }
          },
          error: {
            default: { $type: 'color', $value: '{color.error.600}', $description: 'Error border for validation states. Examples: Invalid input borders.' },
            hover: { $type: 'color', $value: '{color.error.700}', $description: 'Error border on hover.' },
            pressed: { $type: 'color', $value: '{color.error.800}', $description: 'Error border on pressed/active state.' },
            muted: {
              default: { $type: 'color', $value: '{color.error.400}', $description: 'Muted error border. Subtle negative feedback.' },
              hover: { $type: 'color', $value: '{color.error.500}', $description: 'Muted error border on hover.' },
              pressed: { $type: 'color', $value: '{color.error.600}', $description: 'Muted error border on pressed/active state.' }
            }
          }
        }
      }
    },
    spacing: {
      padding: {
        xs: { $type: 'dimension', $value: '{spacing.1}', $description: 'Use for tight internal spacing in compact components.' },
        sm: { $type: 'dimension', $value: '{spacing.2}', $description: 'Use for compact components like small buttons and chips.' },
        md: { $type: 'dimension', $value: '{spacing.4}', $description: 'Default for buttons, input fields, cards, and standard components.' },
        lg: { $type: 'dimension', $value: '{spacing.6}', $description: 'Use for spacious components and large containers.' },
        xl: { $type: 'dimension', $value: '{spacing.8}', $description: 'Use for hero sections and major layout containers.' }
      },
      gap: {
        xs: { $type: 'dimension', $value: '{spacing.1}', $description: 'Use for tight spacing between related elements.' },
        sm: { $type: 'dimension', $value: '{spacing.2}', $description: 'Use for compact layouts, button groups, and closely related content.' },
        md: { $type: 'dimension', $value: '{spacing.4}', $description: 'Default spacing between elements and content sections.' },
        lg: { $type: 'dimension', $value: '{spacing.6}', $description: 'Use for spacing between major content groups and sections.' },
        xl: { $type: 'dimension', $value: '{spacing.8}', $description: 'Use for separation between distinct page sections and major layout areas.' }
      }
    },
    border: {
      radius: {
        none: { $type: 'dimension', $value: '{borderRadius.none}', $description: 'No rounding. Sharp corners for strict geometric designs.' },
        sm: { $type: 'dimension', $value: '{borderRadius.sm}', $description: 'Subtle corners.' },
        md: { $type: 'dimension', $value: '{borderRadius.md}', $description: 'Standard for buttons, inputs, chips.' },
        lg: { $type: 'dimension', $value: '{borderRadius.lg}', $description: 'Cards, modals, panels.' },
        xl: { $type: 'dimension', $value: '{borderRadius.xl}', $description: 'Prominent cards.' },
        full: { $type: 'dimension', $value: '{borderRadius.full}', $description: 'Fully rounded. Avatars, pills, badges, toggle switches.' }
      },
      width: {
        none: { $type: 'dimension', $value: '{borderWidth.none}', $description: 'No border.' },
        thin: { $type: 'dimension', $value: '{borderWidth.thin}', $description: 'Default for inputs, cards, dividers.' },
        medium: { $type: 'dimension', $value: '{borderWidth.medium}', $description: 'Emphasis, focus rings.' },
        thick: { $type: 'dimension', $value: '{borderWidth.thick}', $description: 'Strong emphasis, indicators.' }
      }
    },
    typography: {
      display: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.6xl}', fontWeight: '{fontWeight.bold}', lineHeight: '{lineHeight.tight}' }, $description: 'Largest text for hero sections, marketing pages, landing page headlines. Use sparingly for maximum impact.' },
      heading: {
        xl: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.5xl}', fontWeight: '{fontWeight.bold}', lineHeight: '{lineHeight.tight}' }, $description: 'Use for page titles and primary headlines.' },
        lg: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.4xl}', fontWeight: '{fontWeight.bold}', lineHeight: '{lineHeight.tight}' }, $description: 'Use for major section headings and important content divisions.' },
        md: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.3xl}', fontWeight: '{fontWeight.semibold}', lineHeight: '{lineHeight.tight}' }, $description: 'Use for subsections within major sections.' },
        sm: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.2xl}', fontWeight: '{fontWeight.semibold}', lineHeight: '{lineHeight.snug}' }, $description: 'Use for smaller subsections, card titles.' }
      },
      body: {
        lg: {
          default: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.lg}', fontWeight: '{fontWeight.regular}', lineHeight: '{lineHeight.normal}' }, $description: 'Use for emphasized paragraphs, lead text, introductions.' },
          semibold: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.lg}', fontWeight: '{fontWeight.semibold}', lineHeight: '{lineHeight.normal}' }, $description: 'Use for emphasized inline text, strong paragraphs.' },
          bold: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.lg}', fontWeight: '{fontWeight.bold}', lineHeight: '{lineHeight.normal}' }, $description: 'Use for strong emphasis in large body text.' }
        },
        md: {
          default: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.md}', fontWeight: '{fontWeight.regular}', lineHeight: '{lineHeight.normal}' }, $description: 'Default for paragraphs, lists, main content. Optimal readability.' },
          semibold: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.md}', fontWeight: '{fontWeight.semibold}', lineHeight: '{lineHeight.normal}' }, $description: 'Use for inline emphasis, important text within body content.' },
          bold: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.md}', fontWeight: '{fontWeight.bold}', lineHeight: '{lineHeight.normal}' }, $description: 'Use for strong emphasis in standard body text.' }
        },
        sm: {
          default: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.sm}', fontWeight: '{fontWeight.regular}', lineHeight: '{lineHeight.normal}' }, $description: 'Use for secondary content, captions, metadata.' },
          semibold: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.sm}', fontWeight: '{fontWeight.semibold}', lineHeight: '{lineHeight.normal}' }, $description: 'Use for emphasized secondary content, highlighted metadata.' },
          bold: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.sm}', fontWeight: '{fontWeight.bold}', lineHeight: '{lineHeight.normal}' }, $description: 'Use for strong emphasis in small body text.' }
        },
        xs: {
          default: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.xs}', fontWeight: '{fontWeight.regular}', lineHeight: '{lineHeight.normal}' }, $description: 'Use for fine print, legal text, footnotes.' },
          semibold: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.xs}', fontWeight: '{fontWeight.semibold}', lineHeight: '{lineHeight.normal}' }, $description: 'Use for emphasized fine print, highlighted footnotes.' },
          bold: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.xs}', fontWeight: '{fontWeight.bold}', lineHeight: '{lineHeight.normal}' }, $description: 'Use for strong emphasis in extra small text.' }
        }
      },
      label: {
        lg: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.md}', fontWeight: '{fontWeight.medium}', lineHeight: '{lineHeight.normal}' }, $description: 'Large form labels, prominent tags.' },
        md: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.sm}', fontWeight: '{fontWeight.medium}', lineHeight: '{lineHeight.normal}' }, $description: 'Form labels, input labels, navigation items.' },
        sm: { $type: 'typography', $value: { fontFamily: '{fontFamily.primary}', fontSize: '{fontSize.xs}', fontWeight: '{fontWeight.medium}', lineHeight: '{lineHeight.normal}' }, $description: 'Compact labels, tags, badges.' }
      }
    },
    transition: {
      duration: {
        instant: { $type: 'duration', $value: '0ms', $description: 'Immediate state changes.' },
        fast: { $type: 'duration', $value: '100ms', $description: 'Hover states, tooltips, subtle feedback.' },
        normal: { $type: 'duration', $value: '200ms', $description: 'Default for most transitions, modals, dropdowns.' },
        slow: { $type: 'duration', $value: '300ms', $description: 'Complex animations, drawer panels.' },
        slower: { $type: 'duration', $value: '500ms', $description: 'Page transitions, complex slide animations.' }
      }
    },
    zIndex: {
      base: { $type: 'number', $value: 0, $description: 'Default stacking context.' },
      low: { $type: 'number', $value: 1000, $description: 'First level above base.' },
      medium: { $type: 'number', $value: 1100, $description: 'Second level above base.' },
      high: { $type: 'number', $value: 1200, $description: 'Third level above base.' },
      highest: { $type: 'number', $value: 1300, $description: 'Top layer in the stacking hierarchy.' }
    },
    shadow: {
      5: { $type: 'shadow', $value: { offsetX: '0px', offsetY: '1px', blur: '3px', spread: '0px', color: '{color.neutral.1100}', alpha: '{opacity.5}' }, $description: 'Minimal depth for subtle elevation.' },
      10: { $type: 'shadow', $value: { offsetX: '0px', offsetY: '4px', blur: '6px', spread: '-1px', color: '{color.neutral.1100}', alpha: '{opacity.10}' }, $description: 'Subtle depth for standard elevation.' },
      20: { $type: 'shadow', $value: { offsetX: '0px', offsetY: '10px', blur: '15px', spread: '-3px', color: '{color.neutral.1100}', alpha: '{opacity.20}' }, $description: 'Moderate depth for elevated elements.' },
      60: { $type: 'shadow', $value: { offsetX: '0px', offsetY: '20px', blur: '25px', spread: '-5px', color: '{color.neutral.1100}', alpha: '{opacity.60}' }, $description: 'Maximum depth for highest elevation.' }
    },
    iconSize: {
      xs: { $type: 'dimension', $value: '{spacing.4}', $description: 'Use for inline icons within text and compact UI elements.' },
      sm: { $type: 'dimension', $value: '{spacing.5}', $description: 'Use for navigation items and small buttons.' },
      md: { $type: 'dimension', $value: '{spacing.6}', $description: 'Default icon size for standard buttons and UI elements.' },
      lg: { $type: 'dimension', $value: '{spacing.8}', $description: 'Use for prominent actions and feature highlights.' },
      xl: { $type: 'dimension', $value: '{spacing.10}', $description: 'Use for hero sections and marketing elements.' }
    }
  };
}

