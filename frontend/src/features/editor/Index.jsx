import Canvas from "./Canvas";
import MenuBar from "./MenuBar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Header from "../../ui/Header";
import styled from "styled-components";
import SubMenuBar from "./SubMenuBar";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 95vh;
`

export default function Index() {
  const expanded = useSelector(state => state.editor.expanded)
  const user = useSelector((store) => store.user);
  const navItemsForLggedIn = [
    { label: "Learn", path: "/learn" },
    { label: "Community", path: "/" },
    { label: "Profile", path: "/user/me" },
  ];
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Register", path: "/register" },
    { label: "Login", path: "/login" },
  ];

  return (<Container>
    {!expanded && <>
      {user.isLoggedIn ?
            <Header navItems={navItemsForLggedIn}/>
           :
           <Header navItems={navItems}/>
      }
    <MenuBar />
    <SubMenuBar />
    </>
    }
    <Canvas />
    </Container>
  );
}
