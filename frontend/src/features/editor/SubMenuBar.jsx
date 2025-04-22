import styled from "styled-components"
import { useState } from "react";
import { ChromePicker } from 'react-color';

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
`;

const ColorInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  margin-top: 5px;
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
  const [stitchColor, setStitchColor] = useState('#000000');
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleColorChange = (newColor) => {
    setStitchColor(newColor.hex);
  };

  return (
    <Menubar>
      <MenuItemsContainer>
        {menu === 'Stitch' && (
          <MenuItem>
            Stitch Color
            <ColorInput onClick={(e) => { 
              e.stopPropagation(); 
              setPickerVisible(!pickerVisible); 
            }}>
              <ColorPreview $color={stitchColor} />
              <ColorText>{stitchColor.toUpperCase()}</ColorText>
              {pickerVisible && (
                <PickerContainer onClick={(e) => e.stopPropagation()}>
                  <ChromePicker color={stitchColor} onChange={handleColorChange} />
                </PickerContainer>
              )}
            </ColorInput>
          </MenuItem>
        )}
      </MenuItemsContainer>
    </Menubar>
  );
}
