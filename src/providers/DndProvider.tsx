'use client';

import React from 'react';
import { DndProvider as ReactDndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface DndProviderProps {
  children: React.ReactNode;
}

export default function DndProvider({ children }: DndProviderProps) {
  return (
    <ReactDndProvider backend={HTML5Backend}>
      {children}
    </ReactDndProvider>
  );
}
