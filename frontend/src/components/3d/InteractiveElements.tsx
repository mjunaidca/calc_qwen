"use client";

import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface InteractiveElementProps {
  children?: React.ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  onClick?: () => void;
  label?: string;
}

// Interactive floating number element for 3D calculator
const FloatingNumber: React.FC<{
  number: string;
  position: [number, number, number];
  isActive: boolean;
  onClick: () => void;
}> = ({ number, position, isActive, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle floating motion
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      // Gentle rotation
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={hovered ? 1.2 : 1}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <icosahedronGeometry args={[0.6, 0]} />
      <meshStandardMaterial 
        color={isActive ? '#2ecc40' : hovered ? 'hotpink' : '#3498db'} 
        metalness={0.5}
        roughness={0.2}
        wireframe={isActive}
      />
      <Text
        position={[0, 0, 0.7]} 
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {number}
      </Text>
    </mesh>
  );
};

// Interactive 3D operator symbols
const OperatorSymbol: React.FC<{
  symbol: string;
  position: [number, number, number];
  isActive: boolean;
  onClick: () => void;
}> = ({ symbol, position, isActive, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing effect when active
      const scale = isActive ? 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1 : hovered ? 1.1 : 1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <torusGeometry args={[0.8, 0.2, 16, 32]} />
      <meshStandardMaterial 
        color={isActive ? '#ff851b' : hovered ? 'hotpink' : '#e74c3c'} 
        metalness={0.7}
        roughness={0.3}
      />
      <Text
        position={[0, 0, 0.9]} 
        fontSize={1.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {symbol}
      </Text>
    </mesh>
  );
};

// 3D display showing current calculation
const DisplayCube: React.FC<{ value: string }> = ({ value }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = hovered ? 0.2 : 0;
      meshRef.current.rotation.y = hovered ? 0.2 : 0;
    }
  });

  return (
    <group position={[0, 4, 0]}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[6, 1.5, 1]} />
        <meshStandardMaterial 
          color={hovered ? '#222222' : '#1a1a1a'} 
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
      <Text
        position={[0, 4, 0.6]} 
        fontSize={0.5}
        color="lime"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
    </group>
  );
};

const InteractiveElements: React.FC<{
  displayValue: string;
  onNumberClick: (num: string) => void;
  onOperatorClick: (op: string) => void;
}> = ({ displayValue, onNumberClick, onOperatorClick }) => {
  return (
    <div className="w-full h-80 rounded-xl bg-gradient-to-br from-indigo-900 to-purple-900 p-4">
      <Canvas shadows camera={{ position: [0, 5, 15], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Display */}
        <DisplayCube value={displayValue} />

        {/* Number elements arranged in a grid */}
        <FloatingNumber 
          number="7" 
          position={[-4, 0, 0]} 
          isActive={false} 
          onClick={() => onNumberClick('7')} 
        />
        <FloatingNumber 
          number="8" 
          position={[0, 0, 0]} 
          isActive={false} 
          onClick={() => onNumberClick('8')} 
        />
        <FloatingNumber 
          number="9" 
          position={[4, 0, 0]} 
          isActive={false} 
          onClick={() => onNumberClick('9')} 
        />

        <FloatingNumber 
          number="4" 
          position={[-4, -3, 0]} 
          isActive={false} 
          onClick={() => onNumberClick('4')} 
        />
        <FloatingNumber 
          number="5" 
          position={[0, -3, 0]} 
          isActive={false} 
          onClick={() => onNumberClick('5')} 
        />
        <FloatingNumber 
          number="6" 
          position={[4, -3, 0]} 
          isActive={false} 
          onClick={() => onNumberClick('6')} 
        />

        <FloatingNumber 
          number="1" 
          position={[-4, -6, 0]} 
          isActive={false} 
          onClick={() => onNumberClick('1')} 
        />
        <FloatingNumber 
          number="2" 
          position={[0, -6, 0]} 
          isActive={false} 
          onClick={() => onNumberClick('2')} 
        />
        <FloatingNumber 
          number="3" 
          position={[4, -6, 0]} 
          isActive={false} 
          onClick={() => onNumberClick('3')} 
        />

        <FloatingNumber 
          number="0" 
          position={[-2, -9, 0]} 
          isActive={false} 
          onClick={() => onNumberClick('0')} 
        />
        <FloatingNumber 
          number="." 
          position={[2, -9, 0]} 
          isActive={false} 
          onClick={() => onNumberClick('.')} 
        />

        {/* Operator elements */}
        <OperatorSymbol 
          symbol="+" 
          position={[-6, -3, 0]} 
          isActive={false} 
          onClick={() => onOperatorClick('+')} 
        />
        <OperatorSymbol 
          symbol="-" 
          position={[-6, -6, 0]} 
          isActive={false} 
          onClick={() => onOperatorClick('-')} 
        />
        <OperatorSymbol 
          symbol="×" 
          position={[6, -3, 0]} 
          isActive={false} 
          onClick={() => onOperatorClick('×')} 
        />
        <OperatorSymbol 
          symbol="÷" 
          position={[6, -6, 0]} 
          isActive={false} 
          onClick={() => onOperatorClick('÷')} 
        />
        <OperatorSymbol 
          symbol="=" 
          position={[6, -9, 0]} 
          isActive={false} 
          onClick={() => onOperatorClick('=')} 
        />
        <OperatorSymbol 
          symbol="C" 
          position={[-6, 0, 0]} 
          isActive={false} 
          onClick={() => onOperatorClick('C')} 
        />

        {/* Grid floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
      </Canvas>
    </div>
  );
};

export default InteractiveElements;