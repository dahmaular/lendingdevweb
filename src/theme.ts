import { createTheme } from '@mui/material/styles';

/**
 * devpay design tokens — the "Ledger" skin.
 *
 * Everything here derives from the two colours in the logo: the forest green of
 * the plate (#0B2621) and the gold of the V (#E6BE58). Green is the ink and the
 * structure; gold is reserved for progress and the single primary action, so a
 * screen never offers more than one gold thing to press.
 *
 * ---------------------------------------------------------------------------
 * NOTE ON THE SHAPE OF `colors` — this is transitional.
 *
 * The screens grew two incompatible ways of reading tokens: a numeric scale
 * (`colors.primary[500]`, used by apply / uploadOfferLetter / StatementReview)
 * and a semantic one (`colors.primary.main`, used by loanApplication /
 * personalDetails / ConfirmationPage / monoComplete, each of which used to
 * carry its own private copy of the palette).
 *
 * Rather than rewrite several hundred call sites in the same change that swaps
 * the palette, `colors` deliberately answers to BOTH shapes so the four private
 * copies could be deleted outright. Once the re-skin has settled, the numeric
 * scale should be retired in favour of the semantic keys and this file should
 * lose the duplication.
 * ---------------------------------------------------------------------------
 */

/** The raw palette. Prefer the semantic exports below over reaching in here. */
export const brand = {
  paper: '#F6F2E8',     // the page ground
  sheet: '#FFFDF8',     // the card the form sits on
  rule: '#DFD5C0',      // borders and dividers
  ruleSoft: '#EBE3D2',  // the quieter divider, inside a sheet
  ink: '#0B2621',       // the logo plate — text, structure, primary action
  ink2: '#2F5248',      // secondary ink
  muted: '#6E8279',     // supporting copy
  faint: '#9E937E',     // placeholders, disabled, eyebrows
  gold: '#E6BE58',      // the logo V — progress and the one primary accent
  goldDeep: '#B98B22',  // gold that has to carry text on paper
  goldWash: '#F2E6C6',  // opaque gold tint, for focus rings and soft fills
};

export const colors = {
  primary: {
    // semantic
    main: brand.ink,
    light: brand.ink2,
    dark: '#061512',
    // The Ledger has no gradients — this stays a flat fill so the many existing
    // `background: colors.primary.gradient` call sites resolve to solid ink.
    gradient: brand.ink,
    // scale: light end is the paper/gold family (washes, rings, borders),
    // dark end is the ink itself
    50: '#FBF7EC',
    100: brand.goldWash,
    200: '#E6D6AE',
    300: '#CBBE9E',
    400: brand.faint,
    500: brand.ink,
    600: '#081F1B',
    700: '#061815',
    800: '#04120F',
    900: '#020B09',
  },
  secondary: {
    main: brand.goldDeep,
    light: brand.gold,
    dark: '#8A6716',
    50: '#FDF8EC',
    100: brand.goldWash,
    200: '#EBD9A6',
    300: '#E3C87E',
    400: '#E6BE58',
    500: brand.gold,
    600: brand.goldDeep,
    700: '#8A6716',
    800: '#5E4610',
    900: '#3A2B0A',
  },
  accent: {
    orange: '#A9691C',
    green: '#2C7A5A',
    purple: brand.ink2,
  },
  background: {
    main: brand.paper,
    card: brand.sheet,
    elevated: brand.sheet,
  },
  text: {
    primary: brand.ink,
    secondary: brand.muted,
    muted: brand.faint,
  },
  border: {
    light: brand.rule,
    focus: brand.ink,
  },
  status: {
    success: '#2C7A5A',
    successLight: '#E7F0E9',
    error: '#B3402F',
    warning: '#A9691C',
  },
  neutral: {
    50: brand.sheet,
    100: brand.paper,
    200: brand.ruleSoft,
    300: brand.rule,
    400: brand.faint,
    500: brand.muted,
    600: '#56685F',
    700: brand.ink2,
    800: brand.ink,
    900: '#061512',
  },
  // top-level status aliases, used by the numeric-scale screens
  success: '#2C7A5A',
  warning: '#A9691C',
  error: '#B3402F',
  info: brand.ink2,
};

/**
 * Hard offsets, not blur. The Ledger reads as a printed sheet — a card is
 * something laid on paper, not something floating above it.
 */
export const shadows = {
  sm: '0 1px 0 rgba(11, 38, 33, 0.06)',
  md: '3px 3px 0 rgba(11, 38, 33, 0.12)',
  lg: '5px 5px 0 rgba(11, 38, 33, 0.14)',
  xl: `6px 6px 0 ${brand.ink}`,
  card: '4px 4px 0 rgba(11, 38, 33, 0.10)',
  glow: '0 0 0 4px rgba(230, 190, 88, 0.35)',
  successGlow: '0 0 0 4px rgba(44, 122, 90, 0.22)',
};

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
};

export const type = {
  display: '"Bricolage Grotesque", "Helvetica Neue", Arial, sans-serif',
  body: '"Public Sans", "Helvetica Neue", Arial, sans-serif',
  size: {
    eyebrow: 12,
    caption: 13,
    label: 14,
    body: 16,
    lead: 18,
    h3: 20,
    h2: 26,
    h1: 36,
    figure: 60,
  },
};

/** Control metrics, so fields and buttons stay on one rhythm across screens. */
export const controls = {
  fieldHeight: 58,
  buttonHeight: 60,
  minTapTarget: 44,
  radius: radii.md,
  /** The gold bar under a primary button. */
  primaryUnderline: 4,
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
    },
    error: { main: colors.error },
    warning: { main: colors.warning },
    success: { main: colors.success },
    info: { main: colors.info },
    background: {
      default: colors.background.main,
      paper: colors.background.card,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    divider: colors.border.light,
  },
  typography: {
    fontFamily: type.body,
    h1: { fontFamily: type.display, fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.025em' },
    h2: { fontFamily: type.display, fontSize: '1.625rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontFamily: type.display, fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.015em' },
    h4: { fontFamily: type.display, fontSize: '1.0625rem', fontWeight: 600 },
    button: { fontFamily: type.display, textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: radii.md },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: radii.md,
          padding: '12px 24px',
          fontWeight: 600,
        },
        containedPrimary: {
          borderBottom: `${controls.primaryUnderline}px solid ${brand.gold}`,
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
  },
});

export default theme;
