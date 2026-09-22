import React from 'react';
import { useAppStore } from './store/useAppStore';
import { HeaderBar } from './components/layout/HeaderBar';
import { SidebarNav } from './components/layout/SidebarNav';
import { OverviewView } from './components/views/OverviewView';
import { LiveView } from './components/views/LiveView';
import { Hardware3DView } from './components/views/Hardware3DView';
import { RecordingsView } from './components/views/RecordingsView';
import { AnalysisView } from './components/views/AnalysisView';
import { StreamingView } from './components/views/StreamingView';
import { DevicesView } from './components/views/DevicesView';
import { SystemView } from './components/views/SystemView';

export const App: React.FC = () => {
  const store = useAppStore();

  return (
    <div className="w-screen h-screen flex flex-col bg-[#06080d] text-slate-200 overflow-hidden font-sans">
      {/* Top Professional Audio Engineering Header Bar */}
      <HeaderBar store={store} />

      {/* Main Studio Body: Fixed Left Navigation Rail + Active Workstation View */}
      <div className="flex-1 flex overflow-hidden">
        <SidebarNav store={store} />

        <main className="flex-1 overflow-hidden relative bg-[#080b11]">
          {store.activeView === 'overview' && <OverviewView store={store} />}
          {store.activeView === 'live' && <LiveView store={store} />}
          {store.activeView === 'hardware3d' && <Hardware3DView />}
          {store.activeView === 'recordings' && <RecordingsView store={store} />}
          {store.activeView === 'analysis' && <AnalysisView store={store} />}
          {store.activeView === 'streaming' && <StreamingView store={store} />}
          {store.activeView === 'devices' && <DevicesView store={store} />}
          {store.activeView === 'system' && <SystemView store={store} />}
        </main>
      </div>
    </div>
  );
};

export default App;
