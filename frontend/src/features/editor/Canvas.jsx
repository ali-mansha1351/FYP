import styled from "styled-components";
import expandIcon from "../../assets/expand.svg";
import StitchesBar from "./StitchesBar";
import React, { useEffect, useRef, useState } from "react";
import ForceGraph3D from "3d-force-graph";

import * as THREE from "three";
import BeginningModal from "./BeginningModal";
import { useSelector } from "react-redux";

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
  const isEmpty =
    useSelector((state) => state.editor.pattern.nodes.length) === 0;
  const [isBeginningModalOpen, setIsBeginningModalOpen] = useState(isEmpty);
  const containerRef = useRef();
  const graphRef = useRef();
  const [textures, setTextures] = useState({});
  const [slipStitchTarget, setSlipStitchTarget] = useState(null);
  const patternData = useSelector((state) => state.editor.pattern);
  const stitchPaths = {
    ch: "/chain.svg",
    slip: "/slip.svg",
    singleCrochet: "/singleCrochet.svg",
    double: "/double.svg",
    halfDouble: "/halfDouble.svg",
    treble: "/treble.svg",
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
    if (Object.keys(textures).length === 0) return; // Wait for textures to load

    const bgColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--third-color")
      .trim();

    const graph = ForceGraph3D()(containerRef.current)
      .graphData(JSON.parse(JSON.stringify(patternData)))
      .backgroundColor(bgColor)
      .nodeAutoColorBy("id")
      .linkColor(() => "black")
      .linkDirectionalArrowLength(0)
      .linkDirectionalArrowRelPos(1)
      .linkDirectionalArrowColor(() => "black")
      .showNavInfo(false)
      .nodeThreeObject((node) => {
        const texture = textures[node.type] || textures.chain;
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: texture,
            color: 0x000000,
            transparent: true,
            opacity: 1,
          })
        );
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

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (graphRef.current) {
        graphRef.current._destructor();
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
      }
    };
  }, [patternData, textures]);

  // Update graph when pattern data changes
  useEffect(() => {
    if (graphRef.current) {
      const clonedData = {
        nodes: patternData.nodes.map((n) => ({ ...n })),
        links: patternData.links.map((l) => ({ ...l })),
      };
      graphRef.current.graphData(clonedData);
    }
  }, [patternData]);

  // Add a new node
  const handleAddNode = (name) => {
    if (name === "slip") {
      setSlipStitchTarget(true);
      console.log("slip");
      return;
    }
    const newNodeId = `Node ${patternData?.nodes.length + 1}`;
    const newNode = { id: newNodeId, name };
    console.log("new node", newNode);
    const lastNodeId = patternData?.nodes[patternData?.nodes.length - 1]?.id;
    const newLink = { source: lastNodeId, target: newNodeId };

    console.log(patternData);
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
        <ExpandButton>
          <img src={expandIcon} width={16} alt="expand icon" />
        </ExpandButton>
      </Container>
    </>
  );
}
