'use client';

import { motion } from 'motion/react';
import { GooContainer } from '@/components/GooContainer';

interface SimpleGooBridgeProps {
  colors: string[];
  id?: string;
}

function SimpleGooBridge({ colors, id }: SimpleGooBridgeProps) {
  return (
    <div
      key={id}
      className="md:pr-14 w-64 mx-auto  md:pl-6 snap-center"
    >
      <GooContainer
        shape="rounded"
        borderRadius="rounded-md"
        backgroundImage={`linear-gradient(90deg, ${colors.join(', ')})`}
        backgroundStyle={{
          backgroundSize: '200% 200%',
        }}
        style={{
          filter: 'invert(1)',
          scale: 1.5,

        }}
        className="mr-10"
      >
        <motion.div
          className="h-32 mx-auto rounded-full"
        />
      </GooContainer>
    </div>
  );
}

export const GooBridge = {
  Simple: SimpleGooBridge,
};
