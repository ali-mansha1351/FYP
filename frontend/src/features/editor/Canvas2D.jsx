import styled from "styled-components";
import StitchesBar from "./StitchesBar";
import { FaPlus, FaMinus, FaExpand, FaCompress } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import ForceGraph2D from "force-graph";
import BeginningModal from "./BeginningModal";
import { useDispatch, useSelector } from "react-redux";
import { toggleExpandCanvas, insertStitch } from "./editorSlice";
import CrochetCanvas from "./CanvasDrawingsFor2D";

const stitchCanvas = new CrochetCanvas();

const Container = styled.div`
  display: flex;
  position: relative;
`;

const CanvasContainer = styled.div`
  width: 100%;
  background-color: var(--third-color);
  margin: ${({ $expanded }) => ($expanded ? "0px" : "10px 20px")};
  height: ${({ $expanded, $selectedMenu }) =>
    $expanded ? "100%" : $selectedMenu ? "65vh" : "75vh"};
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

export default function Canvas3D() {
  const isEmpty =
    useSelector((state) => state.editor.pattern.nodes.length) === 0;
  const expanded = useSelector((state) => state.editor.expanded);
  const graphicalView = useSelector((state) => state.editor.graphicalView);
  const selectedMenu = useSelector((state) => state.editor.selectedMenu);
  const patternData = useSelector((state) => state.editor.pattern);
  const [isBeginningModalOpen, setIsBeginningModalOpen] = useState(isEmpty);
  const [selectedNode, setSelectedNode] = useState(null);
  const containerRef = useRef();
  const graphRef = useRef();
  const dispatch = useDispatch();
  const stitchDistances = {
    mr: 30,
    ch: 20,
    sc: 25,
    hdc: 35,
    dc: 45,
    tr: 55,
    dtr: 65,
    slst: 10,
    hole: 0,
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const graph = ForceGraph2D()(containerRef.current)
      .backgroundColor(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--third-color")
          .trim()
      )
      .nodeRelSize(5)
      .nodeColor(() => "transparent")
      .linkColor(() => "#ccc")
      .linkWidth(0)
      .nodeCanvasObjectMode(() => "before")
      .nodeCanvasObject((node, ctx) => {
        const color = node.color || "#333";
        const type = node.type || "ch";
        stitchCanvas.draw(type, ctx, node.x, node.y, color);
      })
      .linkCanvasObjectMode(() => "before")
      .linkCanvasObject((link, ctx) => {
        const source = link.source;
        const target = link.target;
        const xMid = (source.x + target.x) / 2;
        const yMid = (source.y + target.y) / 2;
        const color = source.color || "#000";
        if (link.slipStitch) {
          stitchCanvas.draw("slst", ctx, xMid, yMid, color);
        }
      })
      .onNodeClick((node) => {
        if (node?.id) setSelectedNode(node.id);
      });
    graph
      .d3Force("link")
      .distance((link) =>
        link.inserts || link.slipstitch ? stitchDistances[link.source.type] : 10
      );

    graphRef.current = graph;

    return () => {
      graph._destructor?.();
    };
  }, []);

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.graphData(JSON.parse(JSON.stringify(patternData)));
    }
  }, [patternData]);

  useEffect(() => {
    if (selectedNode) {
      dispatch(insertStitch({ node: selectedNode }));
    }
    return () => {
      setSelectedNode(null);
    };
  }, [selectedNode, dispatch]);

  useEffect(() => {
    return () => {
      if (graphRef.current) {
        graphRef.current.graphData({ nodes: [], links: [] });
      }
    };
  }, []);

  const handleZoom = (zoomIn = true) => {
    if (!graphRef.current) return;
    const zoomAmount = zoomIn ? 1.2 : 0.8;
    graphRef.current.zoom(graphRef.current.zoom() * zoomAmount, 300);
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
        <CanvasContainer
          $expanded={expanded}
          $selectedMenu={selectedMenu}
          ref={containerRef}
        />
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
