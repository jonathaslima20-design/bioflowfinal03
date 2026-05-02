import type { ComponentType } from 'react';

export type BioProfile = {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  theme: string;
  theme_settings: Record<string, any>;
  bg_color: string;
  button_color: string;
  text_color: string;
  border_width: number;
  shadow_offset: number;
  avatar_size: number;
  is_pro: boolean;
};

export type BioThemeProps = {
  profile: BioProfile;
  links: any[];
  socials: any[];
  videos: any[];
  banners: any[];
  track?: (entity_type: string, entity_id: string | null) => void;
};

export type BioThemeDefaults = {
  bg_color: string;
  button_color: string;
  text_color: string;
  border_width?: number;
  shadow_offset?: number;
};

export type ControlDef =
  | { key: string; label: string; type: 'slider'; min: number; max: number; step?: number; suffix?: string; default: number; group?: string }
  | { key: string; label: string; type: 'toggle'; default: boolean; group?: string }
  | { key: string; label: string; type: 'select'; options: { value: string; label: string }[]; default: string; group?: string }
  | { key: string; label: string; type: 'color'; palette: string[]; default: string; group?: string; allowCustom?: boolean }
  | { key: string; label: string; type: 'colorPicker'; default: string; group?: string }
  | { key: string; label: string; type: 'radio'; options: { value: string; label: string }[]; default: string; group?: string }
  | { key: string; label: string; type: 'text'; default: string; placeholder?: string; maxLength?: number; group?: string }
  | { key: string; label: string; type: 'textarea'; default: string; placeholder?: string; maxLength?: number; rows?: number; group?: string };

export type BioThemeMeta = {
  key: string;
  name: string;
  description: string;
  available: boolean;
  defaults: BioThemeDefaults;
  palettes: {
    bg: string[];
    accent: string[];
    text: string[];
  };
  controls?: ControlDef[];
};

export type BioThemeDefinition = {
  meta: BioThemeMeta;
  component: ComponentType<BioThemeProps>;
};

export function getThemeSettings(profile: BioProfile | any, themeKey: string, controls: ControlDef[] = []): Record<string, any> {
  const stored = (profile?.theme_settings && typeof profile.theme_settings === 'object')
    ? (profile.theme_settings[themeKey] || {})
    : {};
  const defaults: Record<string, any> = {};
  for (const c of controls) defaults[c.key] = (c as any).default;
  return { ...defaults, ...stored };
}
