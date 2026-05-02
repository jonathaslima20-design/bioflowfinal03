'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BioPreview } from '@/components/dashboard/BioPreview';
import { THEMES, getTheme } from '@/themes/registry';
import { ThemeMockup } from '@/components/themes/ThemeMockup';
import { ThemeControls } from '@/components/dashboard/ThemeControls';
import { Check } from 'lucide-react';

export default function CustomizePage() {
  const [profileId, setProfileId] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [socials, setSocials] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setProfileId(u.user.id);
      const { data: p } = await supabase.from('profiles').select('*').eq('id', u.user.id).maybeSingle();
      setProfile(p);
      const [{ data: ls }, { data: ss }, { data: vs }, { data: bs }] = await Promise.all([
        supabase.from('links').select('*').eq('profile_id', u.user.id).order('position'),
        supabase.from('social_links').select('*').eq('profile_id', u.user.id).order('position'),
        supabase.from('videos').select('*').eq('profile_id', u.user.id).order('position'),
        supabase.from('banners').select('*').eq('profile_id', u.user.id).order('position'),
      ]);
      setLinks(ls ?? []);
      setSocials(ss ?? []);
      setVideos(vs ?? []);
      setBanners(bs ?? []);
    })();
  }, []);

  async function update(patch: any) {
    const next = { ...profile, ...patch };
    setProfile(next);
    await supabase.from('profiles').update(patch).eq('id', profileId);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function updateThemeSetting(themeKey: string, key: string, value: any) {
    const current = (profile?.theme_settings && typeof profile.theme_settings === 'object') ? profile.theme_settings : {};
    const nextSettings = { ...current, [themeKey]: { ...(current[themeKey] || {}), [key]: value } };
    const next = { ...profile, theme_settings: nextSettings };
    setProfile(next);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await supabase.from('profiles').update({ theme_settings: nextSettings }).eq('id', profileId);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 300);
  }

  async function resetThemeSettings(themeKey: string) {
    const current = (profile?.theme_settings && typeof profile.theme_settings === 'object') ? profile.theme_settings : {};
    const nextSettings = { ...current };
    delete nextSettings[themeKey];
    const next = { ...profile, theme_settings: nextSettings };
    setProfile(next);
    await supabase.from('profiles').update({ theme_settings: nextSettings }).eq('id', profileId);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  async function applyTheme(themeKey: string) {
    const defaults = getTheme(themeKey).meta.defaults;
    await update({
      theme: themeKey,
      bg_color: defaults.bg_color,
      button_color: defaults.button_color,
      text_color: defaults.text_color,
      ...(defaults.border_width !== undefined ? { border_width: defaults.border_width } : {}),
      ...(defaults.shadow_offset !== undefined ? { shadow_offset: defaults.shadow_offset } : {}),
    });
  }

  if (!profile) return <div>Carregando...</div>;

  const activeKey = profile.theme || 'brutalist';
  const activeTheme = getTheme(activeKey);
  const activePalettes = activeTheme.meta.palettes;
  const themeControls = activeTheme.meta.controls || [];
  const themeValues = (profile.theme_settings && typeof profile.theme_settings === 'object')
    ? (profile.theme_settings[activeKey] || {})
    : {};

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8">
      <div>
        <h1 className="font-display text-4xl mb-6">Aparencia</h1>

        <Section title="Tema">
          <p className="text-xs font-bold text-black/60 mb-3">
            Cada tema tem um layout e personalidade unicos. Suas cores continuam aplicadas.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.values(THEMES).map(({ meta }) => {
              const active = activeKey === meta.key;
              return (
                <button
                  key={meta.key}
                  onClick={() => applyTheme(meta.key)}
                  className={`group brutal-border text-left transition-all overflow-hidden bg-white ${active ? 'brutal-shadow -translate-y-0.5' : 'hover:-translate-y-0.5 hover:brutal-shadow'}`}
                >
                  <div className="relative bg-[#F7F7F5] border-b-[3px] border-black flex items-center justify-center py-6">
                    <ThemeMockup themeKey={meta.key} />
                    {active && (
                      <span className="absolute top-2 right-2 text-[10px] font-bold uppercase bg-black text-white px-2 py-1 brutal-border flex items-center gap-1 z-10">
                        <Check className="w-3 h-3" /> Ativo
                      </span>
                    )}
                  </div>
                  <div className={`p-3 ${active ? 'bg-bioyellow' : 'bg-white'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg">{meta.name}</span>
                    </div>
                    <p className="text-xs mt-1 text-black/70 line-clamp-2">{meta.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="Fundo">
          <Swatches palette={activePalettes.bg} value={profile.bg_color} onChange={(c) => update({ bg_color: c })} />
        </Section>

        <Section title="Cor do botao / destaque">
          <Swatches palette={activePalettes.accent} value={profile.button_color} onChange={(c) => update({ button_color: c })} />
        </Section>

        <Section title="Cor do texto">
          <Swatches palette={activePalettes.text} value={profile.text_color} onChange={(c) => update({ text_color: c })} />
        </Section>

        {activeKey === 'brutalist' && (
          <>
            <Section title="Espessura da borda">
              <div className="flex gap-3">
                {[2, 3, 4, 5].map(w => (
                  <button key={w} onClick={() => update({ border_width: w })} className={`brutal-btn px-4 py-2 ${profile.border_width === w ? 'bg-bioyellow' : 'bg-white'}`}>{w}px</button>
                ))}
              </div>
            </Section>
            <Section title="Intensidade da sombra">
              <div className="flex gap-3">
                {[0, 2, 4, 6, 8].map(w => (
                  <button key={w} onClick={() => update({ shadow_offset: w })} className={`brutal-btn px-4 py-2 ${profile.shadow_offset === w ? 'bg-bioyellow' : 'bg-white'}`}>{w}px</button>
                ))}
              </div>
            </Section>
          </>
        )}

        <Section title="Tamanho do avatar">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={60}
              max={200}
              step={2}
              value={profile.avatar_size ?? 90}
              onChange={(e) => update({ avatar_size: Number(e.target.value) })}
              className="flex-1 accent-black"
            />
            <span className="font-bold text-sm w-14 text-right">{profile.avatar_size ?? 90}px</span>
          </div>
        </Section>

        {themeControls.length > 0 && (
          <Section title={`Ajustes de ${activeTheme.meta.name}`}>
            <ThemeControls
              controls={themeControls}
              values={themeValues}
              onChange={(k, v) => updateThemeSetting(activeKey, k, v)}
              onReset={() => resetThemeSettings(activeKey)}
            />
          </Section>
        )}

        {saved && <div className="mt-4 inline-block brutal-card px-4 py-2 bg-biolime font-bold">Salvo!</div>}
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-6">
          <h2 className="font-display text-lg mb-4">Preview</h2>
          <BioPreview
            profileId={profileId}
            profile={profile}
            links={links}
            socials={socials}
            videos={videos}
            banners={banners}
          />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="brutal-card p-5 mb-5">
      <h3 className="font-display text-lg mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Swatches({ palette, value, onChange }: { palette: string[]; value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {palette.map(c => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`w-10 h-10 brutal-border ${value === c ? 'brutal-shadow' : ''}`}
          style={{ backgroundColor: c }}
          aria-label={c}
        />
      ))}
    </div>
  );
}
