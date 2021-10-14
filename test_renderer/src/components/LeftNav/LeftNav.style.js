import { mergeStyleSets } from '@uifabric/merge-styles';
import theme, { layout } from '../../theme.style';
import { pxToRem } from '../../utils';

const selectors = {
  // General button and text setup
  '& .ms-Button--command': {
    paddingLeft: pxToRem(16),
    paddingRight: pxToRem(16),
    selectors: {
      '& .ms-Nav-linkText': {
        color: theme.palette.neutralDark,
        marginLeft: pxToRem(14),
        fontWeight: 500,
      },
    },
  },
  // Icon
  '& .ms-Icon': {
    margin: 0,
    color: theme.palette.neutralDark,
  },
  '& .ms-Icon-imageContainer': {
    width: pxToRem(24),
    height: pxToRem(24),
    position: 'relative',
    left: pxToRem(-4),
  },
  // Selected page
  '& .is-selected': {
    backgroundColor: theme.palette.neutralLight,
  },
  // Selected page text
  '& .is-selected > .ms-Button .ms-Button-flexContainer .ms-Nav-linkText': {
    color: theme.palette.themePrimary,
    fontWeight: 600,
    fontSize: `${pxToRem(14)} !important`,
  },
  // Selected page icon
  '& .is-selected > .ms-Button .ms-Button-flexContainer .ms-Icon': {
    color: theme.palette.themePrimary,
  },
  // Button on top of background
  '& .ms-Button': {
    backgroundColor: 'transparent',
  },
  // Button's left border that Fluent adds, we want it gone
  '& .ms-Button::after': {
    borderLeft: 'none',
    backgroundColor: 'transparent',
  },
  // Hover icon
  '& .ms-Nav-compositeLink:hover > .ms-Button .ms-Button-flexContainer .ms-Icon': {
    color: theme.palette.neutralDark,
  },
  // Selected page hover icon
  '& .is-selected:hover > .ms-Button .ms-Button-flexContainer .ms-Icon': {
    color: theme.palette.themePrimary,
  },
  // Disabled Button
  '& .is-disabled > .ms-Button': {
    backgroundColor: 'transparent',
  },
  // Disabled icon
  '& .is-disabled > .ms-Button .ms-Button-flexContainer .ms-Icon': {
    color: theme.palette.neutralTertiary,
  },
  // Disabled text
  '& .is-disabled > .ms-Button .ms-Button-flexContainer .ms-Nav-linkText': {
    color: theme.palette.neutralTertiary,
    fontSize: `${pxToRem(14)} !important`,
  },
  // Disabled hover icon
  '& .is-disabled:hover .ms-Button .ms-Button-flexContainer .ms-Icon': {
    color: theme.palette.neutralTertiary,
  },
  [layout.breakpoints.max.md]: {
    boxShadow: theme.effects.elevation64,
  },
  '& .ms-Nav-linkText': {
    fontWeight: 500,
    visibility: 'hidden',
    opacity: 0,
    transition: 'visibility 0s 0.3s, opacity 0.3s linear',
  },
  '& .ms-Nav-groupContent': {
    marginBottom: `${pxToRem(150)} !important`,
  },
};

export default mergeStyleSets({
  wrapper: {
    width: pxToRem(layout.constants.leftNav.collapsedWidth),
    flexShrink: '0 !important',
    height: '100%',
    transition: '0.5s',
  },
  wrapperExpanded: {
    width: pxToRem(layout.constants.leftNav.width),
  },
  nav: {
    width: pxToRem(layout.constants.leftNav.collapsedWidth),
    height: '100%',
    backgroundColor: theme.palette.neutralWhite,
    borderRight: '1px solid #eee',
    overflowY: 'auto',
    zIndex: 10,
    position: 'fixed',
    top: pxToRem(layout.constants.topNav.height + layout.constants.commandBar.height),
    left: 0,
    transition: '0.5s',
    selectors,
  },
  expanded: {
    width: pxToRem(layout.constants.leftNav.width),
    selectors: {
      '& .ms-Nav-linkText': {
        visibility: 'visible',
        opacity: 100,
        transition: 'visibility 0.3s 0s, opacity 0.3s linear',
      },
    },
  },
  hidden: {
    visibility: 'hidden',
    width: 0,
  },
  external: {
    fontSize: pxToRem(16),
    color: theme.palette.themePrimary,
  },
  failure: {
    color: theme.palette.accentError,
  },
  success: {
    color: theme.palette.green,
  }
});
