'use client';

import { useState } from 'react';
import { CardItem } from '@/components/CardLine';

type MediaCardItemProps = (
  | { type: 'image'; src: string; alt: string }
  | { type: 'video'; src: string; loop?: boolean; muted?: boolean; playsInline?: boolean; autoPlay?: boolean }
) & {
  borderRadius?: string;
};

export function MediaCardItem(props: MediaCardItemProps) {
  const [aspectRatio, setAspectRatio] = useState(1);
  const { borderRadius, ...media } = props;

  return (
    <CardItem
      aspectRatio={aspectRatio}
      noBackground
      className="max-w-full"
      borderRadius={borderRadius}
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-[inherit]">
        {media.type === 'image' ? (
          <img
            src={media.src}
            alt={media.alt}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            onLoad={(e) => {
              const el = e.currentTarget;
              if (el.naturalWidth && el.naturalHeight) {
                setAspectRatio(el.naturalWidth / el.naturalHeight);
              }
            }}
          />
        ) : (
          <video
            src={media.src}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            loop={media.loop}
            muted={media.muted}
            playsInline={media.playsInline}
            autoPlay={media.autoPlay}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              if (v.videoWidth && v.videoHeight) {
                setAspectRatio(v.videoWidth / v.videoHeight);
              }
            }}
          />
        )}
      </div>
    </CardItem>
  );
}
