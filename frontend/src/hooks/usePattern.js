import { useMutation } from "@tanstack/react-query";
import { createPattern } from "../services/patternApi";

export function useCreatePattern() {
  return useMutation({
    mutationFn: createPattern,
  });
}
