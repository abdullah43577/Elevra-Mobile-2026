import { API_ENDPOINTS } from "@/provider/endpoints";
import { CareerProfile } from "../../../types/career-profile";
import { APIResponse } from "../../../types/response";
import { useGetData } from "../use-get-data";

interface UseGetCareerProfileOptions {
  shouldFetch?: boolean;
}

export const useGetCareerProfile = function (
  options: UseGetCareerProfileOptions = {},
) {
  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<CareerProfile | null>
  >({
    url: API_ENDPOINTS.careerProfile.detail,
    shouldFetch: options.shouldFetch ?? true,
  });

  const careerProfile = data?.data ?? undefined;

  return {
    careerProfile,
    /*
      Whether the first fetch has landed. `careerProfile` cannot answer this on
      its own: the server returns `data: null` for an account that has not
      built one, which is indistinguishable from "still loading" — and the
      editor must not seed its form from an empty profile before the real one
      arrives.
    */
    hasLoadedCareerProfile: data !== undefined,
    // A row exists as soon as the user saves anything, so `careerProfile` alone
    // is not "they have filled it in". Prefill and the save-back prompt both
    // need to know whether there is anything worth copying.
    hasCareerProfile: !!careerProfile && hasAnyContent(careerProfile),
    isFetchingCareerProfile: isFetching,
    errorCareerProfile: error,
    refetchCareerProfile: refetch,
  };
};

const hasAnyContent = function (profile: CareerProfile) {
  const hasPersonalInfo = Object.values(profile.personalInfo ?? {}).some(
    (value) => !!value,
  );

  const hasSections = [
    profile.experience,
    profile.education,
    profile.skills,
    profile.languages,
    profile.certifications,
    profile.projects,
    profile.references,
  ].some((section) => !!section?.length);

  return hasPersonalInfo || hasSections;
};
