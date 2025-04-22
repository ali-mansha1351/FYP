import styled from "styled-components"
const Menubar= styled.div`
  display: flex;
  justify-content: space-between;
  background-color: var(--sixth-color);
  padding: 10px 30px;
  margin-bottom: 10px;
`;
const MenuItemsContainer= styled.div`
  display: flex;
  gap: 50px;
`;
const MenuItem= styled.div`
  font-size: 20px;
  cursor: pointer;
`;
export default function MenuBar() {
  return (
    <Menubar>
        <MenuItemsContainer>
         <MenuItem>
            File
         </MenuItem>
         <MenuItem>
            Edit
         </MenuItem>
         <MenuItem>
            View
         </MenuItem>
         <MenuItem>
            Stitch
         </MenuItem>
        </MenuItemsContainer>
        <MenuItem>
            Export
        </MenuItem>
    </Menubar>
  )
}
