import { API_ENDPOINTS } from "@/provider/endpoints";
import { useGetData } from "../use-get-data";
import { APIResponse } from "../../../types/response";
import { Profession } from "../../../types/auth";

export const useGetProfessions = function () {
  const { data, isFetching, error } = useGetData<APIResponse<Profession[]>>({
    url: API_ENDPOINTS.professions.list,
  });

  return {
    professions: data?.data ?? [],
    isFetchingProfessions: isFetching,
    errorProfessions: error,
  };
};
