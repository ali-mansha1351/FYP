import React, { useState } from 'react'
import styled from 'styled-components';
import BookOpenIcon from '../../assets/book-open.png'
import AskAIIcon from '../../assets/ask-ai.png'
import UsingEditorIcon from '../../assets/using-editor.png'
import PencilIcon from '../../assets/pencil.png'
import MenuIcon from '../../assets/menu-icon.png'
const SidebarContainer= styled.div`
    display: flex ;
    flex-direction: column;
    background-color: var(--primary-color);
    padding: 10px;
    align-items: center;
    border-radius: 10px;
`
const TitleContainer = styled.div`
    display: flex;
    cursor: pointer;
    margin-top: 10px;
`
const Title = styled.div`
    font-size: 26px;
    text-transform: capitalize;
    text-align: center;
    padding: 10px;
`
const MenuContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-inline: ${({ $openMenu }) => ($openMenu ? '30px' : '10px')};
    margin-top: 20px;
    gap: 10px;
`
const Menu = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ $active }) => ($active ? 'green' : 'black')};
  background-color: ${({ $active }) => ($active ? 'var(--secondary-color)' : 'transparent')};
  padding: 20px;
  gap: 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
`;

const MenuText = styled.div`
  text-transform: capitalize;
  padding-inline: 20px;
  display: ${({ $openMenu }) => ($openMenu ? 'block' : 'none')};
`;

const Icon = styled.img`
    
`

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('');
  const [openMenu, setOpenMenu] = useState(true)
  const toggleMenu = () =>{
    setOpenMenu(!openMenu)
  }
  return (
    <SidebarContainer>
        <TitleContainer onClick={toggleMenu} $openMenu={openMenu}>
            {openMenu 
            ?<Title> skill development </Title>
            :<Icon src={MenuIcon} width={50} />
            }
        </TitleContainer>
        <MenuContainer $openMenu={openMenu}>
            <Menu onClick={() => setActiveTab('crochet basics')} $active={activeTab === 'crochet basics'}>
                <Icon src={PencilIcon} width={18} alt='crochet basics icon'/>
                <MenuText $openMenu={openMenu}>crochet basics</MenuText>
            </Menu>
            <Menu onClick={() => setActiveTab('using editor')} $active={activeTab === 'using editor'}>
                <Icon src={UsingEditorIcon} width={18} alt='using editor icon'/>
                <MenuText $openMenu={openMenu}>using editor</MenuText>
            </Menu>
            <Menu onClick={() => setActiveTab('other resources')} $active={activeTab === 'other resources'}>
                <Icon src={BookOpenIcon} width={18} alt='other resources icon'/>
                <MenuText $openMenu={openMenu}>other resources</MenuText>
            </Menu>
            <Menu onClick={() => setActiveTab('ask AI')} $active={activeTab === 'ask AI'}>
                <Icon src={AskAIIcon} width={20} alt='ASK AI icon'/>
                <MenuText $openMenu={openMenu}>ask AI</MenuText>
            </Menu>
        </MenuContainer>
    </SidebarContainer>
  )
}
