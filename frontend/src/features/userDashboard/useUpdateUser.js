import { useMutation } from "@tanstack/react-query";
import { update as updateUserApi } from "../../services/userApi";
import { useNavigate } from "react-router-dom";

export function useUpdatedUser() {
  const navigate = useNavigate();
  const { mutate: update, isLoading } = useMutation({
    mutationFn: (data) => updateUserApi(data),
    onSuccess: () => {
      navigate("/user/me", { replace: true });
    },
  });
  return { update, isLoading };
}
