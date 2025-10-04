'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
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
};

type LinkObject = {
  source: string | NodeObject;
  target: string | NodeObject;
};

const ForceGraph = ({ data, onNodeClick }) => {
  const ForceGraph3D = require('react-force-graph-3d').default;

  return (
    <ForceGraph3D
      graphData={data}
      nodeLabel="title"
      nodeAutoColorBy="group"
      linkDirectionalParticles={2}
      linkDirectionalParticleWidth={1.5}
      linkDirectionalParticleSpeed={0.006}
      onNodeClick={onNodeClick}
      nodeThreeObject={(node: any) => {
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            color: node.color,
            map: new THREE.TextureLoader().load(
              'data:image/svg+xml,' +
                encodeURIComponent(
                  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${node.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>`
                )
            ),
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
          })
        );
        sprite.scale.set(12, 12, 1);
        return sprite;
      }}
    />
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
      <Canvas camera={{ position: [0, 0, 300] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <ForceGraph data={data} onNodeClick={handleNodeClick} />
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
            <Card className="h-full rounded-l-lg rounded-r-none border-l-2 border-accent shadow-2xl">
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
