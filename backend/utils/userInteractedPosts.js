import { Post } from "../modules/post.js";
import { User } from "../modules/user.js";

const getOwnPosts = async (userId) => {
  try {
    const post = await Post.find({ createdBy: userId }).select("_id");
    return post.map((post) => post._id.toString());
  } catch (error) {
    throw new Error("failed to get your posts" + error.messaage);
  }
};

const getUserLikedPosts = async (userId) => {
  try {
    const likedPosts = await Post.find({ "likes.userId": userId }).select(
      "_id"
    );
    return likedPosts.map((post) => post._id.toString());
  } catch (error) {
    throw new Error("failed to get posts you liked" + error.messaage);
  }
};

const getUserCommentedPosts = async (userId) => {
  try {
    const commentedPosts = await Post.find({
      "comments.userId": userId,
    }).select("_id");
    return commentedPosts.map((post) => post._id.toString());
  } catch (error) {
    throw new Error("failed to get posts you commented" + error.messaage);
  }
};

const getUserSharedPosts = async (userId) => {
  try {
    const sharedPosts = await Post.find({
      "shares.userId": userId,
    }).select("_id");
    return sharedPosts.map((post) => post._id.toString());
  } catch (error) {
    throw new Error("failed to get posts you shared" + error.messaage);
  }
};

const getUserSavedPosts = async (userId) => {
  try {
    const user = await User.findById(userId).select("savedPosts");
    return user?.savedPosts?.map((postId) => postId.toString()) || [];
  } catch (error) {
    throw new Error("failed to get posts you saved" + error.messaage);
  }
};

export const getUserInteractedPosts = async (userId) => {
  try {
    const [post, likedPosts, commentedPosts, sharedPosts, user] =
      await Promise.all([
        getOwnPosts(userId),
        getUserLikedPosts(userId),
        getUserCommentedPosts(userId),
        getUserSharedPosts(userId),
        getUserSavedPosts(userId),
      ]);

    // Combine all interacted post IDs and remove duplicates
    const allInteractedPosts = [
      ...post,
      ...likedPosts,
      ...commentedPosts,
      ...sharedPosts,
      ...user,
    ];

    return [...new Set(allInteractedPosts)];
  } catch (error) {
    throw new Error("error fetching user interacted posts" + error.message);
  }
};
