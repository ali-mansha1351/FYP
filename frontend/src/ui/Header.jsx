import styled from "styled-components";
import DropdownMenu from "./DropdownMenu";
import { useNavigate } from "react-router-dom";
const Title = styled.div`
  font-size: 40px;
  cursor: pointer;
`;

const Cont = styled.div`
  display: flex;
  gap: 20px;
`;
const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: var(--primary-color);
  padding: 10px 20px;

  .dropdown {
    display: none;
  }
  @media (max-width: 900px) {
    .dropdown {
      display: block;
    }
    button {
      display: none;
    }
  }
`;
const HeaderButton = styled.button`
  background-color: var(--secondary-color);
  font-size: 20px;
  width: 130px;
  display: flex;
  border: 2px solid var(--secondary-color);
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  &:hover {
    border: 2px solid black;
  }
`;
function Header({ navItems }) {
  const navigate = useNavigate();
  return (
    <HeaderBar>
      <Title onClick={() => navigate("/")}>Crochet Pattern Pro</Title>
      <Cont>
        <DropdownMenu items={navItems} />
        {navItems.map((item, index) => (
          <HeaderButton key={index} onClick={() => navigate(item.path)}>
            {item.label}
          </HeaderButton>
        ))}
      </Cont>
    </HeaderBar>
  );
}
export default Header;
