import styled from "styled-components";
import expandIcon from "../../assets/expand.svg";
import StitchesBar from "./StitchesBar";
import { FaPlus, FaMinus } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";
import BeginningModal from "./BeginningModal";
import { useDispatch, useSelector } from "react-redux";
import { insertStitch } from "./editorSlice";
const Container = styled.div`
  display: flex;
  position: relative;
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 65vh;
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
  bottom: 35px;
  right: 40px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 99;
  &:hover {
    background-color: var(--primary-color);
  }
`;

const ZoomButtonsContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 99;
  top: 28px;
  right: 40px;
`
const ZoomButton = styled.div`
  cursor: pointer;
  padding: 10px;
  background-color: var(--secondary-color);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: var(--primary-color);
  }
`;


export default function Canvas() {
  const isEmpty =
    useSelector((state) => state.editor.pattern.nodes.length) === 0;
  const [isBeginningModalOpen, setIsBeginningModalOpen] = useState(isEmpty);
  const [selectedNode, setSelectedNode] = useState(null);
  const containerRef = useRef();
  const graphRef = useRef();
  const [textures, setTextures] = useState({});
  const patternData = useSelector((state) => state.editor.pattern);
  const hoverNodeRef = useRef(null);
  const dispatch = useDispatch();
  const stitchPaths = {
    ch: "/chain.svg",
    slip: "/slip.svg",
    sc: "/singleCrochet.svg",
    dc: "/double.svg",
    hdc: "/halfDouble.svg",
    tr: "/treble.svg",
    mr: "/magicRing.svg",
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
    if (!containerRef.current || !Object.keys(textures).length) return;
  
    const bgColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--third-color")
      .trim();
  
    const graph = ForceGraph3D()(containerRef.current)
      .backgroundColor(bgColor)
      .nodeAutoColorBy("id")
      .linkColor(() => "black")
      .linkWidth(1)
      .linkOpacity(1)
      .linkDirectionalArrowLength(0)
      .linkDirectionalArrowRelPos(1)
      .linkDirectionalArrowColor(() => "black")
      .showNavInfo(false)
      .nodeThreeObject((node) => {
        const texture = textures[node.type] || textures.chain;
        const spriteMaterial = new THREE.SpriteMaterial({
          map: texture,
          color: 0x000000,
          transparent: true,
          opacity: 1,
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(36, 36, 1);
        node.__sprite = sprite;
        return sprite;
      })
      .onNodeHover((node) => {
        if (hoverNodeRef.current?.__sprite) {
          hoverNodeRef.current.__sprite.material.opacity = 1;
          hoverNodeRef.current.__sprite.material.color.set(0x000000);
          hoverNodeRef.current.__sprite.material.needsUpdate = true;
        }
  
        if (node?.__sprite) {
          node.__sprite.material.opacity = 0.6;
          node.__sprite.material.color.set(0x00ffff);
          node.__sprite.material.needsUpdate = true;
        }
  
        hoverNodeRef.current = node;
      })
      .onNodeClick((node) => {
        if (node?.id) setSelectedNode(node.id);
      });
  
    graphRef.current = graph;
  }, [textures]);
  
  useEffect(() => {
    if (!graphRef.current) return;
  
    const graph = graphRef.current;
    graph.graphData(JSON.parse(JSON.stringify(patternData)));
  
    graph.onEngineStop(() => {
      patternData.links?.forEach((link) => {
        if (!link.inserts) return;
  
        const sourceNode = graph.graphData().nodes.find(n => n.id === link.source);
        const targetNode = graph.graphData().nodes.find(n => n.id === link.target);
        if (!sourceNode || !targetNode || !sourceNode.__sprite) return;
  
        const vec = new THREE.Vector3(
          targetNode.x - sourceNode.x,
          targetNode.y - sourceNode.y,
          targetNode.z - sourceNode.z
        );
        const yAxis = new THREE.Vector3(0, 1, 0);
        const angle = vec.angleTo(yAxis);
        const rotationAngle = (targetNode.x - sourceNode.x) < 0
          ? Math.PI + angle
          : Math.PI - angle;
  
        sourceNode.__sprite.material.rotation = rotationAngle;
      });
    });
  }, [patternData]);
  

  useEffect(() => {
    if (selectedNode) dispatch(insertStitch({ insertedInto: selectedNode }));
    return () => {
      setSelectedNode(null);
    };
  }, [selectedNode, dispatch]);

  const handleZoom = (zoomIn = true) => {
    if (!graphRef.current) return;
  
    const distance = graphRef.current.camera().position.distanceTo(
      graphRef.current.scene().position
    );
  
    const zoomFactor = zoomIn ? 0.8 : 1.4; 
    graphRef.current.camera().translateZ((distance * (zoomFactor - 1)));
  };
  

  return (
    <>
      {isBeginningModalOpen && (
        <BeginningModal
          onClose={() => setIsBeginningModalOpen(false)}
          isOpen={isBeginningModalOpen}
        />
      )}
      <Container>
        <StitchesBar />
        <CanvasContainer ref={containerRef}></CanvasContainer>
        <ZoomButtonsContainer>
          <ZoomButton onClick={() => handleZoom(true)}>
            <FaPlus size={12} />
          </ZoomButton>
          <ZoomButton onClick={() => handleZoom(false)}>
            <FaMinus size={12} />
          </ZoomButton>
        </ZoomButtonsContainer>


        <ExpandButton>
          <img src={expandIcon} width={16} alt="expand icon" />
        </ExpandButton>
      </Container>
    </>
  );
}
