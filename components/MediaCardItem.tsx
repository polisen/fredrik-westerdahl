'use client';

import { useState } from 'react';
import { CardItem } from '@/components/CardLine';

type MediaCardItemProps = (
  | { type: 'image'; src: string; alt: string }
  | { type: 'video'; src: string; loop?: boolean; muted?: boolean; playsInline?: boolean; autoPlay?: boolean }
);

export function MediaCardItem(props: MediaCardItemProps) {
  const [aspectRatio, setAspectRatio] = useState(1);

  return (
    <CardItem aspectRatio={aspectRatio} noBackground className='max-w-full'>
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
        {props.type === 'image' ? (
          <img
            src={props.src}
            alt={props.alt}
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
            src={props.src}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            loop={props.loop}
            muted={props.muted}
            playsInline={props.playsInline}
            autoPlay={props.autoPlay}
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
