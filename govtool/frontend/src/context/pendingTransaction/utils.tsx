import { QueryClient, QueryKey } from "react-query";
import { QUERY_KEYS } from "@/consts";
import { TransactionType, TransactionState } from "./types";

export const getDesiredResult = (
  type: TransactionType,
  resourceId: string | undefined,
) => {
  switch (type) {
    case "delegate": {
      // current delegation
      if (resourceId === "no confidence") return "drep_always_no_confidence";
      if (resourceId === "abstain") return "drep_always_abstain";
      return resourceId;
    }
    case "registerAsDrep":
    case "registerAsSoleVoter":
      // is registered
      return true;
    case "retireAsDrep":
    case "retireAsSoleVoter":
      // is registered
      return false;
    default:
      return undefined;
  }
};

export const getQueryKey = (
  type: TransactionType,
  transaction: TransactionState | null
) => {
  switch (type) {
    case "registerAsDrep":
    case "retireAsDrep":
    case "registerAsSoleVoter":
    case "retireAsSoleVoter":
      return [QUERY_KEYS.useGetDRepInfoKey, transaction?.transactionHash];
    case "delegate":
      return [QUERY_KEYS.getAdaHolderCurrentDelegationKey, transaction?.transactionHash];
    default:
      return undefined;
  }
};

export const refetchData = async (
  type: TransactionType,
  queryClient: QueryClient,
  queryKey: QueryKey | undefined
) => {
  if (queryKey === undefined) return;

  await queryClient.invalidateQueries(queryKey);
  // TODO add better type for query data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await queryClient.getQueryData<any>(queryKey);

  if (type === "delegate") return data;
  if (type === "registerAsDrep" || type === "retireAsDrep") return data.isRegisteredAsDRep;
  if (type === "registerAsSoleVoter" || type === "retireAsSoleVoter") return data.isRegisteredAsSoleVoter;
  return undefined;
};
