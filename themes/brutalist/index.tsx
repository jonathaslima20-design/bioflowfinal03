'use client';

import { ExternalLink } from 'lucide-react';
import { SOCIALS_BY_KEY } from '@/lib/socials';
import type { BioThemeProps } from '@/themes/types';
import { BioflowzyBadge } from '@/components/bio/BioflowzyBadge';

const BANNER_HEIGHT: Record<string, string> = { sm: 'aspect-[6/1]', md: 'aspect-[3/1]', lg: 'aspect-[5/2]' };

export function BrutalistTheme({ profile, links, socials, videos, banners, track }: BioThemeProps) {
  const borderStyle = { border: `${profile.border_width || 2}px solid #000` };
  const shadowStyle = { boxShadow: `${profile.shadow_offset || 4}px ${profile.shadow_offset || 4}px 0 0 #000` };
  const t = (a: string, b: string | null) => track?.(a, b);

  return (
    <div className="min-h-screen pt-[72px] pb-24 px-4" style={{ backgroundColor: profile.bg_color || '#FFFFFF' }}>
      <div className="max-w-md mx-auto">
        <div className="flex flex-col items-center text-center">
          <div
            className="shrink-0 aspect-square rounded-full brutal-border bg-bioyellow overflow-hidden brutal-shadow"
            style={{ width: profile.avatar_size ?? 90, height: profile.avatar_size ?? 90 }}
          >
            {profile.avatar_url && <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />}
          </div>
          {profile.display_name && (
            <h1 className="font-display text-3xl mt-4" style={{ color: profile.text_color }}>
              {profile.display_name}
            </h1>
          )}
          {profile.bio && <p className="mt-3 max-w-xs" style={{ color: profile.text_color }}>{profile.bio}</p>}

          {socials?.length > 0 && (
            <div className="mt-5 flex gap-2 flex-wrap justify-center">
              {socials.map((s: any) => {
                const meta = SOCIALS_BY_KEY[(s.platform || '').toLowerCase()];
                const Icon = meta?.icon;
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => t('social', s.id)}
                    className="w-10 h-10 text-white flex items-center justify-center brutal-border active:translate-x-[2px] active:translate-y-[2px] transition-transform"
                    style={{ backgroundColor: meta?.color || '#000' }}
                    aria-label={meta?.label || s.platform}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 mt-8">
          {links.map((l: any) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => t('link', l.id)}
              className="px-4 py-4 flex items-center justify-between font-bold active:translate-x-[2px] active:translate-y-[2px] transition-transform"
              style={{ ...borderStyle, ...shadowStyle, backgroundColor: profile.button_color || '#FACC15', color: profile.text_color }}
            >
              <span>{l.title}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ))}

          {banners?.map((b: any) => {
            const inner = (
              <div className={`brutal-border brutal-shadow overflow-hidden ${BANNER_HEIGHT[b.size] || BANNER_HEIGHT.md}`}>
                {b.image_url && <img src={b.image_url} alt="" className="w-full h-full object-cover" />}
              </div>
            );
            return b.link_url ? (
              <a
                key={b.id}
                href={b.link_url}
                target="_blank"
                rel="noreferrer"
                onClick={() => t('banner', b.id)}
                className="block active:translate-x-[2px] active:translate-y-[2px] transition-transform"
              >
                {inner}
              </a>
            ) : (
              <div key={b.id}>{inner}</div>
            );
          })}

          {videos.map((v: any) => (
            <div key={v.id} className="brutal-border brutal-shadow bg-white overflow-hidden">
              <div className="relative aspect-video bg-black">
                {v.embed_url ? (
                  <iframe
                    src={v.embed_url}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => t('video', v.id)}
                  />
                ) : v.thumbnail ? (
                  <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : null}
                <span className="absolute top-2 left-2 bg-biored text-white text-[10px] font-bold px-2 py-0.5 brutal-border z-10">
                  {(v.platform || 'VIDEO').toUpperCase()}
                </span>
              </div>
              {v.title && <div className="p-3 font-bold text-sm">{v.title}</div>}
            </div>
          ))}
        </div>

        {!profile.is_pro && <BioflowzyBadge bgColor={profile.bg_color} />}
        <div aria-hidden className="h-16" />
      </div>
    </div>
  );
}

export default BrutalistTheme;
