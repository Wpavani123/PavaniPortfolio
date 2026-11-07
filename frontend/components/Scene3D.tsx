'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isMobileOrReduced, setIsMobileOrReduced] = useState<boolean>(true);

  useEffect(() => {
    // Check for mobile or prefers-reduced-motion
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isMobile || prefersReducedMotion) {
      setIsMobileOrReduced(true);
      return;
    }

    setIsMobileOrReduced(false);

    if (!mountRef.current) return;

    // --- Lightweight Pure Three.js WebGL Scene ---
    const currentMount = mountRef.current;
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    currentMount.appendChild(renderer.domElement);

    // Group for entire cloud network
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // 1. Central floating Cloud Core (Icosahedron wireframe)
    const coreGeo = new THREE.IcosahedronGeometry(4.5, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    networkGroup.add(coreMesh);

    // 2. Server Nodes (floating spheres at vertices)
    const nodeCount = 20;
    const nodes: THREE.Mesh[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });

    const radius = 7;
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.x = radius * Math.cos(theta) * Math.sin(phi);
      node.position.y = radius * Math.sin(theta) * Math.sin(phi);
      node.position.z = radius * Math.cos(phi);
      networkGroup.add(node);
      nodes.push(node);
    }

    // 3. Network Connecting Lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.25,
    });

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < 6.5) {
          const points = [nodes[i].position, nodes[j].position];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeo, lineMat);
          networkGroup.add(line);
        }
      }
    }

    // 4. Subtle Ambient Cloud Particles
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / width - 0.5) * 2;
      mouseY = -((event.clientY - rect.top) / height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX * 0.4 - targetX) * 0.05;
      targetY += (mouseY * 0.4 - targetY) * 0.05;

      networkGroup.rotation.y = elapsedTime * 0.08 + targetX;
      networkGroup.rotation.x = Math.sin(elapsedTime * 0.05) * 0.15 - targetY;

      // Subtle float up and down
      networkGroup.position.y = Math.sin(elapsedTime * 0.6) * 0.6;
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (isMobileOrReduced) {
    // Highly optimized mobile & reduced motion fallback
    return (
      <div className="w-full h-full flex items-center justify-center relative select-none pointer-events-none">
        <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-indigo-500/5 blur-3xl animate-pulse-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border border-cyan-500/20 border-dashed animate-spin [animation-duration:35s]" />
          <div className="w-64 h-64 rounded-full border border-blue-500/15 animate-spin [animation-duration:50s] [animation-direction:reverse] absolute" />
        </div>
      </div>
    );
  }

  return <div ref={mountRef} className="w-full h-full relative cursor-grab active:cursor-grabbing" />;
}
