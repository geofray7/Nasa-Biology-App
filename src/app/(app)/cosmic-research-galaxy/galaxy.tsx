'use client';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
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
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  __threeObj?: THREE.Object3D;
} & Record<string, any>;

type LinkObject = {
  source: string | NodeObject;
  target: string | NodeObject;
};

const Node = ({ node, onClick, selected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<THREE.Sprite>();

  const color = useMemo(() => new THREE.Color(selected ? '#E67E22' : isHovered ? '#8E44AD' : '#6C3483'), [isHovered, selected]);
  
  useFrame(() => {
    if (ref.current && node.x !== undefined && node.y !== undefined && node.z !== undefined) {
      ref.current.position.set(node.x, node.y, node.z);
    }
  });

  const handleClick = useCallback(() => {
    onClick(node);
  }, [node, onClick]);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
        context.beginPath();
        context.arc(32, 32, 30, 0, 2 * Math.PI);
        context.fillStyle = color.getStyle();
        context.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, [color]);


  return (
    <sprite
      ref={ref}
      scale={selected ? 8 : 5}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <spriteMaterial attach="material" map={texture} transparent opacity={0.8} />
    </sprite>
  );
};


const ForceGraph = ({ data, onNodeClick, selectedNodeId }) => {
  const [graphData, setGraphData] = useState<{ nodes: NodeObject[], links: LinkObject[] }>({ nodes: [], links: [] });

  useEffect(() => {
    const nodes = data.nodes.map(node => ({ ...node }));
    const links = data.links.map(link => ({ ...link }));

    const simulation = (window as any).d3.forceSimulation(nodes, 3)
      .force('link', (window as any).d3.forceLink(links).id(d => d.id).distance(50))
      .force('charge', (window as any).d3.forceManyBody().strength(-100))
      .force('center', (window as any).d3.forceCenter())
      .on('tick', () => {
        setGraphData({ nodes: [...nodes], links: [...links] });
      });
    
    return () => simulation.stop();
  }, [data]);
  
  const { nodes, links } = graphData;

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
        const source = link.source as NodeObject;
        const target = link.target as NodeObject;
        if (!source.x || !source.y || !source.z || !target.x || !target.y || !target.z) return null;
        return (
          <Line
            key={i}
            points={[[source.x, source.y, source.z], [target.x, target.y, target.z]]}
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
    camera.position.lerp(vec.set(mouse.x * 2, mouse.y * 2, camera.position.z), 0.02);
    camera.lookAt(0, 0, 0);
  });
}

export function Galaxy() {
  const [data, setData] = useState<ResearchPapersOutput>({
    nodes: [],
    links: [],
  });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isD3Ready, setIsD3Ready] = useState(false);

  useEffect(() => {
    getResearchPapers().then(setData);

    const script = document.createElement('script');
    script.src = 'https://d3js.org/d3-force-3d.v3.min.js';
    script.async = true;
    script.onload = () => setIsD3Ready(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const handleNodeClick = useCallback(node => {
    setSelectedNode(node);
  }, []);

  const handleClose = () => {
    setSelectedNode(null);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 300] }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5}/>
        <pointLight position={[-10, -10, -10]} intensity={0.5}/>
        {isD3Ready && data.nodes.length > 0 && <ForceGraph data={data} onNodeClick={handleNodeClick} selectedNodeId={selectedNode?.id} />}
        <OrbitControls />
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
