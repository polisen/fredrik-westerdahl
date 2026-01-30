import { CardItem, CardLine } from '@/components/CardLine';
import { MediaCardItem } from '@/components/MediaCardItem';
import { getCardLineColor } from '@/lib/cardLineColors';
import { StyleCard } from '@/components/StyleCard';

const ITALIA_IMAGES = [
  'IMG_3681.webp',
  'IMG_3684.webp',
  'IMG_3685.webp',
  'IMG_3693.webp',
  'IMG_3698.webp',
  'IMG_3767.webp',
  'IMG_3787.webp',
  'IMG_3800.webp',
  'IMG_3827.webp',
  'IMG_3839.webp',
];

export function ItaliaCardLine() {
  return (
    <CardLine backgroundColor={getCardLineColor(0)}>
      <CardItem aspectRatio="square">
        <div className="p-4">
          <StyleCard.IntroHeading>my recent trip to naples, italy</StyleCard.IntroHeading>
        </div>
      </CardItem>
      {ITALIA_IMAGES.map((filename) => (
        <MediaCardItem
          key={filename}
          type="image"
          src={`/italia/${filename}`}
          alt="Fredrik"
        />
      ))}
    </CardLine>
  );
}
