import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Compass,
  Sliders,
  Award,
  Radar,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useContentStore } from '../../store/useContentStore';
import { RoadmapNode } from '../../types/roadmap';
import { TechnologyItem, CertificationItem, RadarTrendItem } from '../../types/content';

export const CMSAdminPortal: React.FC = () => {
  const {
    nodes,
    technologies,
    certifications,
    radarTrends,
    updateNode,
    deleteNode,
    updateCertification,
    deleteCertification,
    updateTrend,
    deleteTrend,
    resetToDefaults,
  } = useContentStore();

  const [activeTab, setActiveTab] = useState<'nodes' | 'certs' | 'trends'>('nodes');
  const [editingNode, setEditingNode] = useState<RoadmapNode | null>(null);
  const [editingCert, setEditingCert] = useState<CertificationItem | null>(null);
  const [editingTrend, setEditingTrend] = useState<RadarTrendItem | null>(null);
  const [saveBanner, setSaveBanner] = useState(false);

  const triggerSaveNotification = () => {
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2500);
  };

  const handleSaveNode = () => {
    if (editingNode) {
      updateNode(editingNode);
      setEditingNode(null);
      triggerSaveNotification();
    }
  };

  const handleSaveCert = () => {
    if (editingCert) {
      updateCertification(editingCert);
      setEditingCert(null);
      triggerSaveNotification();
    }
  };

  const handleSaveTrend = () => {
    if (editingTrend) {
      updateTrend(editingTrend);
      setEditingTrend(null);
      triggerSaveNotification();
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Top Admin Header */}
      <div className="p-5 rounded-2xl bg-surface border border-hairline flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-danger/10 border border-danger/20 text-danger font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              Nexus Content Management System (CMS)
            </span>
            <span className="text-[10px] font-mono text-text-secondary">
              Direct Real-Time Schema Mutation
            </span>
          </div>
          <h2 className="text-base font-bold font-display text-text-primary">
            Headless Content & Entity Administration
          </h2>
          <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
            Update roadmap nodes, industry certifications, radar trends, and architectural blueprints in real time without redeploying frontend assets.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset all CMS entities back to default seed data?')) {
              resetToDefaults();
              triggerSaveNotification();
            }
          }}
          className="px-3.5 py-2 rounded-xl bg-elevated border border-hairline text-text-secondary hover:text-danger hover:border-danger/30 transition-colors flex items-center gap-1.5 font-mono text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All to Defaults</span>
        </button>
      </div>

      {saveBanner && (
        <div className="p-3 rounded-xl bg-success/15 border border-success/30 text-success font-semibold flex items-center gap-2 animate-in fade-in duration-100">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span>CMS changes persisted to local store and synchronized globally across all active views.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-hairline pb-1">
        <button
          onClick={() => setActiveTab('nodes')}
          className={`py-2 px-4 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'nodes' ? 'bg-accent text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Roadmap Nodes ({nodes.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('certs')}
          className={`py-2 px-4 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'certs' ? 'bg-accent text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Certifications ({certifications.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`py-2 px-4 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'trends' ? 'bg-accent text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Radar className="w-3.5 h-3.5" />
          <span>Radar Trends ({radarTrends.length})</span>
        </button>
      </div>

      {/* TAB 1: ROADMAP NODES ADMIN */}
      {activeTab === 'nodes' && (
        <div className="space-y-4">
          <div className="border border-hairline rounded-xl overflow-hidden bg-surface">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-elevated text-text-secondary border-b border-hairline">
                <tr>
                  <th className="p-3">Node ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Layer</th>
                  <th className="p-3">Difficulty</th>
                  <th className="p-3">Hours</th>
                  <th className="p-3">XP</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {nodes.map((node) => (
                  <tr key={node.id} className="hover:bg-elevated/40 transition-colors">
                    <td className="p-3 font-semibold text-accent">{node.id}</td>
                    <td className="p-3 text-text-primary font-sans font-medium">{node.title}</td>
                    <td className="p-3 text-text-secondary uppercase text-[10px]">{node.layerId}</td>
                    <td className="p-3">{node.difficulty}</td>
                    <td className="p-3">{node.estimatedHours}h</td>
                    <td className="p-3 text-warning">+{node.xpReward}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setEditingNode(node)}
                        className="p-1 rounded bg-elevated hover:bg-elevated/80 text-text-secondary hover:text-text-primary"
                        title="Edit Node"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete node ${node.title}?`)) deleteNode(node.id);
                        }}
                        className="p-1 rounded bg-elevated hover:bg-danger/20 text-text-secondary hover:text-danger"
                        title="Delete Node"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CERTIFICATIONS ADMIN */}
      {activeTab === 'certs' && (
        <div className="space-y-4">
          <div className="border border-hairline rounded-xl overflow-hidden bg-surface">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-elevated text-text-secondary border-b border-hairline">
                <tr>
                  <th className="p-3">Cert Title</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Tier</th>
                  <th className="p-3">Cost</th>
                  <th className="p-3">Target Role</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {certifications.map((cert) => (
                  <tr key={cert.id} className="hover:bg-elevated/40 transition-colors">
                    <td className="p-3 text-text-primary font-sans font-medium">{cert.title}</td>
                    <td className="p-3 text-accent font-semibold">{cert.provider}</td>
                    <td className="p-3">{cert.difficulty}</td>
                    <td className="p-3 text-success">{cert.cost}</td>
                    <td className="p-3 text-text-secondary">{cert.targetRole}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setEditingCert(cert)}
                        className="p-1 rounded bg-elevated hover:bg-elevated/80 text-text-secondary hover:text-text-primary"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete cert ${cert.title}?`)) deleteCertification(cert.id);
                        }}
                        className="p-1 rounded bg-elevated hover:bg-danger/20 text-text-secondary hover:text-danger"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RADAR TRENDS ADMIN */}
      {activeTab === 'trends' && (
        <div className="space-y-4">
          <div className="border border-hairline rounded-xl overflow-hidden bg-surface">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-elevated text-text-secondary border-b border-hairline">
                <tr>
                  <th className="p-3">Movement Title</th>
                  <th className="p-3">Quadrant</th>
                  <th className="p-3">Ring</th>
                  <th className="p-3">Maturity Score</th>
                  <th className="p-3">Adoption Rate</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {radarTrends.map((trend) => (
                  <tr key={trend.id} className="hover:bg-elevated/40 transition-colors">
                    <td className="p-3 text-text-primary font-sans font-medium">{trend.title}</td>
                    <td className="p-3 text-accent">{trend.quadrant}</td>
                    <td className="p-3 font-semibold">{trend.ring}</td>
                    <td className="p-3 text-warning">{trend.maturityScore}/100</td>
                    <td className="p-3 text-text-secondary">{trend.adoptionRate}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setEditingTrend(trend)}
                        className="p-1 rounded bg-elevated hover:bg-elevated/80 text-text-secondary hover:text-text-primary"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete trend ${trend.title}?`)) deleteTrend(trend.id);
                        }}
                        className="p-1 rounded bg-elevated hover:bg-danger/20 text-text-secondary hover:text-danger"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Node Edit Drawer/Modal */}
      {editingNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-surface border border-hairline shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-text-primary">Edit Node: {editingNode.title}</h3>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-text-secondary">Node Title</label>
                <input
                  type="text"
                  value={editingNode.title}
                  onChange={(e) => setEditingNode({ ...editingNode, title: e.target.value })}
                  className="w-full p-2 rounded bg-elevated border border-hairline text-text-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-text-secondary">Short Description</label>
                <textarea
                  rows={2}
                  value={editingNode.shortDesc}
                  onChange={(e) => setEditingNode({ ...editingNode, shortDesc: e.target.value })}
                  className="w-full p-2 rounded bg-elevated border border-hairline text-text-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-text-secondary">Estimated Hours</label>
                  <input
                    type="number"
                    value={editingNode.estimatedHours}
                    onChange={(e) => setEditingNode({ ...editingNode, estimatedHours: Number(e.target.value) })}
                    className="w-full p-2 rounded bg-elevated border border-hairline text-text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-text-secondary">XP Reward</label>
                  <input
                    type="number"
                    value={editingNode.xpReward}
                    onChange={(e) => setEditingNode({ ...editingNode, xpReward: Number(e.target.value) })}
                    className="w-full p-2 rounded bg-elevated border border-hairline text-text-primary"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                onClick={() => setEditingNode(null)}
                className="px-4 py-1.5 rounded-lg text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNode}
                className="px-5 py-1.5 rounded-lg bg-accent text-white font-medium text-xs hover:bg-accent-hover flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Node & Publish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cert Edit Drawer/Modal */}
      {editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-surface border border-hairline shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-text-primary">Edit Certification: {editingCert.title}</h3>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-text-secondary">Certification Title</label>
                <input
                  type="text"
                  value={editingCert.title}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  className="w-full p-2 rounded bg-elevated border border-hairline text-text-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-text-secondary">Exam Cost</label>
                  <input
                    type="text"
                    value={editingCert.cost}
                    onChange={(e) => setEditingCert({ ...editingCert, cost: e.target.value })}
                    className="w-full p-2 rounded bg-elevated border border-hairline text-text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-text-secondary">Target Role</label>
                  <input
                    type="text"
                    value={editingCert.targetRole}
                    onChange={(e) => setEditingCert({ ...editingCert, targetRole: e.target.value })}
                    className="w-full p-2 rounded bg-elevated border border-hairline text-text-primary"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                onClick={() => setEditingCert(null)}
                className="px-4 py-1.5 rounded-lg text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCert}
                className="px-5 py-1.5 rounded-lg bg-accent text-white font-medium text-xs hover:bg-accent-hover flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Certification & Publish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trend Edit Drawer/Modal */}
      {editingTrend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-surface border border-hairline shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-text-primary">Edit Trend: {editingTrend.title}</h3>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-text-secondary">Trend Title</label>
                <input
                  type="text"
                  value={editingTrend.title}
                  onChange={(e) => setEditingTrend({ ...editingTrend, title: e.target.value })}
                  className="w-full p-2 rounded bg-elevated border border-hairline text-text-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-text-secondary">Maturity Score (0-100)</label>
                  <input
                    type="number"
                    value={editingTrend.maturityScore}
                    onChange={(e) => setEditingTrend({ ...editingTrend, maturityScore: Number(e.target.value) })}
                    className="w-full p-2 rounded bg-elevated border border-hairline text-text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-text-secondary">Ring</label>
                  <select
                    value={editingTrend.ring}
                    onChange={(e) => setEditingTrend({ ...editingTrend, ring: e.target.value as any })}
                    className="w-full p-2 rounded bg-elevated border border-hairline text-text-primary"
                  >
                    <option value="Adopt">Adopt</option>
                    <option value="Trial">Trial</option>
                    <option value="Assess">Assess</option>
                    <option value="Hold">Hold</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                onClick={() => setEditingTrend(null)}
                className="px-4 py-1.5 rounded-lg text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTrend}
                className="px-5 py-1.5 rounded-lg bg-accent text-white font-medium text-xs hover:bg-accent-hover flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Trend & Publish</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
