import { loadTheme } from '@uifabric/styling';
import { pxToRem } from './utils';

const palette = {
  themePrimary: '#781042',
  themeLighterAlt: '#faf1f5',
  themeLighter: '#e9c9d9',
  themeLight: '#d69eba',
  themeTertiary: '#ae537f',
  themeSecondary: '#882052',
  themeDarkerAlt: '#6c0e3b',
  themeDark: '#5b0c32',
  themeDarker: '#430925',
  neutralLighterAlt: '#FAF9F8',
  neutralLighter: '#F3F2F1',
  neutralLight: '#EDEBE9',
  neutralQuaternaryAlt: '#E1DFDD',
  neutralQuaternary: '#D2D0CE',
  neutralTertiaryAlt: '#C8C6C4',
  neutralTertiary: '#A19F9D',
  neutralSecondary: '#605E5C',
  neutralPrimaryAlt: '#3B3A39',
  neutralPrimary: '#323130',
  neutralDark: '#201F1E',
  neutralWhite: '#FFFFFF',
  black: '#3a3836',
  white: '#faf9f8',
  blue: '#0e188a',
  accentTeal: '#004B50',
  accentTealOpaque: 'rgba(0,75,80,0.1)',
  accentYellow: '#BA8202',
  accentPurple: '#32145A',
  accentError: '#C50F1F',
  accentErrorOpaque: 'rgba(197,15,31,0.1)',
  accentMessage: '#830000',
  accentErrorHover: '#A80000',
  velvet: '#781042',
};

const theme = loadTheme({
  palette,
  defaultFontStyle: {
    fontSize: pxToRem(16),
    lineHeight: pxToRem(22),
  },
  fonts: {
    small: {
      fontSize: pxToRem(12),
      lineHeight: pxToRem(16),
      color: palette.neutralSecondary,
    },
    medium: {
      fontSize: pxToRem(14),
      lineHeight: pxToRem(20),
      fontWeight: 600,
    },
    large: {
      fontSize: pxToRem(16),
      lineHeight: pxToRem(22),
      fontWeight: 600,
    },
    xLarge: {
      fontSize: pxToRem(22),
      lineHeight: pxToRem(30),
      fontWeight: 600,
    },
  },
});

export default theme;

export const breakpoints = {
  sm: 320,
  md: 480,
  lg: 640,
  xl: 1024,
  xxl: 1366,
  xxxl: 1920,
};

export const layout = {
  breakpoints: {
    max: {
      sm: `@media (max-width: ${pxToRem(breakpoints.sm)})`,
      md: `@media (max-width: ${pxToRem(breakpoints.md)})`,
      lg: `@media (max-width: ${pxToRem(breakpoints.lg)})`,
      xl: `@media (max-width: ${pxToRem(breakpoints.xl)})`,
      xxl: `@media (max-width: ${pxToRem(breakpoints.xxl)})`,
    },
    min: {
      sm: `@media (min-width: ${pxToRem(breakpoints.sm)})`,
      md: `@media (min-width: ${pxToRem(breakpoints.md)})`,
      lg: `@media (min-width: ${pxToRem(breakpoints.lg)})`,
      xl: `@media (min-width: ${pxToRem(breakpoints.xl)})`,
      xxl: `@media (min-width: ${pxToRem(breakpoints.xxl)})`,
    },
    constants: breakpoints,
  },
  constants: {
    topNav: {
      height: 48,
    },
    commandBar: {
      height: 45,
    },
    leftNav: {
      width: 228,
      collapsedWidth: 48,
    },
  },
};
