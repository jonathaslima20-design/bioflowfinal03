import { BrutalistTheme } from './brutalist';
import { AuroraTheme, auroraMeta } from './aurora';
import { CyberTheme, cyberMeta } from './cyber';
import { RetrowaveTheme, retrowaveMeta } from './retrowave';
import { AtlasTheme, atlasMeta } from './atlas';
import { ConversionTheme, conversionMeta } from './conversion';
import { CreatorTheme, creatorMeta } from './creator';
import { AgencyTheme, agencyMeta } from './agency';
import { PrismTheme, prismMeta } from './prism';
import { NeonLabTheme, neonlabMeta } from './neonlab';
import { ChromeTheme, chromeMeta } from './chrome';
import { TerminalTheme, terminalMeta } from './terminal';
import { ConsultancyTheme, consultancyMeta } from './consultancy';
import { KeynoteTheme, keynoteMeta } from './keynote';
import type { BioThemeDefaults, BioThemeDefinition, BioThemeMeta } from './types';

const brutalistMeta: BioThemeMeta = {
  key: 'brutalist',
  name: 'Brutalist',
  description: 'Bordas pretas, sombras duras e cores vibrantes. O visual assinatura do BioFlowzy.',
  available: true,
  defaults: {
    bg_color: '#FFFFFF',
    button_color: '#FACC15',
    text_color: '#000000',
    border_width: 2,
    shadow_offset: 4,
  },
  palettes: {
    bg: ['#FFFFFF', '#F1F5F9', '#FACC15', '#BEF264', '#FDA4AF', '#000000'],
    accent: ['#FACC15', '#BEF264', '#2563EB', '#EF4444', '#F97316', '#000000', '#FFFFFF'],
    text: ['#000000', '#111827', '#FFFFFF', '#1E293B'],
  },
};

export const THEMES: Record<string, BioThemeDefinition> = {
  brutalist: { meta: brutalistMeta, component: BrutalistTheme },
  aurora: { meta: auroraMeta, component: AuroraTheme },
  atlas: { meta: atlasMeta, component: AtlasTheme },
  conversion: { meta: conversionMeta, component: ConversionTheme },
  terminal: { meta: terminalMeta, component: TerminalTheme },
  chrome: { meta: chromeMeta, component: ChromeTheme },
  prism: { meta: prismMeta, component: PrismTheme },
  cyber: { meta: cyberMeta, component: CyberTheme },
  retrowave: { meta: retrowaveMeta, component: RetrowaveTheme },
  neonlab: { meta: neonlabMeta, component: NeonLabTheme },
  creator: { meta: creatorMeta, component: CreatorTheme },
  agency: { meta: agencyMeta, component: AgencyTheme },
  consultancy: { meta: consultancyMeta, component: ConsultancyTheme },
  keynote: { meta: keynoteMeta, component: KeynoteTheme },
};

export function getTheme(key: string | undefined | null): BioThemeDefinition {
  if (key && THEMES[key]) return THEMES[key];
  return THEMES.brutalist;
}

export function getThemeDefaults(key: string | undefined | null): BioThemeDefaults {
  return getTheme(key).meta.defaults;
}
