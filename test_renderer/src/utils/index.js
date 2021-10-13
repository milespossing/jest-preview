/**
 * Helper to convert pixels to rem units to help make sure we stay consistent w/ wireframes that list pixels only.
 * Assumes a root font style of 16px (browser set).
 *
 * @param {int} px - Pixels to convert to rem
 */
 export const pxToRem = px => `${px * 0.0625}rem`;
