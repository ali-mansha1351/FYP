import styled from "styled-components";
import { useUser } from "./useUser";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { logoutUser, setUser } from "../login/loginSlice";
import FullPageSpinner from "../../ui/FullPageSpinner";
import { useLogout } from "../login/useLogout";
import { useQueryClient } from "@tanstack/react-query";
import { FaUserCircle } from "react-icons/fa";
import { DropdownMenuWrapper, DropdownItem } from "../../ui/DropDownStyles";
import { useDeletePattern, useGetPatterns } from "../../hooks/usePattern";
import { useNavigate } from "react-router-dom";
import { useGetPost } from "./useGetPost";
import { dateConverter } from "../../utils/dateConverter";
import { useDeletePost } from "./useDeletePost";
import toast from "react-hot-toast";
import PostModal from "../community/PostModal";
import ImageCarousel from "../../ui/ImageCrousel";
import Header from "../../ui/Header";
import UpdateUserModal from "./UpdateUserModal";
import addImg from "../../assets/add-image.png";
import threeDots from "../../assets/three-dots.png";
import { useGetSavedPost } from "./useGetSavedPosts";
import { savePost } from "../../services/postApi";
import Spinner from "../../ui/Spinner";
import { getPatterns } from "../../services/patternApi";
import DeletePatternModal from "./DeletePatternModal";
import DeletePostModal from "./DeletePostModal";
import { resetEditor } from "../editor/editorSlice";
import { useGetSuggestions } from "./useGetSuggestions";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
  margin: 10px 10%;

  @media (max-width: 786px) {
    margin: 10px;
  }
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: var(--primary-color);
  min-width: 400px;
  padding-bottom: 10px;
  margin-top: 15px;
  height: fit-content;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
`;

const Post = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  // margin-bottom: 2rem;
  margin-top: 1rem;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const PostUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PostAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><circle cx="25" cy="25" r="25" fill="%23ddd"/><circle cx="25" cy="20" r="8" fill="%23999"/><path d="M7 40c0-10 8-18 18-18s18 8 18 18" fill="%23999"/></svg>');
  background-size: cover;
`;

const PostUserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostUserName = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
  text-transform: capitalize;
`;

const PostUserRole = styled.span`
  color: #666;
  font-size: 0.9rem;
  text-transform: capitalize;
`;

const PostTime = styled.span`
  color: #999;
  font-size: 0.9rem;
`;

const AddButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #333;
`;

const PostContent = styled.h3`
  line-height: 1.6;
  color: #333;
  margin-bottom: 1.5rem;
`;

const PatternImage = styled.div`
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-family: monospace;
  font-size: 0.8rem;
  line-height: 1.2;
  text-align: center;
  white-space: pre-line;
`;
const PostDesc = styled.div`
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  line-height: 1.2;
  white-space: pre-line;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const CrochetImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const PostStats = styled.div`
  display: flex;
  gap: 2rem;
  color: #666;
  font-size: 0.9rem;
`;

const PostsSidebar = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  background-color: var(--primary-color);
  border-radius: 10px;
  overflow: hidden;
`;

const PostsHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid var(--secondary-color);
  background-color: var(--primary-color);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const PostsTabContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const PatternGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0.5rem;

  @media (max-width: 650px) {
    grid-template-columns: 1fr; // Force 1 item per row
  }
`;

const PatternCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  }
`;
const DeleteIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 20px;
  cursor: pointer;
  color: black;
  font-size: 1rem;
  z-index: 2;
  &:hover {
    color: #6c7c6b;
  }
`;
const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 8px;
  font-size: 16px;
  color: black;

  &:hover {
    color: #6c7c6b;
  }
`;
const Div = styled.div`
  display: flex;
  align-items: center;
`;
const PatternName = styled.h3`
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const PatternDate = styled.span`
  font-size: 0.9rem;
  color: #888;
`;

const PostsTab = styled.button`
  padding: 10px 20px;
  border: 1px solid var(--secondary-color);
  border-radius: 8px;
  background-color: ${(props) => (props.$active ? "grey" : "transparent")};
  color: ${(props) => (props.$active ? "white" : "inherit")};
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--secondary-color);
    border: 1px solid var(--secondary-color);
    color: black;
  }
`;

const PostsContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px;
`;

const PostItem = styled.div`
  padding: 15px;
  border: 1px solid var(--secondary-color);
  border-radius: 8px;
  margin-bottom: 15px;
  background-color: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const PostTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
`;

const PostMeta = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const PostPreview = styled.p`
  font-size: 16px;
  line-height: 1.4;
  margin: 0;
  color: #333;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-style: italic;
`;

const CoverImageContainer = styled.div`
  width: 100%;
  height: 150px;
  color: grey;
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
  width: 100%;
  height: 100%;
  padding: 10px 40px;
  object-fit: contain;
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
  border: 1.5px solid black;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 50%;
  background: antiquewhite;
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
  cursor: pointer;

  // // remove right border on every 3rd item
  // &:nth-child(3n) {
  //   border-right: none;
  // }

  // // remove bottom border on last row items
  // &:nth-last-child(-n + 3) {
  //   border-bottom: none;
  // }
`;
const Icon = styled.img`
  top: 8%;
  right: 1%;
  position: absolute;
`;

function UserProfile() {
  //testing useUser hook works fetching logged in user and geting the data?

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState();
  const [activeTab, setActiveTab] = useState("patterns"); // 'saved' or 'created' or 'patterns'
  const [savedPost, setSavedPosts] = useState([]);
  const [createdPosts, setCreatedPosts] = useState([]);
  const { mutate: deletePattern, isPending } = useDeletePattern();
  const { mutate: deletePost, isPending: isPendingPostDeletion } =
    useDeletePost();
  const {
    userSuggestions,
    isLoading: isLoadingSuggestions,
    error,
  } = useGetSuggestions();
  const [deleteId, setDeleteId] = useState(null);
  const [deletePostId, setDeletePostId] = useState(null);
  const { isLoading, refetch } = useUser();
  const { savedPosts } = useGetSavedPost();
  const {
    isLoading: postsLoading,
    refetch: userPostRefetch,
    userPosts,
  } = useGetPost(true);
  const { logout, isPending: isLoggingOut } = useLogout();

  const isEffectRun = useRef(false);
  const userDetails = useSelector((store) => store.user);
  const { data: patterns, isPending: isLoadingPatterns } = useGetPatterns();
  const {
    _id,
    name,
    skillLevel,
    profileImage,
    coverImage,
    followers,
    following,
  } = userDetails.userDetail;
  function formatDate(isoDate) {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const navItems = [
    { label: "Learn", path: "/learn" },
    { label: "Community", path: `/user/${_id}/newsfeed/` },
    { label: "Editor", path: "/editor" },
  ];

  const getCachedPosts = queryClient.getQueryData(["userPosts"]);
  const getCachedUser = queryClient.getQueryData(["user"]);
  const getCachedSavedPosts = queryClient.getQueryData(["savedPosts"]);

  // useEffect(() => {

  //   //actuall posts from backend
  //   if (userPosts?.posts?.length > 0) {
  //     setCreatedPosts(userPosts.posts);
  //     //console.log("userPosts", userPosts.posts);
  //   }
  // }, [userPosts]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handlePostModalOpen = () => {
    console.log(1);
    setIsPostModalOpen(true);
  };

  const handlePostModalCancel = () => {
    setIsPostModalOpen(false);
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handlePostDelete = (id) => {
    deletePost(id, {
      onSuccess: (res) => {
        // userPostRefetch();
        toast.success("post successfully delete");
      },
      onError: (error) => {
        toast.error("couldn't delete post");
      },
    });
  };

  const handleSave = async (id) => {
    const res = await savePost(id);
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    }
  };
  useEffect(() => {
    refetch()
      .then((response) => {
        if (response.data) {
          dispatch(setUser(response.data)); // Dispatch the user data to Redux
        } else {
          dispatch(logoutUser());
          navigate("/login", { replace: true });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch user data:", error);
      });
  }, [refetch, dispatch, navigate]);

  function handleLogout() {
    logout(null, {
      onSuccess: (response) => {
        console.log(response);
        dispatch(logoutUser());
        queryClient.removeQueries({ queryKey: ["token"] });
        queryClient.removeQueries({ queryKey: ["user"] });
        queryClient.removeQueries({ queryKey: ["userPosts"] });
        queryClient.removeQueries({ queryKey: ["savedPosts"] });
      },
    });
  }
  function confirmDelete(id) {
    setDeleteId(id);
  }
  function confirmDeletePost(id) {
    setDeletePostId(id);
  }
  function handleDeleteConfirm() {
    deletePattern(deleteId, {
      onSuccess: () => {
        toast.success("Pattern deleted successfully");
        setDeleteId(null);
        dispatch(resetEditor());
      },
      onError: (err) => {
        toast.error(err.message);
        setDeleteId(null);
      },
    });
  }
  function handleDeletePostConfirm() {
    deletePost(deletePostId, {
      onSuccess: () => {
        toast.success("Post deleted successfully");
        setDeletePostId(null);
      },
      onError: (err) => {
        toast.error(err.message);
        setDeletePostId(null);
      },
    });
  }

  if (isLoading || isLoggingOut) return <FullPageSpinner />;

  const countFollowing = following?.length;
  const countFollowers = followers?.length;

  const currentPosts = activeTab === "saved" ? savedPost : createdPosts;
  const handlePatternClick = (id) => {
    navigate(`/editor/${id}`);
  };
  return (
    <>
      <Container>
        <Header navItems={navItems} />

        <MainContent>
          <Profile>
            <CoverImageContainer>
              {coverImage?.name ? (
                <CoverImg src={coverImage.url} alt="cover" />
              ) : (
                <>
                  <img src={addImg} width={45} />
                  <div>Edit Profile to add a cover photo</div>
                </>
              )}
              <Icon
                src={threeDots}
                width={20}
                style={{ cursor: "pointer" }}
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
                      handleModalOpen();
                      setIsDropDownOpen(false);
                    }}
                  >
                    Edit Profile
                  </DropdownItem>
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
              <LeftContainer>
                <ProfileImageContainer>
                  {profileImage?.name ? (
                    <img
                      src={profileImage.url}
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
                  {countFollowers} Followers | {countFollowing} Following
                </FollowersContainer>
                <PostsNumContainer>
                  {userPosts?.posts?.length || 0} Posts
                </PostsNumContainer>
              </RightContainer>
            </ProfileHeader>
            {/*<SubContainer>
              <Label>Quick Actions</Label>
              <ItemsContainer>
                <GridItem onClick={() => handleTabClick("saved")}>
                  View Saved Posts
                </GridItem>
                <GridItem onClick={() => handleTabClick("created")}>
                  View My Posts
                </GridItem>
                <GridItem onClick={() => handlePostModalOpen()}>
                  {" "}
                  Create New Post
                </GridItem>
                <GridItem>View My Patterns</GridItem>
              </ItemsContainer>
            </SubContainer>*/}
          </Profile>

          <PostsSidebar>
            <PostsHeader>
              <PostsTabContainer>
                <PostsTab
                  $active={activeTab === "saved"}
                  onClick={() => handleTabClick("saved")}
                >
                  Saved Posts ({getCachedSavedPosts?.savedPosts?.length || 0})
                </PostsTab>
                <PostsTab
                  $active={activeTab === "created"}
                  onClick={() => handleTabClick("created")}
                >
                  My Posts ({userPosts?.posts?.length || 0})
                </PostsTab>
                <PostsTab
                  $active={activeTab === "patterns"}
                  onClick={() => handleTabClick("patterns")}
                >
                  My Patterns ({patterns?.length})
                </PostsTab>
              </PostsTabContainer>
            </PostsHeader>
            {activeTab === "created" ? (
              <PostsContent>
                {getCachedPosts?.posts && getCachedPosts?.posts.length > 0 ? (
                  getCachedPosts?.posts.map((post) => (
                    <Post key={post._id}>
                      <PostHeader>
                        <PostUserInfo>
                          <PostAvatar>
                            <img
                              src={getCachedUser.profileImage.url}
                              style={{
                                borderRadius: "50%",
                                width: "50px",
                                height: "50pxA",
                                objectFit: "cover", // This prevents cropping and fits the image
                                objectPosition: "center",
                              }}
                            />
                          </PostAvatar>

                          <PostUserDetails>
                            <PostUserName>{name}</PostUserName>
                            <PostUserRole>{skillLevel}</PostUserRole>
                          </PostUserDetails>
                        </PostUserInfo>
                        <Div>
                          <PostTime>{dateConverter(post.createdAt)}</PostTime>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDeletePost(post._id);
                            }}
                            title="Delete"
                          >
                            <FaTrash />
                          </IconButton>
                          <IconButton title="Edit">
                            <FaPencilAlt />
                          </IconButton>
                        </Div>
                      </PostHeader>
                      {deletePostId && (
                        <DeletePostModal
                          isOpen={!!deletePostId}
                          onClose={() => setDeletePostId(null)}
                          onDelete={() => handleDeletePostConfirm()}
                          isDeleting={isPendingPostDeletion}
                        />
                      )}

                      <PostContent>{post.title}</PostContent>

                      <PostDesc>{post.description}</PostDesc>
                      {/* {post.content
                      ? post.content.map((img) => (
                          <CrochetImage
                            src={img.url}
                            alt="Purple crochet pattern"
                            key={img._id}
                          />
                        ))
                      : ""} */}
                      <ImageCarousel images={post.content} />

                      <PostStats>
                        <span>{post.likes.length} likes</span>
                        <span>{post.comments.length} comments</span>
                      </PostStats>
                    </Post>
                  ))
                ) : (
                  <EmptyState>
                    No posts created yet. Create your first post to get started!
                  </EmptyState>
                )}
              </PostsContent>
            ) : activeTab === "saved" ? (
              <PostsContent>
                {console.log(getCachedSavedPosts)}
                {getCachedSavedPosts.savedPosts &&
                getCachedSavedPosts.savedPosts?.length > 0 ? (
                  getCachedSavedPosts.savedPosts?.map((post) => (
                    <Post key={post._id}>
                      <PostHeader>
                        <PostUserInfo>
                          {/* <PostAvatar>
                            <img
                              src={savedPost.createdBy.profileImage.url}
                              style={{
                                borderRadius: "50%",
                                width: "50px",
                                height: "50pxA",
                                objectFit: "cover", // This prevents cropping and fits the image
                                objectPosition: "center",
                              }}
                            />
                          </PostAvatar> */}

                          <PostUserDetails>
                            <PostUserName>{name}</PostUserName>
                            <PostUserRole>{skillLevel}</PostUserRole>
                          </PostUserDetails>
                        </PostUserInfo>
                        <div>
                          <PostTime>
                            Created At {dateConverter(post.createdAt)}
                          </PostTime>

                          <AddButton onClick={() => handleSave(post._id)}>
                            Save
                          </AddButton>
                        </div>
                      </PostHeader>

                      <PostContent>{post.title}</PostContent>

                      <PatternImage>{post.description}</PatternImage>

                      <ImageCarousel images={post.content} />

                      <PostStats>
                        <span>{post.likes.length} likes</span>
                        <span>{post.comments.length} comments</span>
                      </PostStats>
                    </Post>
                  ))
                ) : (
                  <EmptyState>
                    No saved posts yet. Start exploring and save interesting
                    posts!
                  </EmptyState>
                )}
              </PostsContent>
            ) : isLoadingPatterns ? (
              <Spinner />
            ) : patterns?.length > 0 ? (
              <>
                <PatternGrid>
                  {patterns.map((pattern) => (
                    <PatternCard
                      key={pattern._id}
                      onClick={() => handlePatternClick(pattern._id)}
                    >
                      <DeleteIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(pattern._id);
                        }}
                      >
                        <FaTrash />
                      </DeleteIcon>
                      {pattern.image && (
                        <PatternImage src={pattern.image} alt={pattern.name} />
                      )}
                      <div>
                        <PatternName>{pattern.name}</PatternName>
                        <PatternDate>
                          {formatDate(pattern.createdAt)}
                        </PatternDate>
                      </div>
                    </PatternCard>
                  ))}
                </PatternGrid>
                {deleteId && (
                  <DeletePatternModal
                    isOpen={!!deleteId}
                    onClose={() => setDeleteId(null)}
                    onDelete={() => handleDeleteConfirm()}
                    isDeleting={isPending}
                  />
                )}
              </>
            ) : (
              <EmptyState>
                No patterns created yet. Create your first patterns to get
                started!
              </EmptyState>
            )}
          </PostsSidebar>
        </MainContent>
      </Container>

      <UpdateUserModal
        show={isModalOpen}
        onHide={handleModalClose}
        userDetail={userDetails.userDetail}
      />

      <PostModal
        handlePostModalCancel={handlePostModalCancel}
        show={isPostModalOpen}
      />
    </>
  );
}

export default UserProfile;
