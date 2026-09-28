import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from './AppShell';

export const AppLayout: React.FC = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};
