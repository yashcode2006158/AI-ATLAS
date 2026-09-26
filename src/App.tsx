import React, { useEffect } from 'react';
import { useAppStore } from './store/useStore';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/command/CommandPalette';
import { AIMentorDrawer } from './components/mentor/AIMentorDrawer';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

// Views
import { HomeView } from './views/HomeView';
import { SimulationsView } from './views/SimulationsView';
import { NodeGraphCanvas } from './components/roadmap/NodeGraphCanvas';
import { TrainingOS } from './components/dashboard/TrainingOS';
import { EnterpriseLab } from './components/enterprise/EnterpriseLab';
import { ProjectLab } from './components/projects/ProjectLab';
import { CareerNavigator } from './components/career/CareerNavigator';
import { CertRoadmap } from './components/certifications/CertRoadmap';
import { AIRadarView } from './components/radar/AIRadarView';
import { GlossaryView } from './components/glossary/GlossaryView';
import { ScenarioMissions } from './components/missions/ScenarioMissions';
import { TechStackExplorer } from './components/tech/TechStackExplorer';
import { CMSAdminPortal } from './components/admin/CMSAdminPortal';

import './index.css';

const App: React.FC = () => {
  const { view, theme } = useAppStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const renderView = () => {
    switch (view) {
      case 'home':
        return <HomeView />;
      case 'roadmap':
        return <NodeGraphCanvas />;
      case 'simulations':
        return <SimulationsView />;
      case 'dashboard':
        return <TrainingOS />;
      case 'enterprise':
        return <EnterpriseLab />;
      case 'projects':
        return <ProjectLab />;
      case 'careers':
        return <CareerNavigator />;
      case 'certifications':
        return <CertRoadmap />;
      case 'radar':
        return <AIRadarView />;
      case 'glossary':
        return <GlossaryView />;
      case 'missions':
        return <ScenarioMissions />;
      case 'tech':
        return <TechStackExplorer />;
      case 'admin':
        return <CMSAdminPortal />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-base text-text-primary flex flex-col selection:bg-accent/20 selection:text-accent transition-colors duration-standard">
      {/* Sticky Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {renderView()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <CommandPalette />
      <AIMentorDrawer />
      <OnboardingModal />
    </div>
  );
};

export default App;