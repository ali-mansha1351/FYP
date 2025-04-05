import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuIcon from '../assets/menu-icon.png'
const Icon = styled.img`
  width: 40px;
  cursor: pointer;
`;

const MenuWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownMenuWrapper = styled.ul`
  position: absolute;
  top: 100%;
  right: 0;
  list-style: none;
  margin: 0;
  padding: 10px;
  background-color: var(--third-color);
  border: 1px solid #ddd;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  min-width: 160px;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  z-index: 100;
`;

const DropdownItem = styled.li`
  padding: 8px 16px;
  cursor: pointer;
  border: 1px solid var(--third-color);

  &:hover {
    border: 1px solid black;
  }
`;

function DropdownMenu({items = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleItemClick = (item) => {
    setIsOpen(false);
    if (item.path) {
      navigate(item.path);
    } else if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <MenuWrapper className="dropdown">
      <Icon src={MenuIcon} onClick={toggleMenu} />
      <DropdownMenuWrapper $isOpen={isOpen}>
        {items.map((item, index) => (
          <DropdownItem key={index} onClick={() => handleItemClick(item)}>
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenuWrapper>
    </MenuWrapper>
  );
}

export default DropdownMenu;
