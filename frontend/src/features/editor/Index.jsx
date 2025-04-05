
import Canvas from "./Canvas";
import MenuBar from "./MenuBar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Header from "../../ui/Header";

export default function Index() {
  const navigate = useNavigate()
  const user = useSelector((store) => store.user);
  const navItemsForLggedIn =  [
    { label: "Learn", path: "/" },
    { label: "Community", path: "/" },
    { label: "Profile", path: "/user/me" },
  ];
  const navItems=  [
    { label: "Home", path: "/" },
    { label: "Register", path: "/register" },
    { label: "Login", path: "/login" },
  ];
  return (<>
      {user.isLoggedIn ?
            <Header navItems={navItemsForLggedIn}/>
           :
           <Header navItems={navItems}/>
      }
    <MenuBar />
    <Canvas />
    </>
  )
}
