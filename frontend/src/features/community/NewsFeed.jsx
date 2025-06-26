import { useSelector, useDispatch } from "react-redux";
import Header from "../../ui/Header";
import styled from "styled-components";
import React, { useState } from "react";
import PostModal from "./PostModal";
import { useGetNewsFeed } from "./useGetNewsFeed";
import { useQueryClient } from "@tanstack/react-query";
import { dateConverter } from "../../utils/dateConverter";
import ImageCarousel from "../../ui/ImageCrousel";
const Container = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  //font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

// const Logo = styled.h1`
//   font-size: 2rem;
//   font-weight: 300;
//   color: #333;
//   margin: 0;
// `;

// const NavButtons = styled.div`
//   display: flex;
//   gap: 1rem;
// `;

// const NavButton = styled.button`
//   background-color: #c8e6c9;
//   border: none;
//   padding: 0.75rem 2rem;
//   border-radius: 25px;
//   font-size: 1rem;
//   cursor: pointer;
//   transition: background-color 0.2s;

//   &:hover {
//     background-color: #a5d6a7;
//   }
// `;

// const UserProfile = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
// `;

// const UserName = styled.span`
//   font-size: 1rem;
//   color: #333;
// `;

// const Avatar = styled.div`
//   width: 40px;
//   height: 40px;
//   background-color: #7986cb;
//   border-radius: 50%;
// `;

const MainContent = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 2rem auto;
  gap: 2rem;
  padding: 0 2rem;
`;

const FeedSection = styled.div`
  flex: 2;
`;

const FeedTab = styled.div`
  background-color: #d0d0d0;
  padding: 1rem;
  border-radius: 10px 10px 0 0;
  font-weight: 500;
  margin-bottom: 0;
`;

const FeedContent = styled.div`
  background-color: #e0e0e0;
  padding: 2rem;
  border-radius: 0 0 10px 10px;
`;

const NewPostButton = styled.button`
  width: 100%;
  background-color: #c8e6c9;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  text-align: left;
  margin-bottom: 2rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #a5d6a7;
  }
`;

const Post = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
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

const PostAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
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
`;

const PostUserRole = styled.span`
  color: #666;
  font-size: 0.9rem;
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

const PostContent = styled.p`
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

const Sidebar = styled.div`
  flex: 1;
`;

const SuggestionsCard = styled.div`
  background-color: #d0d0d0;
  border-radius: 15px;
  padding: 1.5rem;
`;

const SuggestionsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: #333;
`;

const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const SuggestionUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SuggestionAvatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><circle cx="22.5" cy="22.5" r="22.5" fill="%23ddd"/><circle cx="22.5" cy="18" r="7" fill="%23999"/><path d="M6 36c0-9 7-16 16.5-16s16.5 7 16.5 16" fill="%23999"/></svg>');
  background-size: cover;
`;

const SuggestionUserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const SuggestionUserName = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 1rem;
`;

const SuggestionUserRole = styled.span`
  color: #666;
  font-size: 0.85rem;
`;

const SuggestionAddButton = styled.button`
  background: none;
  border: none;
  color: #5c6bc0;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: #5c6bc0;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;
const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #666;
`;
const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  text-align: center;
`;

const LoadMoreTrigger = styled.div`
  padding: 2rem;
  text-align: center;
  color: #666;
`;
function NewsFeed() {
  const user = useSelector((store) => store.user);
  const { name, _id } = user.userDetail;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isError,
    isLoading,
    isFetchingNextPage,
    ref,
  } = useGetNewsFeed();
  const navItemsForLggedIn = [
    { label: "Learn", path: "/learn" },
    { label: "Community", path: "/user/newsfeed" },
    { label: `${name}`, path: `/user/${_id}` },
  ];
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Register", path: "/register" },
    { label: "Login", path: "/login" },
  ];

  const suggestions = [
    { name: "Elizabeth Olsen", role: "Beginner with 2 month experience" },
    { name: "John Doe", role: "Intermediate with 1 year experience" },
    { name: "Jack Den", role: "Intermediate with 1.5 year experience" },
    { name: "Fatima Anjum", role: "Expert with 3 year experience" },
    { name: "Mike Baggs", role: "Beginner with 4 month experience" },
    { name: "Ilsa Nadeem", role: "Beginner with 2 week experience" },
  ];

  const feed = queryClient.getQueryData(["newsfeed"]);
  const allPosts = feed?.pages?.flatMap((pages) => pages?.data?.posts);
  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handlePostModalCancel = () => {
    setIsModalOpen(false);
  };

  //const allPosts = data.pages?.flatMap((page) => page.data.posts);
  //console.log(allPosts);
  const renderPost = (post, index) => {
    return (
      <Post>
        <PostHeader>
          <PostUserInfo>
            <PostAvatar src={post.createdBy.profileImage.url} />
            <PostUserDetails>
              <PostUserName>
                {post.createdBy.name || "Sarah Wells"}
              </PostUserName>
              <PostUserRole>
                {post.createdBy.skillLevel || "Intermediate Designer"}
              </PostUserRole>
            </PostUserDetails>
          </PostUserInfo>
          <div>
            <PostTime>{dateConverter(post.createdAt)}</PostTime>
            <AddButton>+ Add</AddButton>
          </div>
        </PostHeader>

        <PostContent>{post.description}</PostContent>

        <ImageCarousel images={post.content} />

        <PostStats>
          <span>{post.likes}</span>
          <span>{post.comments}</span>
        </PostStats>
      </Post>
    );
  };

  return (
    <>
      <Container>
        {user.isLoggedIn ? (
          <Header navItems={navItemsForLggedIn} />
        ) : (
          <Header navItems={navItems} />
        )}

        <MainContent>
          <FeedSection>
            <FeedTab>Feed</FeedTab>
            <FeedContent>
              <NewPostButton onClick={handleOpen}>
                Start a new post
              </NewPostButton>
              {/* Handle loading state */}
              {isLoading && (
                <LoadingSpinner>Loading your feed...</LoadingSpinner>
              )}

              {/* Handle error state */}
              {isError && (
                <ErrorMessage>
                  Error loading feed:{" "}
                  {isError?.message || "Something went wrong"}
                </ErrorMessage>
              )}

              {/* Render posts from API */}

              {allPosts?.map((post, postIndex) => {
                console.log(post);
                return renderPost(post, `${postIndex}`);
              })}

              <LoadMoreTrigger ref={ref}>
                {isFetchingNextPage && (
                  <LoadingSpinner>Loading more posts...</LoadingSpinner>
                )}
                {!hasNextPage && data?.pages.length > 0 && (
                  <div>You have reached the end of your feed!</div>
                )}
              </LoadMoreTrigger>
            </FeedContent>
          </FeedSection>

          <Sidebar>
            <SuggestionsCard>
              <SuggestionsTitle>Suggestions</SuggestionsTitle>
              {suggestions.map((suggestion, index) => (
                <SuggestionItem key={index}>
                  <SuggestionUserInfo>
                    <SuggestionAvatar />
                    <SuggestionUserDetails>
                      <SuggestionUserName>{suggestion.name}</SuggestionUserName>
                      <SuggestionUserRole>{suggestion.role}</SuggestionUserRole>
                    </SuggestionUserDetails>
                  </SuggestionUserInfo>
                  <SuggestionAddButton>+ Add</SuggestionAddButton>
                </SuggestionItem>
              ))}
              <ViewAllButton>View all suggestion →</ViewAllButton>
            </SuggestionsCard>
          </Sidebar>
        </MainContent>

        {isModalOpen && (
          <PostModal
            show={isModalOpen}
            handlePostModalCancel={handlePostModalCancel}
          />
        )}
      </Container>
    </>
  );
}

export default NewsFeed;
