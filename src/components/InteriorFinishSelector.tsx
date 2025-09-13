import React from 'react';
import { Card } from './ui/card';

interface InteriorFinishSelectorProps {
  // Add props as needed
}

export function InteriorFinishSelector(props: InteriorFinishSelectorProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">Interior Finish Selector</h3>
      <p className="text-gray-600">Interior finish selection coming soon...</p>
    </Card>
  );
}
