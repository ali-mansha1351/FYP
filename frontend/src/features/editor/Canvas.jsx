import styled from "styled-components";
import expandIcon from '../../assets/expand.svg';
import StitchesBar from "./StitchesBar";
import React, { useEffect, useRef, useState } from 'react';
import ForceGraph3D from '3d-force-graph';

import * as THREE from 'three';

const Container = styled.div`
  display: flex;
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 67vh;
  background-color: var(--third-color);
  position: relative;
  margin: 10px 20px;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
`;

const ExpandButton = styled.div`
  cursor: pointer;
  position: absolute;
  border-radius: 30px;
  background-color: var(--secondary-color);
  bottom: 70px;
  right: 40px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 9999;
`;

const ButtonBar = styled.div`
  position: absolute;
  top: 20px;
  left: 30px;
  z-index: 10000;
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: #ffffffaa;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
`;

export default function Canvas() {
  const containerRef = useRef();
  const graphRef = useRef();
  const [textures, setTextures] = useState({});
  const [slipStitchTarget, setSlipStitchTarget] = useState(null); 

  const [data, setData] = useState({
    nodes: [
      { id: 'Node 1', name:'chain' },
      { id: 'Node 2', name:'chain' },
    ],
    links: [
      { source: 'Node 1', target: 'Node 2' },
    ]
  });
  const stitchPaths = {
    chain: '/chain.svg',
    slip: '/slip.svg',
    singleCrochet: '/singleCrochet.svg',
    double: '/double.svg',
    halfDouble: '/halfDouble.svg',
    treble: '/treble.svg',
    magicRing: '/magicRing.svg'
  };
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const loadedTextures = {};
    
    Promise.all(
      Object.entries(stitchPaths).map(([name, path]) => {
        return new Promise((resolve) => {
          loader.load(path, (texture) => {
            loadedTextures[name] = texture;
            resolve();
          });
        });
      })
    ).then(() => {
      setTextures(loadedTextures);
    });
  }, []);

  
  useEffect(() => {
    if (Object.keys(textures).length === 0) return; // Wait for textures to load

    const bgColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--third-color')
      .trim();

    const graph = ForceGraph3D()(containerRef.current)
      .graphData(data)
      .backgroundColor(bgColor)
      .nodeAutoColorBy('id')
      .linkColor(() => 'black')  
      .linkDirectionalArrowLength(0)
      .linkDirectionalArrowRelPos(1)
      .linkDirectionalArrowColor(() => 'black')
      .showNavInfo(false)
      .onNodeClick(node => {
        if (slipStitchTarget) {
          const lastNode = data.nodes[data.nodes.length - 1];
          
          if (lastNode && lastNode.id !== node.id) {
            const newLink={ 
              source: lastNode.id, 
              target: node.id 
            }
            console.log(newLink)
            console.log(newLink)
            setData(prev => ({
              nodes: prev.nodes,
              links: [...prev.links, newLink]
            }));
          }
          
          setSlipStitchTarget(false);
        } else {
          alert(`Clicked node: ${node.id}`);
        }
      })
      .nodeThreeObject(node => {
        const texture = textures[node.name] || textures.chain; 
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
          map: texture,
          color: 0x000000,
          transparent: true,
          opacity: 1
        }));
        sprite.scale.set(36, 36, 1);
        return sprite;
      });

    graphRef.current = graph;

    const handleResize = () => {
      if (containerRef.current && graphRef.current) {
        graphRef.current
          .width(containerRef.current.clientWidth)
          .height(containerRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (graphRef.current) {
        graphRef.current._destructor();
        containerRef.current.innerHTML = '';
      }
    };
  }, [data, textures]);


  // Update graph when data changes
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.graphData(data);
    }
  }, [data]);

  // Add a new node
  const handleAddNode = (name) => {
    if (name === 'slip') {
      setSlipStitchTarget(true);
      console.log('slip')
      return;
    }
    const newNodeId = `Node ${data.nodes.length + 1}`;
    const newNode = { id: newNodeId, name };
    console.log('new node', newNode)
    const lastNodeId = data.nodes[data.nodes.length - 1]?.id;
    const newLink = { source: lastNodeId, target: newNodeId };
  
    setData(prev => ({
      nodes: [...prev.nodes, newNode],
      links: [...prev.links, newLink]
    }));
    
    console.log(data);
  };
  

  // Remove the last node
  const handleRemoveNode = () => {
    if (data.nodes.length <= 2) return; // Keep at least two nodes for demo
    
    // Get the last node's ID
    const nodeToRemove = data.nodes[data.nodes.length - 1].id;
    console.log("Node to remove:", nodeToRemove);
  
    // Filter out the node and the links connected to it
    setData(prev => {
      const updatedNodes = prev.nodes.filter(n => n.id !== nodeToRemove);
      console.log("Updated Nodes:", updatedNodes);
  
      const updatedLinks = prev.links.filter(l => {
        const linkRemoved =  l.source.id!== nodeToRemove && l.target.id !== nodeToRemove;
        return linkRemoved;
      });
      return {
        nodes: updatedNodes,
        links: updatedLinks,
      };
    });
  };
  
  return (
    <Container>
      <StitchesBar  handleAddNode={handleAddNode} handleRemoveNode={handleRemoveNode}/>
      <CanvasContainer ref={containerRef}>
       
      </CanvasContainer>
        <ExpandButton>
          <img src={expandIcon} width={16} alt='expand icon' />
        </ExpandButton>
    </Container>
  );
}
