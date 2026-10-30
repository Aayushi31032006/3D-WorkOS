import React, { useState, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { 
  Building2, 
  FileText, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Box, 
  CreditCard, 
  FileCheck 
} from 'lucide-react';
import { ObjectType } from '../../types';

export interface SphereNodeProps {
  id: string;
  isCentral?: boolean;
  type: ObjectType;
  title: string;
  subtitle?: string;
  count?: number;
  position: [number, number, number];
  color?: string;
  isSelected?: boolean;
  onClick: (id: string, isCentral: boolean) => void;
}

export const SphereNode: React.FC<SphereNodeProps> = ({
  id,
  isCentral = false,
  type,
  title,
  subtitle,
  count,
  position,
  color,
  isSelected = false,
  onClick
}) => {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  // Subtle floating motion using Three.js useFrame
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const time = clock.getElapsedTime();
    // Peripheral spheres have a gentle desynchronized floating bob
    if (!isCentral) {
      const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const bob = Math.sin(time * 1.5 + hash) * 0.045;
      groupRef.current.position.y = position[1] + bob;
    }
  });

  // Exact colors from brief: Central #B897E3, Related #D3BFEF, Selection #7046B2
  const sphereColor = color || (isCentral ? '#B897E3' : '#D3BFEF');
  const radius = isCentral ? 1.35 : 0.72;
  const currentScale = hovered ? 1.05 : 1.0;

  // Icons matching object types in Figure 1
  const getIcon = () => {
    const size = isCentral ? 22 : 18;
    const stroke = '#30264C';
    switch (type) {
      case 'customer':
        return <Building2 size={size} color={stroke} />;
      case 'invoice':
        return <FileText size={size} color={stroke} />;
      case 'project':
        return <FolderKanban size={size} color={stroke} />;
      case 'task':
        return <CheckSquare size={size} color={stroke} />;
      case 'person':
        return <Users size={size} color={stroke} />;
      case 'product':
        return <Box size={size} color={stroke} />;
      case 'payment':
        return <CreditCard size={size} color={stroke} />;
      case 'contract':
        return <FileCheck size={size} color={stroke} />;
      default:
        return <FileText size={size} color={stroke} />;
    }
  };

  return (
    <group 
      ref={groupRef}
      position={position}
      scale={[currentScale, currentScale, currentScale]}
    >
      {/* 3D Sphere Mesh with smooth material */}
      <mesh
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onClick(id, isCentral);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhysicalMaterial
          color={sphereColor}
          roughness={0.28}
          metalness={0.12}
          clearcoat={0.35}
          clearcoatRoughness={0.2}
          reflectivity={0.6}
        />
      </mesh>

      {/* Selection / Hover Indicator Ring */}
      {(isSelected || hovered) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -radius - 0.05, 0]}>
          <ringGeometry args={[radius + 0.12, radius + 0.22, 64]} />
          <meshBasicMaterial 
            color="#7046B2" 
            transparent 
            opacity={isSelected ? 0.85 : 0.45} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      )}

      {/* Embedded High-Fidelity Labels (HTML Overlay billboarded upright) */}
      <Html
        position={isCentral ? [0, 0, 0] : [0, 0, 0]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#30264C',
          userSelect: 'none',
          fontFamily: 'Inter, sans-serif'
        }}>
          {isCentral ? (
            /* Central Sphere Label (Figure 1: Type on top, Name below) */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)'
            }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                opacity: 0.85,
                color: '#30264C',
                marginBottom: '2px'
              }}>
                {subtitle || type}
              </span>
              <span style={{
                fontSize: '17px',
                fontWeight: 800,
                color: '#30264C',
                whiteSpace: 'nowrap',
                lineHeight: 1.2
              }}>
                {title}
              </span>
            </div>
          ) : (
            /* Related Sphere: Icon in sphere center */
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.95
            }}>
              {getIcon()}
            </div>
          )}
        </div>
      </Html>

      {/* Label Under Related Sphere (High-Fidelity Enterprise Pill matching Figure 1) */}
      {!isCentral && (
        <Html
          position={[0, -radius - 0.42, 0]}
          center
          distanceFactor={13}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '4px 12px',
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(8px)',
            borderRadius: '9999px',
            border: '1px solid rgba(112, 70, 178, 0.16)',
            boxShadow: '0 4px 12px rgba(48, 38, 76, 0.08)',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            userSelect: 'none',
            fontFamily: 'Inter, sans-serif'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#30264C',
                letterSpacing: '-0.01em'
              }}>
                {title}
              </span>
              {typeof count === 'number' && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--wos-selection)',
                  background: 'var(--wos-selection-light)',
                  padding: '1px 6px',
                  borderRadius: '9999px'
                }}>
                  ({count})
                </span>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};
