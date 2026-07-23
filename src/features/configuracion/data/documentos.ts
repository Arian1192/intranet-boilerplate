export interface TypographySettings {
  textSize: number;
  lineHeight: number;
  paragraphGap: number;
  h1Scale: number;
  h2Scale: number;
  h3Scale: number;
  headingLineHeight: number;
}

export const FACTORY_DEFAULTS: TypographySettings = {
  textSize: 16,
  lineHeight: 1.45,
  paragraphGap: 4,
  h1Scale: 1.9,
  h2Scale: 1.5,
  h3Scale: 1.15,
  headingLineHeight: 1.2,
};
