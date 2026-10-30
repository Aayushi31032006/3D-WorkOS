import React from 'react';
import { X, Box, Layers, Eye, Cpu, Compass, Sparkles } from 'lucide-react';

export interface ThreeJsInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThreeJsInspectorModal: React.FC<ThreeJsInspectorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const threeComponents = [
    {
      title: '3D Canvas & WebGL Pipeline',
      file: 'src/explorer/scene/Scene.tsx',
      icon: Box,
      description: 'Mounts the Three.js WebGLRenderer via @react-three/fiber Canvas with antialiasing, shadow maps (2048x2048 PCF soft shadows), studio lights, and background fog (#F5F3FA).'
    },
    {
      title: 'Central Plinth & Matte Floor',
      file: 'src/explorer/scene/Floor.tsx & Plinth.tsx',
      icon: Layers,
      description: 'Uses THREE.PlaneGeometry with MeshStandardMaterial (roughness: 0.92) as a soft shadow receiver, plus 6 concentric THREE.RingGeometry grooves (#E3DCF2) and a stepped cylindrical dais.'
    },
    {
      title: 'Physical Spheres & Billboard Overlays',
      file: 'src/explorer/scene/SphereNode.tsx',
      icon: Sparkles,
      description: 'High-detail THREE.SphereGeometry (64x64 segments) with MeshPhysicalMaterial (clearcoat: 0.35, roughness: 0.28, reflectivity: 0.6) and @react-three/drei Html billboarded overlays facing the camera.'
    },
    {
      title: 'Curved Bezier Tubes & Energy Beads',
      file: 'src/explorer/scene/Connections.tsx',
      icon: Cpu,
      description: 'Generates dynamic 3D spline tubes using THREE.QuadraticBezierCurve3 and THREE.TubeGeometry connecting the central dais to surrounding nodes with live traveling pulse beads.'
    },
    {
      title: 'Camera Controller & 300-500ms Smooth Transitions',
      file: 'src/explorer/scene/CameraControls.tsx',
      icon: Compass,
      description: 'Drei OrbitControls combined with a custom useFrame cubic ease-out interpolation engine that smoothly transitions camera vectors [0, 8.5, 11.5] without snapping.'
    },
    {
      title: 'Ambient Decorative Spheres',
      file: 'src/explorer/scene/AmbientSpheres.tsx',
      icon: Eye,
      description: 'Instanced spatial spheres scattered on the floor catching ambient directional reflections and soft ground contact shadows.'
    }
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(48, 38, 76, 0.4)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 20px 48px rgba(48, 38, 76, 0.2)',
          border: '1px solid var(--wos-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--wos-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #FAF7FD 0%, #FFFFFF 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box size={20} color="var(--wos-selection)" />
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--wos-label)' }}>
              Three.js Architecture & Usage
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="wos-panel-close-btn"
            aria-label="Close inspector"
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: 'var(--wos-selection-light)',
            borderRadius: '10px',
            fontSize: '13px',
            color: 'var(--wos-selection)',
            fontWeight: 500,
            lineHeight: 1.5
          }}>
            Three.js is rendered via React Three Fiber (<code>@react-three/fiber</code>) and Drei (<code>@react-three/drei</code>) to deliver high-performance 60FPS WebGL graphics while remaining fully reactive to React state.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {threeComponents.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--wos-border)',
                    backgroundColor: '#FAFAFD',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '14px', color: 'var(--wos-label)' }}>
                      <Icon size={16} color="var(--wos-selection)" />
                      <span>{item.title}</span>
                    </div>
                    <code style={{ fontSize: '11px', color: 'var(--wos-label-muted)', background: '#EDE7F6', padding: '2px 8px', borderRadius: '4px' }}>
                      {item.file}
                    </code>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--wos-label-muted)', lineHeight: 1.5 }}>
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
