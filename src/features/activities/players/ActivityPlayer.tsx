'use client';

import React from 'react';
import { Activity } from '@/content/types';
import { BreathPacer } from './BreathPacer';
import { BreathCounter } from './BreathCounter';
import { NatureBreak } from './NatureBreak';
import { MovementSnack } from './MovementSnack';
import { QuietRest } from './QuietRest';

interface ActivityPlayerProps {
  activity: Activity;
  durationSec: number;
  onClose: () => void;
}

export const ActivityPlayer: React.FC<ActivityPlayerProps> = ({
  activity,
  durationSec,
  onClose,
}) => {
  if (activity.id === 'cyclic-sighing' || activity.id === 'box-breathing') {
    return <BreathPacer activity={activity} durationSec={durationSec} onClose={onClose} />;
  }

  if (activity.id === 'breath-counting') {
    return <BreathCounter activity={activity} durationSec={durationSec} onClose={onClose} />;
  }

  if (activity.id === 'nature-microbreak') {
    return <NatureBreak activity={activity} durationSec={durationSec} onClose={onClose} />;
  }

  if (activity.id === 'movement-snack') {
    return <MovementSnack activity={activity} durationSec={durationSec} onClose={onClose} />;
  }

  return <QuietRest activity={activity} durationSec={durationSec} onClose={onClose} />;
};
