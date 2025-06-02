import { useMutation } from "@tanstack/react-query";
import { createPost as createPostApi } from "../../services/postApi";

export function useCreatePost() {
  const { mutate: createPost, isLoading } = useMutation({
    mutationFn: (data) => createPostApi(data),
    onSuccess: (response) => {
      console.log(response);
    },
  });
  return { createPost, isLoading };
}
