import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { ChromePicker } from 'react-color';
import { useSelector, useDispatch } from "react-redux";
import { updateSelectedNodeColor, setGraphicalView, toggle3D } from "./editorSlice";
import { FaUndo, FaRedo, FaProjectDiagram, FaThLarge } from "react-icons/fa";

const Menubar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--sixth-color);
  padding: 8px 36px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const MenuItemsContainer = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  gap: 10px;
`;

const ViewButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: 15px;
  font-weight: 500; 
  background-color: ${({ $active }) =>
    $active ? 'rgba(0, 0, 255, 0.1)' : 'transparent'};
  border-radius: 6px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 255, 0.1);
  }
`;

const EditButton = styled(ViewButton)`
  &:hover {
    background-color: rgba(0, 128, 0, 0.1); /* Light green hover */
  }
`;

const ColorInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 2px 3px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background: #f1f3f5;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba(0, 0, 0, 0.25);
  }
`;

const ColorPreview = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: ${(props) => props.$color};
`;

const ColorText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #333;
  letter-spacing: 0.3px;
`;

const PickerContainer = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  z-index: 5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
`;

export default function SubMenuBar() {
  const selectedNode = useSelector((state) => state.editor.selectedNode);
  const selectedMenu = useSelector((state) => state.editor.selectedMenu);
  const graphicalView = useSelector((state) => state.editor.graphicalView);
  const view3D = useSelector((state) => state.editor.view3D);
  const dispatch = useDispatch();

  const stitchColor = selectedNode?.color
    ? typeof selectedNode.color === 'string'
      ? selectedNode.color
      : `#${selectedNode.color.toString(16).padStart(6, '0')}`
    : '#ffffff';

  const [pickerVisible, setPickerVisible] = useState(false);
  const [tempColor, setTempColor] = useState(stitchColor);
  const pickerRef = useRef(null);

  useEffect(() => {
    setTempColor(stitchColor);
  }, [stitchColor]);

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
  if (!pickerVisible) {
    setPickerVisible(true);
  }
};


  const handleColorChange = (color) => {
    setTempColor(color.hex);
  };

  if (selectedMenu === null) return;

  return (
    <Menubar>
      <MenuItemsContainer>
        {selectedMenu === 'Stitch' && (
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

        {selectedMenu === 'View' && (
          <>
            <ViewButton $active={graphicalView} onClick={() => dispatch(setGraphicalView())}>
              <FaProjectDiagram />
              Graphical View
            </ViewButton>

            <ViewButton onClick={() => dispatch(toggle3D())}>
              <FaThLarge />
              {view3D ? 'Switch to 2D' : 'Switch to 3D'}
            </ViewButton>
          </>
        )}

        {selectedMenu === 'Edit' && (
          <>
            <EditButton>
              <FaUndo />
              Undo
            </EditButton>
            <EditButton>
              <FaRedo />
              Redo
            </EditButton>
          </>
        )}
      </MenuItemsContainer>
    </Menubar>
  );
}
