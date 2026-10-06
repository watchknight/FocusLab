import React from 'react';
import { Panel, PanelProps } from './Panel';

export type CardProps = PanelProps;

export const Card: React.FC<CardProps> = (props) => {
  return <Panel {...props} />;
};

export default Card;
