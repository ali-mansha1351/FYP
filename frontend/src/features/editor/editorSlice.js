import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  pattern: { nodes: [], links: [] },
  currentLayerNumber: 0,
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
      };
      state.pattern.nodes.push(newNode);
      console.log(JSON.parse(JSON.stringify(state.pattern)));
    },
    addStitch: (state, action) => {
      const { stitch } = action.payload;
      const newNodeId = uuidv4();
      const lastNode = state.pattern.nodes[state.pattern.nodes.length - 1];

      const newNode = {
        type: stitch,
        layer: state.currentLayerNumber,
        start: false,
        previous: lastNode ? lastNode.id : null,
        inserts: null,
        isIncrease: null,
        surroundingNodes: null,
        id: newNodeId,
      };

      const newLink = {
        source: lastNode.id,
        target: newNodeId,
        inserts: false,
        slipStitch: false,
      };

      state.pattern.nodes.push(newNode);
      state.pattern.links.push(newLink);
    },
    insertStitch: (state, action) => {
      const { stitch, insertedInto } = action.payload;
      const newNodeId = uuidv4();
      const lastNode = state.pattern.nodes[state.pattern.nodes.length - 1];

      const newNode = {
        type: stitch,
        layer: state.currentLayerNumber,
        start: false,
        previous: lastNode ? lastNode.id : null,
        inserts: insertedInto,
        isIncrease: null,
        surroundingNodes: null,
        id: newNodeId,
      };

      const newLink = {
        source: insertedInto,
        target: newNodeId,
        inserts: true,
        slipStitch: false,
      };

      state.pattern.nodes.push(newNode);
      state.pattern.links.push(newLink);
    },
  },
});

export const { startPattern, addStitch, insertStitch } = editorSlice.actions;
export default editorSlice.reducer;
