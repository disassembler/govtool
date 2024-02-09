import { useMemo } from "react";
import { useNavigate, generatePath } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import { Slider } from "./Slider";

import { Typography } from "@atoms";
import {
  useGetDRepVotesQuery,
  useGetProposalsQuery,
  useScreenDimension,
  useTranslation,
} from "@hooks";
import { GovernanceActionCard } from "@molecules";
import { GOVERNANCE_ACTIONS_FILTERS, PATHS } from "@consts";
import { useCardano } from "@context";
import { getProposalTypeLabel, getFullGovActionId, openInNewTab } from "@utils";

type GovernanceActionsToVoteProps = {
  filters: string[];
  onDashboard?: boolean;
  searchPhrase?: string;
  sorting: string;
};

const defaultCategories = GOVERNANCE_ACTIONS_FILTERS.map(
  (category) => category.key
);

export const GovernanceActionsToVote = ({
  filters,
  onDashboard = true,
  searchPhrase = "",
  sorting,
}: GovernanceActionsToVoteProps) => {
  const { voteTransaction } = useCardano();
  const navigate = useNavigate();
  const { isMobile } = useScreenDimension();
  const { t } = useTranslation();

  const queryFilters = filters.length > 0 ? filters : defaultCategories;

  const { proposals, isProposalsLoading } = useGetProposalsQuery({
    filters: queryFilters,
    sorting,
  });

  const groupedByType = (data?: ActionType[]) => {
    return data?.reduce((groups, item) => {
      const itemType = item.type;

      if (!groups[itemType]) {
        groups[itemType] = {
          title: itemType,
          actions: [],
        };
      }

      groups[itemType].actions.push(item);

      return groups;
    }, {});
  };

  const mappedData = useMemo(() => {
    const groupedData = groupedByType(
      proposals?.filter((i) =>
        getFullGovActionId(i.txHash, i.index)
          .toLowerCase()
          .includes(searchPhrase.toLowerCase())
      )
    );
    return Object.values(groupedData ?? []) as ToVoteDataType;
  }, [proposals, searchPhrase]);

  return !isProposalsLoading ? (
    <>
      {!mappedData.length ? (
        <Typography fontWeight={300} sx={{ py: 4 }}>
          {t("govActions.noResultsForTheSearch")}
        </Typography>
      ) : (
        <>
          {mappedData?.map((item, index) => {
            return (
              <Box key={item.title} pb={2.5}>
                <Slider
                  data={item.actions.slice(0, 6).map((item) => {
                    return (
                      <div
                        className="keen-slider__slide"
                        key={item.id}
                        style={{
                          overflow: "visible",
                          width: "auto",
                        }}
                      >
                        <GovernanceActionCard
                          {...item}
                          txHash={item.txHash}
                          index={item.index}
                          inProgress={
                            onDashboard &&
                            voteTransaction?.proposalId ===
                              item?.txHash + item?.index
                          }
                          onClick={() =>
                            onDashboard &&
                            voteTransaction?.proposalId ===
                              item?.txHash + item?.index
                              ? openInNewTab(
                                  "https://adanordic.com/latest_transactions"
                                )
                              : navigate(
                                  onDashboard
                                    ? generatePath(
                                        PATHS.dashboard_governance_actions_action,
                                        {
                                          proposalId: getFullGovActionId(
                                            item.txHash,
                                            item.index
                                          ),
                                        }
                                      )
                                    : PATHS.governance_actions_action.replace(
                                        ":proposalId",
                                        getFullGovActionId(
                                          item.txHash,
                                          item.index
                                        )
                                      ),
                                  {
                                    state: { ...item },
                                  }
                                )
                          }
                        />
                      </div>
                    );
                  })}
                  dataLength={item.actions.slice(0, 6).length}
                  filters={filters}
                  navigateKey={item.title}
                  notSlicedDataLength={item.actions.length}
                  onDashboard={onDashboard}
                  searchPhrase={searchPhrase}
                  sorting={sorting}
                  title={getProposalTypeLabel(item.title)}
                />
                {index < mappedData.length - 1 && (
                  <Box height={isMobile ? 40 : 52} />
                )}
              </Box>
            );
          })}
        </>
      )}
    </>
  ) : (
    <Box
      alignItems="center"
      display="flex"
      flex={1}
      height="100%"
      justifyContent="center"
    >
      <CircularProgress />
    </Box>
  );
};