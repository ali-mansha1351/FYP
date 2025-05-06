import React from 'react'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Header from "../../ui/Header";
import styled from 'styled-components';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
`
const BodyContainer = styled.div`
    display: flex;
    width: 100%;
    padding: 10px;
    flex: 1;
    gap: 10px;
`
export default function Index() {
    const navigate = useNavigate()
    const user = useSelector((store) => store.user);
    const navItemsForLggedIn =  [
    { label: "Editor", path: "/editor" },
    { label: "Community", path: "/" },
    { label: "Profile", path: "/user/me" },
  ];
  return (
    <Container>
        {user.isLoggedIn ?
                    <Header navItems={navItemsForLggedIn}/>
                :
                <Header navItems={navItems}/>
            }
        <BodyContainer>
            <Sidebar />
            <MainContent />
        </BodyContainer>
    </Container>
  )
}
