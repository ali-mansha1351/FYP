import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  pattern: { nodes: [], links: [] },
  currentLayerNumber: 0,
  selectedStitch: null,
  currentIndex:0,
  selectedNode: null,
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
        color: 0xffc0cb
      };
      state.selectedNode = newNode
      state.pattern.nodes.push(newNode);
      console.log(JSON.parse(JSON.stringify(state.pattern)));
    },
    insertStitch: (state, action) => {
      
      if(state.selectedStitch === null)
        return;
      
      const lastNode = state.pattern.nodes[state.pattern.nodes.length - 1];
      const { insertedInto } = action.payload;

      if(state.selectedStitch === 'slip'){
        const slipStitchLink = {
          source: lastNode.id,
          target: insertedInto,
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
          inserts: insertedInto,
          isIncrease: null,
          surroundingNodes: null,
          id: newNodeId,
          index: state.currentIndex +1,
          color: 0xffc0cb
        };

        const prevLink = {
          source: lastNode.id,
          target: newNodeId,
          inserts: false,
          slipStitch: false,
        };
        if(state.selectedStitch !=='ch'){
          const insertLink = {
            source: insertedInto,
            target: newNodeId,
            inserts: true,
            slipStitch: false,
          };
          state.pattern.links.push(insertLink)
        }
        state.selectedNode = newNode
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
      console.log('selectedNode',JSON.parse(JSON.stringify(node)))
    },
    updateSelectedNodeColor: (state, action) => {
      const newColor = action.payload;
    
      if (state.selectedNode) {
        state.selectedNode.color = newColor;
    
        const nodeIndex = state.pattern.nodes.findIndex(node => node.id === state.selectedNode.id);
        if (nodeIndex !== -1) {
          state.pattern.nodes[nodeIndex].color = newColor;
        }
      }
    }
    
  },
});

export const { startPattern, addStitch, insertStitch, selectStitch, selectNode, updateSelectedNodeColor } = editorSlice.actions;
export default editorSlice.reducer;
