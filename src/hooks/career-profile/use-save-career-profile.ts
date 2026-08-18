import { API_ENDPOINTS } from "@/provider/endpoints";
import {
  CareerProfile,
  SaveCareerProfileRequest,
} from "../../../types/career-profile";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

interface UseSaveCareerProfileOptions {
  onSuccess?: () => void;
  onSuccessMessage?: string;
  silent?: boolean;
}

export const useSaveCareerProfile = function (
  options: UseSaveCareerProfileOptions = {},
) {
  const { mutateAsync, isPending } = useSubmitData<
    SaveCareerProfileRequest,
    APIResponse<CareerProfile>
  >({
    url: API_ENDPOINTS.careerProfile.save,
    // The server upserts, so there is one write path for create and update.
    method: "put",
    onSuccessMessage: options.onSuccessMessage ?? "Career profile saved",
    silent: options.silent ?? false,
    ...(options.onSuccess && { onSuccess: options.onSuccess }),
  });

  return {
    saveCareerProfile: mutateAsync,
    isSavingCareerProfile: isPending,
  };
};
