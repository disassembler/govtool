import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";

import { Typography } from "@atoms";
import { Share } from "@molecules";
import { MetadataValidationStatus } from "@models";
import { getMetadataDataMissingStatusTranslation } from "@/utils";

type GovernanceActionDetailsCardHeaderProps = {
  title?: string;
  isDataMissing: boolean | MetadataValidationStatus;
};

export const GovernanceActionDetailsCardHeader = ({
  title,
  isDataMissing,
}: GovernanceActionDetailsCardHeaderProps) => {
  const { pathname, hash } = useLocation();

  const govActionLinkToShare = `${window.location.protocol}//${
    window.location.hostname
  }${window.location.port ? `:${window.location.port}` : ""}${pathname}${hash}`;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 2,
        alignItems: "center",
        mb: 2,
      }}
      data-testid="governance-action-details-card-header"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: 600,
            ...(isDataMissing && { color: "errorRed" }),
          }}
          variant="title2"
        >
          {(isDataMissing !== false &&
            getMetadataDataMissingStatusTranslation(
              isDataMissing as MetadataValidationStatus,
            )) ||
            title}
        </Typography>
      </Box>
      <Share link={govActionLinkToShare} />
    </Box>
  );
};
