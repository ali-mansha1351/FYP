import { useMutation } from "@tanstack/react-query";
import { deletePost as deletePostApi } from "../../services/postApi";
import { useQueryClient } from "@tanstack/react-query";
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: (id) => deletePostApi(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
      console.log(response);
    },
  });
  return { deletePost, isDeleting };
};
