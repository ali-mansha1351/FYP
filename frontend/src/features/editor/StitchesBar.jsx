import styled from "styled-components";

import SlipStitch from "../../assets/slip.svg?react";
import ChainStitch from "../../assets/chain.svg?react";
import SingleCrochet from "../../assets/singleCrochet.svg?react";
import DoubleCrochet from "../../assets/double.svg?react";
import HalfDoubleCrochet from "../../assets/halfDouble.svg?react";
import TrebleCrochet from "../../assets/treble.svg?react";
import MagicRing from "../../assets/magicRing.svg?react";

const Stitchesbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
  padding: 20px;
`;

const StitchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  background-color: var(--primary-color);
  width: fit-content;
  cursor: pointer;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
`;

const StitchSymbolWrapper = styled.div`
  width: 50px;
  height: 50px;
  color: ${(props) => props.color || "#171516"};

  & > svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
    stroke: currentColor;
    stroke-width: 20;
  }
`;

export default function StitchesBar({handleAddNode, handleRemoveNode}) {
  return (
    <Stitchesbar>
      <StitchContainer>
        <StitchSymbolWrapper onClick={()=>handleAddNode('magicRing')} color="black">
          <MagicRing />
        </StitchSymbolWrapper>
      </StitchContainer>
      <StitchContainer>
        <StitchSymbolWrapper onClick={()=>handleAddNode('chain')}  color="black">
          <ChainStitch />
        </StitchSymbolWrapper>
      </StitchContainer>
      <StitchContainer>
        <StitchSymbolWrapper  onClick={()=>handleAddNode('slip')}  color="black">
          <SlipStitch />
        </StitchSymbolWrapper>
      </StitchContainer>
      <StitchContainer>
        <StitchSymbolWrapper  onClick={()=>handleAddNode('singleCrochet')}  color="black">
          <SingleCrochet />
        </StitchSymbolWrapper>
      </StitchContainer>
      <StitchContainer>
        <StitchSymbolWrapper  onClick={()=>handleAddNode('halfDouble')}  color="black">
          <HalfDoubleCrochet />
        </StitchSymbolWrapper>
      </StitchContainer>
      <StitchContainer>
        <StitchSymbolWrapper  onClick={()=>handleAddNode('double')}  color="black">
          <DoubleCrochet />
        </StitchSymbolWrapper>
      </StitchContainer>
      <StitchContainer>
        <StitchSymbolWrapper  onClick={()=>handleAddNode('treble')}  color="black">
          <TrebleCrochet />
        </StitchSymbolWrapper>
      </StitchContainer>
    </Stitchesbar>
  );
}
