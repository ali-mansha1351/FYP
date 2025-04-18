import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   pattern: {nodes:[], links:[]},
   currentLayerNumber: 0,
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    startPattern:(state, action) => {
        const {stitch} = action.payload
        
    }

  },
});

export const {startPattern} = editorSlice.actions
export default editorSlice.reducer;
