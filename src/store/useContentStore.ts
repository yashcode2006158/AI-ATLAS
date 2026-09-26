import { useState, useEffect } from 'react';
import { RoadmapNode } from '../types/roadmap';
import { TechnologyItem, CertificationItem, RadarTrendItem, GlossaryTerm } from '../types/content';
import { ProjectItem } from '../types/user';
import { INITIAL_ROADMAP_NODES } from '../data/roadmapNodes';
import { INITIAL_TECHNOLOGIES } from '../data/technologies';
import { INITIAL_CERTIFICATIONS } from '../data/certifications';
import { INITIAL_RADAR_TRENDS } from '../data/radarTrends';
import { INITIAL_PROJECTS } from '../data/projects';
import { INITIAL_GLOSSARY } from '../data/glossary';

class ContentStore {
  private listeners: Set<() => void> = new Set();
  
  nodes: RoadmapNode[] = INITIAL_ROADMAP_NODES;
  technologies: TechnologyItem[] = INITIAL_TECHNOLOGIES;
  certifications: CertificationItem[] = INITIAL_CERTIFICATIONS;
  radarTrends: RadarTrendItem[] = INITIAL_RADAR_TRENDS;
  projects: ProjectItem[] = INITIAL_PROJECTS;
  glossary: GlossaryTerm[] = INITIAL_GLOSSARY;

  constructor() {
    try {
      const savedNodes = localStorage.getItem('nexus_content_nodes');
      if (savedNodes) this.nodes = JSON.parse(savedNodes);
      
      const savedTech = localStorage.getItem('nexus_content_tech');
      if (savedTech) this.technologies = JSON.parse(savedTech);

      const savedCerts = localStorage.getItem('nexus_content_certs');
      if (savedCerts) this.certifications = JSON.parse(savedCerts);

      const savedTrends = localStorage.getItem('nexus_content_trends');
      if (savedTrends) this.radarTrends = JSON.parse(savedTrends);

      const savedProjects = localStorage.getItem('nexus_content_projects');
      if (savedProjects) this.projects = JSON.parse(savedProjects);

      const savedGlossary = localStorage.getItem('nexus_content_glossary');
      if (savedGlossary) this.glossary = JSON.parse(savedGlossary);
    } catch (e) {
      console.warn('Failed loading CMS state', e);
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    try {
      localStorage.setItem('nexus_content_nodes', JSON.stringify(this.nodes));
      localStorage.setItem('nexus_content_tech', JSON.stringify(this.technologies));
      localStorage.setItem('nexus_content_certs', JSON.stringify(this.certifications));
      localStorage.setItem('nexus_content_trends', JSON.stringify(this.radarTrends));
      localStorage.setItem('nexus_content_projects', JSON.stringify(this.projects));
      localStorage.setItem('nexus_content_glossary', JSON.stringify(this.glossary));
    } catch {}
    this.listeners.forEach((l) => l());
  }

  // Node CRUD
  updateNode(updated: RoadmapNode) {
    const idx = this.nodes.findIndex((n) => n.id === updated.id);
    if (idx >= 0) {
      this.nodes[idx] = updated;
    } else {
      this.nodes.push(updated);
    }
    this.notify();
  }

  deleteNode(id: string) {
    this.nodes = this.nodes.filter((n) => n.id !== id);
    this.notify();
  }

  // Certification CRUD
  updateCertification(updated: CertificationItem) {
    const idx = this.certifications.findIndex((c) => c.id === updated.id);
    if (idx >= 0) {
      this.certifications[idx] = updated;
    } else {
      this.certifications.push(updated);
    }
    this.notify();
  }

  deleteCertification(id: string) {
    this.certifications = this.certifications.filter((c) => c.id !== id);
    this.notify();
  }

  // Radar Trend CRUD
  updateTrend(updated: RadarTrendItem) {
    const idx = this.radarTrends.findIndex((t) => t.id === updated.id);
    if (idx >= 0) {
      this.radarTrends[idx] = updated;
    } else {
      this.radarTrends.push(updated);
    }
    this.notify();
  }

  deleteTrend(id: string) {
    this.radarTrends = this.radarTrends.filter((t) => t.id !== id);
    this.notify();
  }

  // Reset all content back to factory defaults
  resetToDefaults() {
    this.nodes = INITIAL_ROADMAP_NODES;
    this.technologies = INITIAL_TECHNOLOGIES;
    this.certifications = INITIAL_CERTIFICATIONS;
    this.radarTrends = INITIAL_RADAR_TRENDS;
    this.projects = INITIAL_PROJECTS;
    this.glossary = INITIAL_GLOSSARY;
    this.notify();
  }
}

export const contentStore = new ContentStore();

export function useContentStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return contentStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  return {
    nodes: contentStore.nodes,
    technologies: contentStore.technologies,
    certifications: contentStore.certifications,
    radarTrends: contentStore.radarTrends,
    projects: contentStore.projects,
    glossary: contentStore.glossary,

    updateNode: (n: RoadmapNode) => contentStore.updateNode(n),
    deleteNode: (id: string) => contentStore.deleteNode(id),
    updateCertification: (c: CertificationItem) => contentStore.updateCertification(c),
    deleteCertification: (id: string) => contentStore.deleteCertification(id),
    updateTrend: (t: RadarTrendItem) => contentStore.updateTrend(t),
    deleteTrend: (id: string) => contentStore.deleteTrend(id),
    resetToDefaults: () => contentStore.resetToDefaults(),
  };
}
