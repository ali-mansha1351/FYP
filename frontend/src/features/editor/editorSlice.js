import { createSlice } from "@reduxjs/toolkit";
import { TOO_MANY_REQUESTS } from "http-status-codes";
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  pattern: { nodes: [], links: [] },
  currentLayerNumber: 0,
  selectedStitch: null,
  currentIndex:0,
  selectedNode: null,
  selectedMenu: null,
  expanded: false,
  graphicalView: false,
  primaryColor:'#0D0C0D'
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    startPattern: (state, action) => {
      const { stitch } = action.payload;
      const newNode = {
        type: stitch,
        layer: state.currentLayerNumber,
        start: true,
        previous: null,
        inserts: null,
        isIncrease: null,
        surroundingNodes: null,
        id: uuidv4(),
        index: state.currentIndex ,
        color: state.primaryColor
      };
      state.selectedNode = newNode
      state.pattern.nodes.push(newNode);
      console.log(JSON.parse(JSON.stringify(state.pattern)));
    },
    insertStitch: (state, action) => {
      const { node: nodeId  } = action.payload;
      if(state.selectedStitch === null){
        const n = state.pattern.nodes.find(node=>node.id === nodeId)
        state.selectedNode = n?n:null
        state.selectedMenu = 'Stitch'
        console.log(JSON.parse(JSON.stringify(state)));
        return;
      }
      
      const lastNode = state.pattern.nodes[state.pattern.nodes.length - 1];
      

      if(state.selectedStitch === 'slip'){
        const slipStitchLink = {
          source: lastNode.id,
          target: nodeId,
          inserts: true,
          slipStitch: true,
        };
        
        state.pattern.links.push(slipStitchLink)
      }
      else{
        const newNodeId = uuidv4();

        const newNode = {
          type: state.selectedStitch,
          layer: state.currentLayerNumber,
          start: false,
          previous: lastNode ? lastNode.id : null,
          inserts: nodeId,
          isIncrease: null,
          surroundingNodes: null,
          id: newNodeId,
          index: state.currentIndex +1,
          color: state.primaryColor
        };

        const prevLink = {
          source: lastNode.id,
          target: newNodeId,
          inserts: false,
          slipStitch: false,
        };
        if(state.selectedStitch !=='ch'){
          const insertLink = {
            source: nodeId,
            target: newNodeId,
            inserts: true,
            slipStitch: false,
          };
          state.pattern.links.push(insertLink)
        }
        state.selectedNode = newNode
        state.selectedMenu = 'Stitch'
        state.pattern.nodes.push(newNode)
        state.pattern.links.push(prevLink)
        state.currentIndex++
      }
      
      console.log(JSON.parse(JSON.stringify(state.pattern)));
      
    },
    selectStitch: (state, action) => {
      const { stitch } = action.payload;
      state.selectedStitch = stitch?stitch:null;
    },
    selectNode: (state, action) => {
      const {selectedNode} = action.payload
      const node = state.pattern.nodes.find(node=>node.id === selectedNode)
      state.selectedNode = node?node:null
      state.selectedMenu = 'Stitch'
      console.log('selectedNode',JSON.parse(JSON.stringify(node)))
    },
    updateSelectedNodeColor: (state, action) => {
      const newColor = action.payload;
      
      if (state.selectedNode) {
        state.selectedNode.color = newColor;
        state.primaryColor = newColor
    
        const nodeIndex = state.pattern.nodes.findIndex(node => node.id === state.selectedNode.id);
        if (nodeIndex !== -1) {
          state.pattern.nodes[nodeIndex].color = newColor;
        }
      }
    },
    setSelectedMenu: (state, action) => {
      if (state.selectedMenu === action.payload) {
        state.selectedMenu = null;  // Set to null if the selectedMenu is the same as the payload
      } else {
        state.selectedMenu = action.payload;
      }
    },
    toggleExpandCanvas: (state)=>{
      state.expanded = !state.expanded
    },
    setGraphicalView: (state)=>{
      state.graphicalView= !state.graphicalView
      console.log(JSON.parse(JSON.stringify(state)));
    }
    
    
  },
});

export const { startPattern, addStitch, insertStitch, selectStitch, selectNode, updateSelectedNodeColor
  , setSelectedMenu, toggleExpandCanvas, setGraphicalView
 } = editorSlice.actions;
export default editorSlice.reducer;
