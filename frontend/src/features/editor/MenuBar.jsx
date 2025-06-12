import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedMenu } from "./editorSlice";

const Menubar = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: var(--sixth-color);
  padding: 5px 30px;
  margin-bottom: 10px;
`;

const MenuItemsContainer = styled.div`
  display: flex;
  gap: 50px;
`;

const MenuItem = styled.div`
  font-size: 20px;
  cursor: pointer;
  padding: 8px 12px;
  border-bottom: ${({ selected }) => (selected ? "2px solid black" : "2px solid transparent")};
  transition: border-bottom 0.3s;
`;

export default function MenuBar() {
  const selected = useSelector(state=>state.editor.selectedMenu)
  const dispatch = useDispatch()
  return (
    <Menubar>
      <MenuItemsContainer>
        {["File", "Edit", "View", "Stitch"].map((item) => (
          <MenuItem
            key={item}
            selected={selected === item}
            onClick={() => dispatch(setSelectedMenu(item))}
          >
            {item}
          </MenuItem>
        ))}
      </MenuItemsContainer>
      <MenuItem>
        Export
      </MenuItem>
    </Menubar>
  );
}
