import styled from "styled-components";
import { useUser } from "../login/useUser";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { logoutUser, setUser } from "../login/loginSlice";
import { useLogout } from "../login/useLogout";
import { useQueryClient } from "@tanstack/react-query";
import { FaUserCircle } from "react-icons/fa";
import Header from "../../ui/Header";
import addImg from "../../assets/add-image.png";
import magicRing from "../../assets/magicRing.svg";
import threeDots from "../../assets/three-dots.png";
import { DropdownMenuWrapper, DropdownItem } from "../../ui/DropDownStyles";
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const Profile = styled.div`
  display: flex;
  flex-direction: column;
  margin-inline: 10px;
  border-radius: 10px;
  background-color: var(--primary-color);
  width: 75vw;
  padding-bottom: 10px;
`;
const CoverImageContainer = styled.div`
  width: 100%;
  height: 150px;
  color: grey;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-bottom: 1px solid var(--secondary-color);
  border-radius: 10px 10px 0px 0px;
  &:hover {
  }
`;
const CoverImg = styled.img`
  border-radius: 10px 10px 0px 0px;
`;
const ProfileHeader = styled.div`
  display: flex;
  position: relative;
  margin: 20px;
  border: 0.5px solid var(--secondary-color);
  padding: 100px 20px 10px;
`;
const ProfileImageContainer = styled.div`
  position: absolute;
  border: 1px solid var(--secondary-color);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 50%;
  background: antiquewhite;
  cursor: pointer;
`;
const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
`;
const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 24px;
  font-weight: 500;
  flex: 3;
  align-items: center;
`;
const FollowersContainer = styled.div``;
const PostsNumContainer = styled.div``;
const Name = styled.div`
  font-weight: bold;
  font-size: 24px;
  text-transform: capitalize;
`;
const SkillLevelContainer = styled.div`
  font-size: 20px;
  text-transform: capitalize;
`;
const ItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid var(--secondary-color);
`;
const BottomButton = styled.div`
  font-size: 20px;
  cursor: pointer;
  width: fit-content;
  padding-inline: 90px;
  padding-block: 5px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  align-self: center;
  background-color: var(--secondary-color);
  border: 2px solid var(--secondary-color);
  &:hover {
    border: 2px solid black;
  }
`;
const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-inline: 20px;
`;
const Label = styled.div`
  font-size: 20px;
  width: fit-content;
  padding-inline: 15px;
  padding-block: 5px;
  border: 0.5px solid var(--secondary-color);
  border-bottom: none;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;
const GridItem = styled.div`
  padding: 20px;
  text-align: center;
  border-right: 1px solid var(--secondary-color);
  border-bottom: 1px solid var(--secondary-color);

  // remove right border on every 3rd item
  &:nth-child(3n) {
    border-right: none;
  }

  // remove bottom border on last row items
  &:nth-last-child(-n + 3) {
    border-bottom: none;
  }
`;
const Icon = styled.img`
  top: 8%;
  right: 1%;
  position: absolute;
`;

function UserProfile() {
  //testing useUser hook works fetching logged in user and geting the data?
  const userDetails = useSelector((store) => store.user);
  const isEffectRun = useRef(false);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [numOfPosts, setNumOfPosts] = useState(0);
  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [isDropDownOpen, setIsDropDownOpen] = useState();
  const dispatch = useDispatch();
  const { logout } = useLogout();
  const queryClient = useQueryClient();
  const navItems = [
    { label: "Learn", path: "/learn" },
    { label: "Community", path: "/" },
    { label: "Editor", path: "/editor" },
  ];

  const { isLoading, refetch } = useUser();
  function handleProfileImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // set base64 image
      };
      reader.readAsDataURL(file);
    }
  }

  function handleCoverImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleProfileClick = () => {
    profileInputRef.current?.click();
  };

  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

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
  const { name, gender, email, skillLevel } = userDetails.userDetail;
  return (
    <Container>
      <Header navItems={navItems} />
      <Profile>
        {/* Hidden Inputs */}
        <input
          type="file"
          accept="image/*"
          ref={coverInputRef}
          onChange={handleCoverImageChange}
          style={{ display: "none" }}
        />
        <CoverImageContainer onClick={handleCoverClick}>
          {coverImage ? (
            <CoverImg
              src={coverImage}
              alt="cover"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <>
              <img src={addImg} width={45} />
              <div>Click to add a cover photo</div>
            </>
          )}
          <Icon
            src={threeDots}
            width={20}
            onClick={(e) => {
              e.stopPropagation();
              setIsDropDownOpen(!isDropDownOpen);
            }}
          />
          {isDropDownOpen && (
            <DropdownMenuWrapper
              $isOpen={isDropDownOpen}
              $top={"20%"}
              $right={"2%"}
            >
              <DropdownItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                  setIsDropDownOpen(false);
                }}
              >
                Log out
              </DropdownItem>
            </DropdownMenuWrapper>
          )}
        </CoverImageContainer>
        <ProfileHeader>
          <input
            type="file"
            accept="image/*"
            ref={profileInputRef}
            onChange={handleProfileImageChange}
            style={{ display: "none" }}
          />
          <LeftContainer>
            <ProfileImageContainer onClick={handleProfileClick}>
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="profile"
                  style={{
                    width: 135,
                    height: 135,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <FaUserCircle size={135} color="#333" />
              )}
            </ProfileImageContainer>
            <Name>{name}</Name>
            <SkillLevelContainer>{skillLevel}</SkillLevelContainer>
          </LeftContainer>
          <RightContainer>
            <FollowersContainer>
              {followers} Followers | {following} Following
            </FollowersContainer>
            <PostsNumContainer>{numOfPosts} Posts</PostsNumContainer>
          </RightContainer>
        </ProfileHeader>
        <SubContainer>
          <Label>Saved Items</Label>
          <ItemsContainer>
            <GridItem>1</GridItem>
            <GridItem>2</GridItem>
            <GridItem>3</GridItem>
            <GridItem>4</GridItem>
            <GridItem>5</GridItem>
            <GridItem>6</GridItem>
          </ItemsContainer>
          <BottomButton>Click to see more</BottomButton>
        </SubContainer>
        <SubContainer>
          <Label>Your Posts</Label>
          <ItemsContainer>
            <GridItem>1</GridItem>
            <GridItem>2</GridItem>
            <GridItem>3</GridItem>
            <GridItem>4</GridItem>
            <GridItem>5</GridItem>
            <GridItem>6</GridItem>
          </ItemsContainer>
          <BottomButton>Click to see more</BottomButton>
        </SubContainer>
      </Profile>
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

export default UserProfile;
