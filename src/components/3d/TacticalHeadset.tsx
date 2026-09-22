import React from 'react';
import { Headband } from './Headband';
import { EarCup } from './EarCup';

export const TacticalHeadset: React.FC = () => {
  return (
    <group name="TacticalHeadset">
      {/* Padded Spring-Steel Headband */}
      <Headband />

      {/* Left Earcup Assembly (Houses External Ref Mic, Internal Error Mic, Boom Mic, Speaker, PCB) */}
      <EarCup side="left" />

      {/* Right Earcup Assembly */}
      <EarCup side="right" />
    </group>
  );
};
