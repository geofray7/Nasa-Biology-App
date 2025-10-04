'use client';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  getResearchPapers,
  type ResearchPapersOutput,
} from '@/ai/flows/get-research-papers';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type NodeObject = {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
} & Record<string, any>;

type LinkObject = {
  source: string;
  target: string;
};

const Node = ({ node, onClick, selected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (ref.current && node.position) {
      ref.current.position.copy(node.position);
    }
  });

  const finalColor = useMemo(() => {
    if (selected) return new THREE.Color('#E67E22');
    if (isHovered) return new THREE.Color('#8E44AD');
    return node.color;
  }, [selected, isHovered, node.color]);

  const handleClick = useCallback(() => {
    onClick(node);
  }, [node, onClick]);

  return (
    <Sphere
      ref={ref}
      args={[1, 32, 32]}
      scale={selected ? 1.5 : 1}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <meshStandardMaterial
        color={finalColor}
        emissive={finalColor}
        emissiveIntensity={isHovered || selected ? 0.5 : 0.2}
        roughness={0.4}
        metalness={0.1}
      />
    </Sphere>
  );
};

const ForceGraph = ({ data, onNodeClick, selectedNodeId }) => {
  const [nodes, setNodes] = useState<NodeObject[]>([]);
  const [links, setLinks] = useState<LinkObject[]>([]);

  useEffect(() => {
    const initialNodes = data.nodes.map(d => ({
      ...d,
      id: d.id,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      ),
      velocity: new THREE.Vector3(),
      color: new THREE.Color(0x6c3483),
    }));
    setNodes(initialNodes);
    setLinks(data.links);
  }, [data]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, NodeObject>();
    nodes.forEach(node => map.set(node.id, node));
    return map;
  }, [nodes]);

  useFrame((_, delta) => {
    if (nodes.length === 0) return;

    const newNodes = nodes.map(node => ({
      ...node,
      velocity: node.velocity.clone(),
      position: node.position.clone(),
    }));

    // Repulsion force
    for (let i = 0; i < newNodes.length; i++) {
      for (let j = i + 1; j < newNodes.length; j++) {
        const ni = newNodes[i];
        const nj = newNodes[j];
        const deltaPos = new THREE.Vector3().subVectors(ni.position, nj.position);
        const distSq = deltaPos.lengthSq();
        if (distSq > 0) {
          const force = 150 / distSq;
          const forceVec = deltaPos.normalize().multiplyScalar(force);
          ni.velocity.add(forceVec);
          nj.velocity.sub(forceVec);
        }
      }
    }

    // Link force (attraction)
    for (const link of links) {
      const sourceNode = newNodes.find(n => n.id === link.source);
      const targetNode = newNodes.find(n => n.id === link.target);
      if (sourceNode && targetNode) {
        const deltaPos = new THREE.Vector3().subVectors(targetNode.position, sourceNode.position);
        const dist = deltaPos.length();
        const force = (dist - 50) * 0.01;
        const forceVec = deltaPos.normalize().multiplyScalar(force);
        sourceNode.velocity.add(forceVec);
        targetNode.velocity.sub(forceVec);
      }
    }
    
    // Center force
     for (const node of newNodes) {
        const centerForce = node.position.clone().multiplyScalar(-0.001);
        node.velocity.add(centerForce);
     }

    // Update positions
    for (const node of newNodes) {
      node.velocity.multiplyScalar(0.95); // Damping
      node.position.add(node.velocity.clone().multiplyScalar(delta));
    }
    
    setNodes(newNodes);
  });

  if (nodes.length === 0) return null;

  return (
    <group>
      {nodes.map(node => (
        <Node
          key={node.id}
          node={node}
          onClick={onNodeClick}
          selected={selectedNodeId === node.id}
        />
      ))}
      {links.map((link, i) => {
        const source = nodeMap.get(link.source);
        const target = nodeMap.get(link.target);
        if (!source || !target) return null;
        return (
          <Line
            key={i}
            points={[source.position, target.position]}
            color="#aaa"
            lineWidth={0.5}
            transparent
            opacity={0.5}
          />
        );
      })}
    </group>
  );
};

function Rig() {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();

  return useFrame(() => {
    const targetX = mouse.x * 20;
    const targetY = mouse.y * 20;
    camera.position.lerp(vec.set(targetX, targetY, camera.position.z), 0.02);
    camera.lookAt(0, 0, 0);
  });
}

export function Galaxy() {
  const [data, setData] = useState<ResearchPapersOutput>({
    nodes: [],
    links: [],
  });
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    getResearchPapers().then(setData);
  }, []);

  const handleNodeClick = useCallback(node => {
    setSelectedNode(node);
  }, []);

  const handleClose = () => {
    setSelectedNode(null);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 150], fov: 75 }}>
        <ambientLight intensity={1} />
        <pointLight position={[100, 100, 100]} intensity={0.8} />
        <pointLight position={[-100, -100, -100]} intensity={0.8} />
        {data.nodes.length > 0 && <ForceGraph data={data} onNodeClick={handleNodeClick} selectedNodeId={selectedNode?.id} />}
        <OrbitControls enableDamping dampingFactor={0.1} />
        <Rig />
      </Canvas>
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 right-0 h-full w-full max-w-sm"
          >
            <Card className="h-full rounded-l-lg rounded-r-none border-l-2 border-accent shadow-2xl bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1.5">
                  <CardTitle className="font-headline text-lg">
                    {selectedNode.title}
                  </CardTitle>
                  <CardDescription>
                    {selectedNode.author} ({selectedNode.year})
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={handleClose}
                >
                  <X className="size-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {selectedNode.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedNode.keywords.map((keyword: string) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
