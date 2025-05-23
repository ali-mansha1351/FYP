import { useQuery } from "@tanstack/react-query";
import { getLoggedInUser } from "../../services/userApi";
export function useUser(enabled = false) {
  const {
    isLoading,
    data: user,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getLoggedInUser,
    retry: false,
    enabled, //prevent automatic fetching on component mounts
  });

  return { isLoading, user, error, refetch };
}
