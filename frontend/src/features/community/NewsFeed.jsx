import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Header from "../../ui/Header";
import styled from "styled-components";
import React, { useState } from "react";
import { createPost } from "./postSlice";
import toast from "react-hot-toast";
import { useCreatePost } from "./useCreatePost";

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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #5c6bc0;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #5c6bc0;
  }
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: #5c6bc0;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  background: none;
  border: 2px solid #e0e0e0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #999;
    color: #333;
  }
`;

const SubmitButton = styled.button`
  background-color: #5c6bc0;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4a5ac0;
  }
`;
const ErrorMessage = styled.span`
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;
const FilePreview = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
`;
const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: #f44336;
  margin-left: 0.5rem;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    color: #d32f2f;
  }
`;
function NewsFeed() {
  const dispatch = useDispatch();
  const { createPost: createPostApi, isLoading } = useCreatePost();
  const user = useSelector((store) => store.user);
  const { name } = user.userDetail;
  const [selectedFiles, setIsSelectedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      files: null,
    },
  });
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

  const suggestions = [
    { name: "Elizabeth Olsen", role: "Beginner with 2 month experience" },
    { name: "John Doe", role: "Intermediate with 1 year experience" },
    { name: "Jack Den", role: "Intermediate with 1.5 year experience" },
    { name: "Fatima Anjum", role: "Expert with 3 year experience" },
    { name: "Mike Baggs", role: "Beginner with 4 month experience" },
    { name: "Ilsa Nadeem", role: "Beginner with 2 week experience" },
  ];

  const patternText = `                ∩    ∩∩ x x↪    ∇    ∩∩ x x↪    ∇∩∩ x x↪oo    ∇ x x∇oo 
                |  oo x x x x xooo∇∞∞x x x x xooo∇∞∞x x x x xoo ∇
                | ooox|||||||ooo∞∞∞|||||||ooo∞∞∞|||||||oo∞∞∞ x
                |oo∞∞∞ooooooooo∞∞∞ooooooooo∞∞∞ooooooooo∞∞∞|
 xδoooooooooooooooooooooooooooooooooooooooooooooooooooo 
                                    ★ 10  9  8  7  6  5  4  3  2  1  ★`;

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files);
    setIsSelectedFiles(files);
    setValue("files", files);
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter(
      (_, index) => index !== indexToRemove
    );
    setIsSelectedFiles(updatedFiles);
    setValue("files", updatedFiles);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);

      selectedFiles.forEach((file) => {
        formData.append("postContent", file);
      });

      const postPayLoadData = {
        title: data.title,
        description: data.description,
        files: selectedFiles.map((file) => file.name),
      };
      createPostApi(formData, {
        onSuccess: (response) => {
          toast.success("posted successfully", { id: "postSuccess" });
        },
        onError: (error) => {
          toast.error("could not create post,try again", { id: "postFail" });
        },
      });
      dispatch(createPost(postPayLoadData));
      console.log(data);
      handleCancel();
    } catch (error) {
      toast.error(`please try again=>${error.message}`, {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsSelectedFiles([]);
    reset();
  };

  const handleOpen = () => {
    setIsModalOpen(true);
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

              <Post>
                <PostHeader>
                  <PostUserInfo>
                    <PostAvatar />
                    <PostUserDetails>
                      <PostUserName>Sarah Wells</PostUserName>
                      <PostUserRole>Intermediate Designer</PostUserRole>
                    </PostUserDetails>
                  </PostUserInfo>
                  <div>
                    <PostTime>1d ago</PostTime>
                    <AddButton>+ Add</AddButton>
                  </div>
                </PostHeader>

                <PostContent>
                  Hello everyone!. This is me Sarah I just found out about this
                  beautiful craft by my friend and decided to give it a try.
                  just created a simple pattern. Hope I did it well :)
                </PostContent>

                <PatternImage>{patternText}</PatternImage>

                <CrochetImage
                  src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><defs><pattern id='purple-texture' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'><rect width='40' height='40' fill='%23663399'/><circle cx='20' cy='20' r='15' fill='%23bb88cc' opacity='0.7'/></pattern></defs><rect width='400' height='200' fill='url(%23purple-texture)'/></svg>"
                  alt="Purple crochet pattern"
                />

                <PostStats>
                  <span>500 Likes</span>
                  <span>9 Comments</span>
                </PostStats>
              </Post>
              <Post>
                <PostHeader>
                  <PostUserInfo>
                    <PostAvatar />
                    <PostUserDetails>
                      <PostUserName>Sarah Wells</PostUserName>
                      <PostUserRole>Intermediate Designer</PostUserRole>
                    </PostUserDetails>
                  </PostUserInfo>
                  <div>
                    <PostTime>1d ago</PostTime>
                    <AddButton>+ Add</AddButton>
                  </div>
                </PostHeader>

                <PostContent>
                  Hello everyone!. This is me Sarah I just found out about this
                  beautiful craft by my friend and decided to give it a try.
                  just created a simple pattern. Hope I did it well :)
                </PostContent>

                <PatternImage>{patternText}</PatternImage>

                <CrochetImage
                  src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><defs><pattern id='purple-texture' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'><rect width='40' height='40' fill='%23663399'/><circle cx='20' cy='20' r='15' fill='%23bb88cc' opacity='0.7'/></pattern></defs><rect width='400' height='200' fill='url(%23purple-texture)'/></svg>"
                  alt="Purple crochet pattern"
                />

                <PostStats>
                  <span>500 Likes</span>
                  <span>9 Comments</span>
                </PostStats>
              </Post>
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
          <Modal
            onClick={(e) => e.target === e.currentTarget && handleCancel()}
          >
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Create New Post</ModalTitle>
                <CloseButton onClick={handleCancel}>×</CloseButton>
              </ModalHeader>

              <form onSubmit={handleSubmit(onSubmit)}>
                <FormGroup>
                  <Label>Title</Label>
                  <Input
                    type="text"
                    {...register("title", {
                      required: true,
                      minLength: {
                        value: 3,
                        message: "title must be atleast 3 characters",
                      },
                      maxLength: {
                        value: 500,
                        message: "title must be at most 500 characters",
                      },
                    })}
                    placeholder="Enter post title..."
                    error={errors.title}
                  />
                  {errors.title && (
                    <ErrorMessage>{errors.title.message}</ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Description</Label>
                  <TextArea
                    name="description"
                    {...register("description", {
                      required: false,
                      minLength: {
                        value: 50,
                        message: "description must of atleast 50 characters",
                      },
                      maxLength: {
                        value: 1000,
                        message: "description can be max of 1000 characters",
                      },
                    })}
                    placeholder="Share your crochet experience, pattern details, or tips..."
                    error={errors.description}
                  />
                  {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Upload Image or Video</Label>
                  <FileInput
                    type="file"
                    name="file"
                    onChange={handleInputChange}
                    accept="image/*,video/*"
                    multiple
                    error={errors.files}
                  />
                  {errors.files && (
                    <ErrorMessage>{errors.files.message}</ErrorMessage>
                  )}
                  {selectedFiles.length > 0 && (
                    <FilePreview>
                      {selectedFiles.map((file, index) => (
                        <FileItem key={index}>
                          <span>{file.name}</span>
                          <RemoveFileButton
                            type="button"
                            onClick={() => removeFile(index)}
                            title="Remove File"
                          >
                            x
                          </RemoveFileButton>
                        </FileItem>
                      ))}
                    </FilePreview>
                  )}
                </FormGroup>

                <ModalButtons>
                  <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                  <SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Post"}
                  </SubmitButton>
                </ModalButtons>
              </form>
            </ModalContent>
          </Modal>
        )}
      </Container>
    </>
  );
}

export default NewsFeed;
