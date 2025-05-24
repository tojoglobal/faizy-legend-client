import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../Hooks/useAxiospublic";

const useDataQuery = (key, url, enabled = true, normalizer = null) => {
  const axiospublic = useAxiospublic();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await axiospublic.get(url);
      const rawData = res.data;
      return normalizer ? normalizer(rawData) : rawData;
      // return res.data;
    },
    enabled:
      typeof enabled === "function" || typeof enabled === "boolean"
        ? enabled
        : true,
  });
  return { isLoading, data, error, refetch };
};

export default useDataQuery;
