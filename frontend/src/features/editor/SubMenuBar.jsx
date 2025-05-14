import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { ChromePicker } from 'react-color';
import { useSelector, useDispatch } from "react-redux";
import { updateSelectedNodeColor } from "./editorSlice";

const Menubar = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: var(--sixth-color);
  padding: 10px 30px;
  margin-bottom: 20px;
`;

const MenuItemsContainer = styled.div`
  display: flex;
  gap: 50px;
  align-items: center;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  gap: 6px;
`;

const ColorInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border: 0.3px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background: #f8f9fa;
  cursor: pointer;
  position: relative;
`;

const ColorPreview = styled.div`
  width: 20px;
  height: 20px;
  border: 0.5px solid rgba(87, 98, 114, 1);
  border-radius: 3px;
  background: ${(props) => props.$color};
`;

const ColorText = styled.span`
  font-size: 11px;
  font-weight: 400;
  color: rgba(4, 4, 4, 1);
`;

const PickerContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 2;
`;

export default function SubMenuBar({ menu }) {
  const selectedNode = useSelector((state) => state.editor.selectedNode);
  const dispatch = useDispatch();

  const stitchColor = selectedNode?.color
    ? typeof selectedNode.color === 'string'
      ? selectedNode.color
      : `#${selectedNode.color.toString(16).padStart(6, '0')}`
    : '#ffffff';

  const [pickerVisible, setPickerVisible] = useState(false);
  const [tempColor, setTempColor] = useState(stitchColor);
  const pickerRef = useRef(null);

  // Sync local color when selectedNode changes
  useEffect(() => {
    setTempColor(stitchColor);
  }, [stitchColor]);

  // Close picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setPickerVisible(false);
        if (tempColor !== stitchColor) {
          dispatch(updateSelectedNodeColor(tempColor));
        }
      }
    };

    if (pickerVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pickerVisible, tempColor, stitchColor, dispatch]);

  const togglePicker = (e) => {
    e.stopPropagation();
    setPickerVisible((prev) => !prev);
  };

  const handleColorChange = (color) => {
    setTempColor(color.hex);
  };

  return (
    <Menubar>
      <MenuItemsContainer>
        {menu === 'Stitch' && (
          <MenuItem>
            Stitch Color
            <ColorInput onClick={togglePicker}>
              <ColorPreview $color={tempColor} />
              <ColorText>{tempColor.toUpperCase()}</ColorText>
              {pickerVisible && (
                <PickerContainer ref={pickerRef} onClick={(e) => e.stopPropagation()}>
                  <ChromePicker color={tempColor} onChange={handleColorChange} />
                </PickerContainer>
              )}
            </ColorInput>
          </MenuItem>
        )}
      </MenuItemsContainer>
    </Menubar>
  );
}
