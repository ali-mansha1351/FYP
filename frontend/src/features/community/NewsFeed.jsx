import { useSelector } from "react-redux";
import Header from "../../ui/Header";

function NewsFeed() {
  const user = useSelector((store) => store.user);
  const { name } = user.userDetail;
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
  return (
    <>
      {user.isLoggedIn ? (
        <Header navItems={navItemsForLggedIn} />
      ) : (
        <Header navItems={navItems} />
      )}

      <div>this is newsfeed screen</div>
    </>
  );
}

export default NewsFeed;
