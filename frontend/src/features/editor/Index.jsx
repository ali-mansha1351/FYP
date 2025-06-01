import Canvas3D from "./Canvas3D";
import Canvas2D from "./Canvas2D";
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
`;

export default function Index() {
  const expanded = useSelector(state => state.editor.expanded)
  const view3D = useSelector((state) => state.editor.view3D);
  const user = useSelector((store) => store.user);
  
  const navItemsForLggedIn = [
    { label: "Learn", path: "/learn" },
    { label: "Community", path: "/user/newsfeed" },
    { label: `${name}`, path: "/user/me" },
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
    {view3D?
    <Canvas3D />
    :
    <Canvas2D />
    }
    </Container>
  );
}
