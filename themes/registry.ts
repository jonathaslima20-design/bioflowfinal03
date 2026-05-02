import { BrutalistTheme, brutalistMeta } from './brutalist';
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
import type { BioThemeDefaults, BioThemeDefinition } from './types';

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
