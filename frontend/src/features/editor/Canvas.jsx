import styled from "styled-components";
import expandIcon from "../../assets/expand.svg";
import StitchesBar from "./StitchesBar";
import React, { useEffect, useRef, useState } from "react";
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";
import BeginningModal from "./BeginningModal";
import { useDispatch, useSelector } from "react-redux";
import { insertStitch } from "./editorSlice";
const Container = styled.div`
  display: flex;
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 60vh;
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

export default function Canvas() {
  const isEmpty = useSelector((state) => state.editor.pattern.nodes.length) === 0;
  const [isBeginningModalOpen, setIsBeginningModalOpen] = useState(isEmpty);
  const containerRef = useRef();
  const graphRef = useRef();
  const [textures, setTextures] = useState({});
  const patternData = useSelector((state) => state.editor.pattern);
  const hoverNodeRef = useRef(null);
  const dispatch = useDispatch()
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
    if (Object.keys(textures).length === 0) return;

    const bgColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--third-color")
      .trim();

    const graph = ForceGraph3D()(containerRef.current)
      .graphData(JSON.parse(JSON.stringify(patternData)))
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
        node.__sprite = sprite; // Save reference for hover effects
        return sprite;
      })
      .onNodeHover((node) => {
        // Unhighlight previous
        if (hoverNodeRef.current && hoverNodeRef.current.__sprite) {
          hoverNodeRef.current.__sprite.material.opacity = 1; // Reset opacity
          hoverNodeRef.current.__sprite.material.color.set(0x000000); // Reset color
          hoverNodeRef.current.__sprite.material.needsUpdate = true;
        }
      
        // Highlight new one
        if (node && node.__sprite) {
          node.__sprite.material.opacity = 0.6; // Make it semi-transparent
          node.__sprite.material.color.set(0x00ffff); // Light grayish color
          node.__sprite.material.needsUpdate = true;
        }
      
        hoverNodeRef.current = node;
      })
      .onNodeClick((node) => {
        if (node && node.id) {
          dispatch(insertStitch({ insertedInto: node.id }));
        }
      })
      
      
      

    graphRef.current = graph;
  }, [patternData, textures]);

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
        <ExpandButton>
          <img src={expandIcon} width={16} alt="expand icon" />
        </ExpandButton>
      </Container>
    </>
  );
}
