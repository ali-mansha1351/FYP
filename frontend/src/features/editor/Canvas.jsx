import styled from "styled-components"
import expandIcon from '../../assets/expand.svg'
import StitchesBar from "./StitchesBar";

const Container= styled.div`
  display: flex;
`;
const CanvasContainer= styled.div`
  background-color: var(--primary-color);
  flex: 1;
  position: relative;
  box-sizing: border-box;
  margin:10px 20px;
  border-radius: 30px;
`;
const ExpandButton= styled.div`
  cursor: pointer;
  position: absolute;
  border-radius: 30px;
  background-color: var(--secondary-color);
  bottom: 30px;
  right: 30px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
`;

export default function Canvas() {
  return (
  <Container>
     <StitchesBar />
     <CanvasContainer>
        
        <ExpandButton>
            <img src={expandIcon} width={16} alt='expand icon' />
        </ExpandButton>
     </CanvasContainer>
     </Container>
  )
}
