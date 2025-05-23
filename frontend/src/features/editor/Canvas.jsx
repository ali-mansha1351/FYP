import styled from "styled-components";
import expandIcon from "../../assets/expand.svg";
import StitchesBar from "./StitchesBar";
import { FaPlus, FaMinus } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";
import BeginningModal from "./BeginningModal";
import { useDispatch, useSelector } from "react-redux";
import { toggleExpandCanvas, insertStitch, selectNode } from "./editorSlice";
import { FaExpand, FaCompress } from "react-icons/fa";

const Container = styled.div`
  display: flex;
  position: relative;
`;

const CanvasContainer = styled.div`
  width: 100%;
  background-color: var(--third-color);
  margin: ${({ expanded }) => (expanded ? "0px" : "10px 20px")};
  height: ${({ expanded, selectedMenu }) =>
    expanded
      ? "100%"  
      : selectedMenu
      ? "65vh"
      : "75vh"};
  border-radius: 30px;
  overflow: hidden;
  box-sizing: border-box;
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
`;
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
    
  const expanded = useSelector(state => state.editor.expanded)
  const selectedMenu = useSelector(state => state.editor.selectedMenu)
  const [isBeginningModalOpen, setIsBeginningModalOpen] = useState(isEmpty);
  const [selectedNode, setSelectedNode] = useState(null);
  const containerRef = useRef();
  const graphRef = useRef();
  const [textures, setTextures] = useState({});
  const patternData = useSelector((state) => state.editor.pattern);
  const hoverNodeRef = useRef(null);
  const dispatch = useDispatch();
  const stitchPaths = {
    ch: "/ch.svg",
    slip: "/slst.svg",
    sc: "/sc.svg",
    dc: "/dc.svg",
    hdc: "/hdc.svg",
    tr: "/tr.svg",
    mr: "/mr.svg",
  };

  const getNodeObject = (node) => {
    const texturePath = stitchPaths[node.type] || stitchPaths["ch"];

    if (node.type === "slip") {
      let geometry = new THREE.SphereGeometry(2, 16, 16);
      let material = new THREE.MeshBasicMaterial({ color: node.color });
      return new THREE.Mesh(geometry, material);
    } else {
      const obj = new THREE.Mesh(
        new THREE.SphereGeometry(7),
        new THREE.MeshBasicMaterial({
          depthWrite: false,
          transparent: true,
          opacity: 0,
        })
      );

      // Load the texture based on the node type
      const imgTexture = new THREE.TextureLoader().load(texturePath);
      const material = new THREE.SpriteMaterial({
        map: imgTexture,
        depthFunc: THREE.NotEqualDepth,
        color: node.color,
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(15, 15, 15);
      obj.add(sprite);

      return obj;
    }
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
      .nodeColor(() => "transparent")
      .linkWidth(1)
      .linkOpacity(1)
      .linkDirectionalArrowLength(0)
      .linkDirectionalArrowRelPos(1)
      .linkDirectionalArrowColor(() => "black")
      .showNavInfo(false)
      .nodeThreeObjectExtend(true)
      .nodeThreeObject((node) => getNodeObject(node))
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
      console.log("pppppppppppp", patternData);
      patternData.links?.forEach((link) => {
        if (!link.inserts) return;

        const sourceNode = graph
          .graphData()
          .nodes.find((n) => n.id === link.source);
        const targetNode = graph
          .graphData()
          .nodes.find((n) => n.id === link.target);
        if (!sourceNode || !targetNode || !sourceNode.__sprite) return;

        const vec = new THREE.Vector3(
          targetNode.x - sourceNode.x,
          targetNode.y - sourceNode.y,
          targetNode.z - sourceNode.z
        );
        const yAxis = new THREE.Vector3(0, 1, 0);
        const angle = vec.angleTo(yAxis);
        const rotationAngle =
          targetNode.x - sourceNode.x < 0 ? Math.PI + angle : Math.PI - angle;

        sourceNode.__sprite.material.rotation = rotationAngle;
      });
    });
  }, [patternData]);

  useEffect(() => {
    if (selectedNode) {
      dispatch(insertStitch({ insertedInto: selectedNode }));
      dispatch(selectNode({ selectedNode }));
    }
    return () => {
      setSelectedNode(null);
    };
  }, [selectedNode, dispatch]);

  const handleZoom = (zoomIn = true) => {
    if (!graphRef.current) return;

    const distance = graphRef.current
      .camera()
      .position.distanceTo(graphRef.current.scene().position);

    const zoomFactor = zoomIn ? 0.8 : 1.4;
    graphRef.current.camera().translateZ(distance * (zoomFactor - 1));
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
        <CanvasContainer expanded={expanded} selectedMenu={selectedMenu} ref={containerRef}></CanvasContainer>
        <ZoomButtonsContainer>
          <ZoomButton onClick={() => handleZoom(true)}>
            <FaPlus size={12} />
          </ZoomButton>
          <ZoomButton onClick={() => handleZoom(false)}>
            <FaMinus size={12} />
          </ZoomButton>
        </ZoomButtonsContainer>

        <ExpandButton onClick={() => dispatch(toggleExpandCanvas())}>
          {expanded ? <FaCompress size={16} /> : <FaExpand size={16} />}

        </ExpandButton>

      </Container>
    </>
  );
}
