"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

interface CalculatorSceneProps {
  isActive?: boolean;
}

// Individual cube component that represents a key or part of the calculator
const CalculatorCube: React.FC<{
  position: [number, number, number];
  color: string;
  onClick?: () => void;
  label?: string;
}> = ({ position, color, onClick, label }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [scale, setScale] = useState(1);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(Math.max(0.5, scale + (hovered ? 0.1 : 0)));
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={hovered ? 'hotpink' : color} 
        metalness={0.5}
        roughness={0.2}
      />
      {label && (
        <Text
          position={[0, 0, 0.6]} 
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </mesh>
  );
};

// Main calculator scene component
const SceneContent: React.FC<{ onKeyPress?: (key: string) => void }> = ({ onKeyPress }) => {
  return (
    <>
      {/* Ambient and directional lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Calculator body */}
      <mesh position={[0, -1, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 1, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Display area */}
      <mesh position={[0, 0.5, 3.5]} castShadow receiveShadow>
        <boxGeometry args={[10, 1.5, 1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Calculator buttons arranged in grid */}
      {/* Row 1: AC, C, %, ÷ */}
      <CalculatorCube position={[-4.5, 0, 2]} color="#ff4136" onClick={() => onKeyPress?.('AC')} label="AC" />
      <CalculatorCube position={[-1.5, 0, 2]} color="#ff4136" onClick={() => onKeyPress?.('C')} label="C" />
      <CalculatorCube position={[1.5, 0, 2]} color="#ff4136" onClick={() => onKeyPress?.('%')} label="%" />
      <CalculatorCube position={[4.5, 0, 2]} color="#ff851b" onClick={() => onKeyPress?.('÷')} label="÷" />

      {/* Row 2: 7, 8, 9, × */}
      <CalculatorCube position={[-4.5, 0, 0]} color="#f0f0f0" onClick={() => onKeyPress?.('7')} label="7" />
      <CalculatorCube position={[-1.5, 0, 0]} color="#f0f0f0" onClick={() => onKeyPress?.('8')} label="8" />
      <CalculatorCube position={[1.5, 0, 0]} color="#f0f0f0" onClick={() => onKeyPress?.('9')} label="9" />
      <CalculatorCube position={[4.5, 0, 0]} color="#ff851b" onClick={() => onKeyPress?.('×')} label="×" />

      {/* Row 3: 4, 5, 6, - */}
      <CalculatorCube position={[-4.5, 0, -2]} color="#f0f0f0" onClick={() => onKeyPress?.('4')} label="4" />
      <CalculatorCube position={[-1.5, 0, -2]} color="#f0f0f0" onClick={() => onKeyPress?.('5')} label="5" />
      <CalculatorCube position={[1.5, 0, -2]} color="#f0f0f0" onClick={() => onKeyPress?.('6')} label="6" />
      <CalculatorCube position={[4.5, 0, -2]} color="#ff851b" onClick={() => onKeyPress?.('-')} label="-" />

      {/* Row 4: 1, 2, 3, + */}
      <CalculatorCube position={[-4.5, 0, -4]} color="#f0f0f0" onClick={() => onKeyPress?.('1')} label="1" />
      <CalculatorCube position={[-1.5, 0, -4]} color="#f0f0f0" onClick={() => onKeyPress?.('2')} label="2" />
      <CalculatorCube position={[1.5, 0, -4]} color="#f0f0f0" onClick={() => onKeyPress?.('3')} label="3" />
      <CalculatorCube position={[4.5, 0, -4]} color="#ff851b" onClick={() => onKeyPress?.('+')} label="+" />

      {/* Row 5: ±, 0, ., = */}
      <CalculatorCube position={[-4.5, 0, -6]} color="#ff4136" onClick={() => onKeyPress?.('±')} label="±" />
      <CalculatorCube position={[-1.5, 0, -6]} color="#f0f0f0" onClick={() => onKeyPress?.('0')} label="0" />
      <CalculatorCube position={[1.5, 0, -6]} color="#f0f0f0" onClick={() => onKeyPress?.('.')} label="." />
      <CalculatorCube position={[4.5, 0, -6]} color="#2ecc40" onClick={() => onKeyPress?.('=')} label="=" />

      {/* Camera controls */}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
};

const CalculatorScene: React.FC<CalculatorSceneProps> = ({ isActive = false }) => {
  return (
    <div className="w-full h-64 bg-gradient-to-b from-blue-100 to-purple-100 rounded-xl p-4 shadow-lg">
      <Canvas shadows camera={{ position: [15, 15, 15], fov: 50 }}>
        <SceneContent />
      </Canvas>
      {isActive && (
        <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
          3D Calculator Active
        </div>
      )}
    </div>
  );
};

export default CalculatorScene;