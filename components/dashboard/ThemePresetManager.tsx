'use client';

import { useEffect, useState } from 'react';
import { Save, Download, Upload, Trash2, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Preset = {
  id: string;
  theme_key: string;
  name: string;
  settings: any;
  created_at: string;
};

type Snapshot = {
  theme: string;
  bg_color: string;
  button_color: string;
  text_color: string;
  border_width: number;
  shadow_offset: number;
  avatar_size: number;
  theme_settings: Record<string, any>;
};

type Props = {
  profileId: string;
  themeKey: string;
  snapshot: Snapshot;
  onApply: (snapshot: Snapshot) => void;
};

export function ThemePresetManager({ profileId, themeKey, snapshot, onApply }: Props) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  async function load() {
    if (!profileId) return;
    const { data } = await supabase
      .from('theme_presets')
      .select('*')
      .eq('user_id', profileId)
      .eq('theme_key', themeKey)
      .order('created_at', { ascending: false });
    setPresets(data ?? []);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [profileId, themeKey]);

  async function savePreset() {
    if (!name.trim() || !profileId) return;
    setLoading(true);
    const payload = {
      user_id: profileId,
      theme_key: themeKey,
      name: name.trim().slice(0, 60),
      settings: snapshot,
    };
    const { data } = await supabase.from('theme_presets').insert(payload).select().maybeSingle();
    setLoading(false);
    setName('');
    if (data) {
      setSavedId(data.id);
      setTimeout(() => setSavedId(null), 1500);
    }
    await load();
  }

  async function deletePreset(id: string) {
    if (!confirm('Remover este preset?')) return;
    await supabase.from('theme_presets').delete().eq('id', id);
    await load();
  }

  function applyPreset(p: Preset) {
    const s = p.settings as Snapshot;
    if (!s) return;
    onApply(s);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bioflowzy-${themeKey}-preset.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJson(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed && typeof parsed === 'object') {
          onApply(parsed as Snapshot);
        }
      } catch {
        alert('Arquivo JSON inválido');
      }
    };
    reader.readAsText(f);
    e.target.value = '';
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Salvar configuração atual</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do preset"
            maxLength={60}
            className="brutal-input px-3 py-2 text-sm flex-1 min-w-0"
          />
          <button
            onClick={savePreset}
            disabled={!name.trim() || loading}
            className="brutal-btn px-3 py-2 text-xs font-bold bg-bioyellow disabled:opacity-50 inline-flex items-center gap-1"
          >
            <Save className="w-3 h-3" /> Salvar
          </button>
        </div>
      </div>

      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">Meus presets ({presets.length})</div>
        {presets.length === 0 ? (
          <p className="text-xs text-black/60">Nenhum preset salvo ainda.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {presets.map(p => (
              <div key={p.id} className={`flex items-center gap-2 brutal-border bg-white px-3 py-2 ${savedId === p.id ? 'bg-biolime' : ''}`}>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">{p.name}</div>
                  <div className="text-[10px] text-black/50">{new Date(p.created_at).toLocaleDateString()}</div>
                </div>
                <button
                  onClick={() => applyPreset(p)}
                  className="text-[10px] font-bold uppercase px-2 py-1 brutal-border bg-white hover:bg-bioyellow inline-flex items-center gap-1"
                  title="Aplicar preset"
                >
                  <Check className="w-3 h-3" /> Aplicar
                </button>
                <button
                  onClick={() => deletePreset(p.id)}
                  className="w-7 h-7 brutal-border bg-white hover:bg-biored hover:text-white flex items-center justify-center"
                  title="Remover"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t-2 border-black/10 pt-3">
        <button onClick={exportJson} className="brutal-btn px-3 py-2 text-xs font-bold bg-white inline-flex items-center gap-1">
          <Download className="w-3 h-3" /> Exportar JSON
        </button>
        <label className="brutal-btn px-3 py-2 text-xs font-bold bg-white inline-flex items-center gap-1 cursor-pointer">
          <Upload className="w-3 h-3" /> Importar JSON
          <input type="file" accept="application/json" onChange={importJson} className="hidden" />
        </label>
      </div>
    </div>
  );
}
