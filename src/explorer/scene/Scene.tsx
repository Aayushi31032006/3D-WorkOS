import React, { useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Floor } from './Floor';
import { Plinth } from './Plinth';
import { AmbientSpheres } from './AmbientSpheres';
import { SphereNode } from './SphereNode';
import { Connections } from './Connections';
import { CameraController } from './CameraControls';
import { BusinessObject, RelationshipGroup, CameraState } from '../../types';

export interface SceneProps {
  currentObject: BusinessObject;
  relationshipGroups: RelationshipGroup[];
  selectedGroupId: string | null;
  onSelectCentral: () => void;
  onSelectGroup: (group: RelationshipGroup) => void;
  cameraTrigger?: {
    action: 'zoomIn' | 'zoomOut' | 'reset' | 'restore';
    targetState?: CameraState;
    timestamp: number;
  } | null;
  onCameraChange?: (state: CameraState) => void;
  backgroundColor?: string;
}

export const Scene: React.FC<SceneProps> = ({
  currentObject,
  relationshipGroups,
  selectedGroupId,
  onSelectCentral,
  onSelectGroup,
  cameraTrigger,
  onCameraChange,
  backgroundColor = '#F5F3FA'
}) => {
  // Pointer tracking ref to prevent camera drag from triggering click selections
  const dragTracker = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
  }>({
    isDragging: false,
    startX: 0,
    startY: 0
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    dragTracker.current = {
      isDragging: false,
      startX: e.clientX,
      startY: e.clientY
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - dragTracker.current.startX);
    const dy = Math.abs(e.clientY - dragTracker.current.startY);
    if (dx > 5 || dy > 5) {
      dragTracker.current.isDragging = true;
    }
  };

  // Calculate peripheral positions in an ellipse matching Figure 1 layout
  const peripheralNodes = useMemo(() => {
    const count = relationshipGroups.length;
    if (count === 0) return [];

    const radiusX = 5.6;
    const radiusZ = 4.2;

    return relationshipGroups.map((group, index) => {
      // Distribute evenly, offset start angle for balanced symmetry
      const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radiusX;
      const z = Math.sin(angle) * radiusZ;
      const y = 0.28;

      return {
        group,
        position: [x, y, z] as [number, number, number]
      };
    });
  }, [relationshipGroups]);

  const targetPositions = useMemo(() => {
    return peripheralNodes.map(p => p.position);
  }, [peripheralNodes]);

  return (
    <div 
      className="wos-canvas-container"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onClick={(e) => {
        // Prevent empty space click from closing panels or clearing selection (per brief requirement 4)
        e.stopPropagation();
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 8.5, 11.5], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: backgroundColor }}
      >
        <color attach="background" args={[backgroundColor]} />
        <fog attach="fog" args={[backgroundColor, 16, 42]} />

        {/* Ambient & Studio Directional Lighting */}
        <ambientLight intensity={0.92} color="#FFFFFF" />
        <directionalLight
          position={[10, 16, 8]}
          intensity={1.25}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={35}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-bias={-0.0001}
        />
        <directionalLight
          position={[-10, 8, -6]}
          intensity={0.4}
          color="#D9C7F3"
        />

        {/* Matte Floor with Concentric Circular Grooves */}
        <Floor floorColor={backgroundColor} />

        {/* Stepped Plinth Under Central Sphere */}
        <Plinth />

        {/* Ambient Decorative Lilac Spheres */}
        <AmbientSpheres />

        {/* Connecting Curved Tubes with Joint Beads */}
        <Connections
          center={[0, 0.9, 0]}
          targets={targetPositions}
        />

        {/* Central Large Sphere */}
        <SphereNode
          id={currentObject.id}
          isCentral={true}
          type={currentObject.type}
          title={currentObject.name}
          subtitle={currentObject.type.toUpperCase()}
          position={[0, 0.9, 0]}
          onClick={() => {
            if (!dragTracker.current.isDragging) {
              onSelectCentral();
            }
          }}
        />

        {/* Peripheral Related Spheres */}
        {peripheralNodes.map(({ group, position }) => (
          <SphereNode
            key={group.type + '_' + group.label}
            id={group.type}
            isCentral={false}
            type={group.type}
            title={group.label}
            count={group.count}
            position={position}
            isSelected={selectedGroupId === group.type}
            onClick={() => {
              if (!dragTracker.current.isDragging) {
                onSelectGroup(group);
              }
            }}
          />
        ))}

        {/* Camera Controls & Animation Manager */}
        <CameraController
          cameraStateTrigger={cameraTrigger}
          onCameraChange={onCameraChange}
        />
      </Canvas>
    </div>
  );
};
