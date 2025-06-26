import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { ChromePicker } from 'react-color';
import { useSelector, useDispatch } from "react-redux";
import { updateSelectedNodeColor, setGraphicalView, toggle3D, undo, redo, resetEditor } from "./editorSlice";
import NewPatternModal from "./NewPatternmodal"; 
import SavePatternModal from "./SavePatternModal"; // import the modal
import {useCreatePattern} from '../../hooks/usePattern'
import {
  FaUndo,
  FaRedo,
  FaProjectDiagram,
  FaThLarge,
  FaFileAlt,
  FaSave,
  FaTrashAlt,
  FaFileExport,
  FaFileImport
} from "react-icons/fa";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import { useNavigate } from "react-router-dom";



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
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
  &:hover {
    background-color: ${({ $disabled }) =>
      $disabled ? "transparent" : "rgba(0, 128, 0, 0.1)"};
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
  const canUndo = useSelector((state) => state.editor.history.length > 0);
  const canRedo = useSelector((state) => state.editor.future.length > 0);
  const canvas = useSelector((state) => state.editor.canvasRef);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false); 
  const pattern = useSelector((state) => state.editor.pattern);
  const {_id} = useSelector(state => state.user.userDetail)
  const create = useCreatePattern();
  const { mutate: savePattern, isPending: isSaving } = create;


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
  const navigate = useNavigate()
  
  const handleNewClick = () => setShowNewModal(true);
  const handleCancelNew = () => setShowNewModal(false);
  const handleConfirmNewPattern = () => {
    setShowNewModal(false);
    dispatch(resetEditor());

  };
  const handleSaveClick = () => {
  if (pattern.nodes.length === 0) {
    alert("Pattern must have at least one stitch.");
    return;
  }
  setShowSaveModal(true);
};

  const handleConfirmSave = (name) => {
    if (!canvas) {
      console.warn('Canvas not ready yet.');
      return;
    }
    const imageData = canvas.toDataURL('image/jpg');
    const data = { name, stitches: pattern.nodes, links: pattern.links, image: imageData };
    console.log('data to save', data)
    savePattern(data, {
      onSuccess: () => {
        toast.success("Pattern saved!");
        dispatch(resetEditor());
        navigate(`/user/${_id}`)
      },
      onError: () => {
        toast.error("Failed to save pattern.");
      },
    });
  };



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
    <>
    {isSaving && <Spinner overlay />}

    <NewPatternModal
      isOpen={showNewModal}
      onConfirm={handleConfirmNewPattern}
      onCancel={handleCancelNew}
    />
    <SavePatternModal
      isOpen={showSaveModal}
      onClose={() => setShowSaveModal(false)}
      onSave={handleConfirmSave}
      isLoading={isSaving}
    />


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
            <EditButton $disabled={!canUndo} onClick={() => dispatch(undo())}>
            <FaUndo />
            Undo
          </EditButton>
          <EditButton $disabled={!canRedo} onClick={() => dispatch(redo())}>
            <FaRedo />
            Redo
          </EditButton>

          </>
        )}
        {selectedMenu === 'File' && (
        <>
          <EditButton onClick={handleNewClick}>
            <FaFileAlt />
            New Pattern
          </EditButton>

          <EditButton onClick={() => console.log("Import Pattern")}>
            <FaFileImport />
            Import Pattern
          </EditButton>
          <EditButton onClick={handleSaveClick}>
            <FaSave />
            Save
          </EditButton>

          <EditButton onClick={() => console.log("Discard Changes")}>
            <FaTrashAlt />
            Discard
          </EditButton>
          <EditButton onClick={() => console.log("Generate Instructions")}>
            <FaFileExport />
            Generate Instructions
          </EditButton>
        </>
      )}



      </MenuItemsContainer>
    </Menubar>
    </>
  );
}
