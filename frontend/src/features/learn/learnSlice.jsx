import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab:"",
  openMenu:true,
};

const learnSlice = createSlice({
  name: "learn",
  initialState,
  reducers: {
    SetActiveTab : (state, action) => {
        if(state.activeTab === action.payload){
            state.activeTab = ""
        }
        else{
            state.activeTab = action.payload
        }
    },
    ToggleMenu : (state) => {
        state.openMenu = !state.openMenu
    }
  },
});
export const {SetActiveTab, ToggleMenu} = learnSlice.actions;
export default learnSlice.reducer;
