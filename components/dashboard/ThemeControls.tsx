'use client';

import { useMemo } from 'react';
import type { ControlDef } from '@/themes/types';

type Props = {
  controls: ControlDef[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset: () => void;
};

export function ThemeControls({ controls, values, onChange, onReset }: Props) {
  const groups = useMemo(() => {
    const map: Record<string, ControlDef[]> = {};
    for (const c of controls) {
      const g = c.group || 'Ajustes';
      if (!map[g]) map[g] = [];
      map[g].push(c);
    }
    return map;
  }, [controls]);

  if (controls.length === 0) {
    return <p className="text-xs text-black/60">Este tema nao possui controles avancados.</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      {Object.entries(groups).map(([group, items]) => (
        <div key={group}>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/60 mb-2">{group}</h4>
          <div className="flex flex-col gap-4">
            {items.map(c => (
              <Control key={c.key} def={c} value={values[c.key] ?? (c as any).default} onChange={(v) => onChange(c.key, v)} />
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={onReset}
        className="self-start text-xs font-bold uppercase tracking-widest underline underline-offset-4 text-black/70 hover:text-black"
      >
        Restaurar padroes do tema
      </button>
    </div>
  );
}

function Control({ def, value, onChange }: { def: ControlDef; value: any; onChange: (v: any) => void }) {
  if (def.type === 'slider') {
    return (
      <label className="block">
        <div className="flex items-center justify-between text-xs font-bold mb-1">
          <span>{def.label}</span>
          <span className="tabular-nums text-black/70">{value}{def.suffix || ''}</span>
        </div>
        <input
          type="range"
          min={def.min}
          max={def.max}
          step={def.step || 1}
          value={Number(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-black"
        />
      </label>
    );
  }

  if (def.type === 'toggle') {
    return (
      <label className="flex items-center justify-between text-sm font-bold cursor-pointer">
        <span>{def.label}</span>
        <span
          onClick={() => onChange(!value)}
          role="switch"
          aria-checked={!!value}
          className={`relative w-12 h-6 brutal-border transition-colors ${value ? 'bg-bioyellow' : 'bg-white'}`}
        >
          <span
            className={`absolute top-0 left-0 w-5 h-5 m-0.5 bg-black transition-transform ${value ? 'translate-x-6' : 'translate-x-0'}`}
          />
        </span>
      </label>
    );
  }

  if (def.type === 'select') {
    return (
      <label className="block text-xs font-bold">
        <div className="mb-1">{def.label}</div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full brutal-input py-2 text-sm bg-white"
        >
          {def.options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
    );
  }

  if (def.type === 'radio') {
    return (
      <div className="text-xs font-bold">
        <div className="mb-2">{def.label}</div>
        <div className="grid grid-cols-3 gap-2">
          {def.options.map(o => (
            <button
              key={o.value}
              onClick={() => onChange(o.value)}
              className={`brutal-btn px-2 py-2 text-xs ${value === o.value ? 'bg-bioyellow' : 'bg-white'}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (def.type === 'color') {
    const allowCustom = def.allowCustom !== false;
    const inPalette = def.palette.includes(value);
    return (
      <div className="text-xs font-bold">
        <div className="mb-2">{def.label}</div>
        <div className="flex flex-wrap gap-2 items-center">
          {def.palette.map(c => (
            <button
              key={c}
              onClick={() => onChange(c)}
              className={`w-8 h-8 brutal-border ${value === c ? 'brutal-shadow' : ''}`}
              style={{ backgroundColor: c }}
              aria-label={c}
            />
          ))}
          {allowCustom && (
            <label
              className={`relative w-8 h-8 brutal-border cursor-pointer overflow-hidden ${!inPalette ? 'brutal-shadow' : ''}`}
              style={{ backgroundColor: !inPalette ? value : undefined }}
              title="Cor personalizada"
            >
              <input
                type="color"
                value={typeof value === 'string' && value.startsWith('#') ? value.slice(0, 7) : '#000000'}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {inPalette && (
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-black"
                  style={{
                    background: 'conic-gradient(from 0deg, #f87171, #fbbf24, #34d399, #60a5fa, #f472b6, #f87171)',
                  }}
                >
                  +
                </span>
              )}
            </label>
          )}
          {allowCustom && !inPalette && (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="brutal-input px-2 py-1 text-[11px] font-mono w-24 uppercase"
              maxLength={9}
            />
          )}
        </div>
      </div>
    );
  }

  if (def.type === 'colorPicker') {
    return (
      <div className="text-xs font-bold">
        <div className="mb-2">{def.label}</div>
        <div className="flex items-center gap-2">
          <label
            className="relative w-10 h-10 brutal-border cursor-pointer overflow-hidden shrink-0"
            style={{ backgroundColor: value }}
            title="Escolher cor"
          >
            <input
              type="color"
              value={typeof value === 'string' && value.startsWith('#') ? value.slice(0, 7) : '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className="brutal-input px-2 py-2 text-xs font-mono uppercase flex-1 min-w-0"
            maxLength={9}
            placeholder="#000000"
          />
        </div>
      </div>
    );
  }

  if (def.type === 'text') {
    const max = def.maxLength ?? 80;
    const len = typeof value === 'string' ? value.length : 0;
    return (
      <label className="block text-xs font-bold">
        <div className="flex items-center justify-between mb-1">
          <span>{def.label}</span>
          <span className="text-black/50 tabular-nums">{len}/{max}</span>
        </div>
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value.slice(0, max))}
          placeholder={def.placeholder}
          maxLength={max}
          className="w-full brutal-input py-2 px-3 text-sm font-normal"
        />
      </label>
    );
  }

  if (def.type === 'textarea') {
    const max = def.maxLength ?? 400;
    const len = typeof value === 'string' ? value.length : 0;
    return (
      <label className="block text-xs font-bold">
        <div className="flex items-center justify-between mb-1">
          <span>{def.label}</span>
          <span className="text-black/50 tabular-nums">{len}/{max}</span>
        </div>
        <textarea
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value.slice(0, max))}
          placeholder={def.placeholder}
          rows={def.rows ?? 3}
          maxLength={max}
          className="w-full brutal-input py-2 px-3 text-sm font-normal resize-y font-mono"
        />
      </label>
    );
  }

  return null;
}
