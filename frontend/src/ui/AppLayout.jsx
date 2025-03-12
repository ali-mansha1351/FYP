import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import style from "./HomePage.module.css";
function AppLayout() {
  return (
    /* {isLoading && <Loader/>} */
    <div className={style["content-wrapper"]}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default AppLayout;
