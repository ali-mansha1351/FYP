import styled from "styled-components";
import { useUser } from "../login/useUser";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { logoutUser, setUser } from "../login/loginSlice";
import { useLogout } from "../login/useLogout";
import Container from '../../ui/Container'
import Header from "../../ui/Header";

const Button = styled.button`
  width: 100px;
`

function UerProfile() {
  //testing useUser hook works fetching logged in user and geting the data?
  const userDetails = useSelector((store) => store.user);
  const isEffectRun = useRef(false);
  const dispatch = useDispatch();
  const { logout } = useLogout();
  const navItems = [
    { label: "Learn", path: "/" },
    { label: "Community", path: "/" },
    { label: "Editor", path: "/editor" },
  ];

  const { isLoading, refetch } = useUser();

  useEffect(() => {
    if (isEffectRun.current) return; // Prevent redundant calls
    isEffectRun.current = true;

    refetch()
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          dispatch(setUser(response.data)); // Dispatch the user data to Redux
        }
      })
      .catch((error) => {
        console.error("Failed to fetch user data:", error);
      });
  }, [refetch, dispatch]);

  function handleLogout() {
      logout(null, {
        onSuccess: (response) => {
          console.log(response);
          dispatch(logoutUser());
          queryClient.removeQueries({ queryKey: ["token"] });
          queryClient.removeQueries({ queryKey: ["user"] });
        },
      });
    }

  if (isLoading) return <p>Loading user data...</p>;
  const { name, gender, email } = userDetails.userDetail;

  return (
    <Container>
      <Header navItems={navItems}/>
      <h4>Name</h4>
      <p>{name}</p>
      <h4>gender</h4>
      <p>{gender}</p>
      <h4>Email</h4>
      <p>{email}</p>
      <Button onClick={handleLogout}>Logout</Button>
    </Container>
  );
}

//loader function
// export async function loader() {
//   //fetch logic
//   //calling fcuntion with await from services folder from the api in which end points are created
//   /*
//     const books = await getBooks();
//     return books
//     */
// }

export default UerProfile;
