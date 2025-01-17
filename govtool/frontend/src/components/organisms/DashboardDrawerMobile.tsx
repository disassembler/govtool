import { Box, Grid, IconButton, SwipeableDrawer } from "@mui/material";

import { Background, Link } from "@atoms";
import { CONNECTED_NAV_ITEMS, ICONS } from "@consts";
import { DRepInfoCard, WalletInfoCard } from "@molecules";
import { useGetVoterInfo, useScreenDimension } from "@hooks";
import { openInNewTab } from "@utils";

import { DashboardDrawerMobileProps } from "./types";

const DRAWER_PADDING = 2;
// 8 is number of multiple in Material UI 2 is left and right side
const CALCULATED_DRAWER_PADDING = DRAWER_PADDING * 8 * 2;

export const DashboardDrawerMobile = ({
  isDrawerOpen,
  setIsDrawerOpen,
}: DashboardDrawerMobileProps) => {
  const { screenWidth } = useScreenDimension();
  const { voter } = useGetVoterInfo();

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <SwipeableDrawer
      anchor="right"
      onClose={closeDrawer}
      onOpen={openDrawer}
      open={isDrawerOpen}
    >
      <Background>
        <Box
          sx={{
            flex: 1,
            px: DRAWER_PADDING,
            pb: 3,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                flex: 1,
                justifyContent: "space-between",
                py: 3,
                width: screenWidth - CALCULATED_DRAWER_PADDING,
              }}
            >
              <img alt="app-logo" src={ICONS.appLogoIcon} height={25} />
              <IconButton
                data-testid="close-drawer-button"
                onClick={closeDrawer}
                sx={{ padding: 0 }}
              >
                <img alt="drawer" src={ICONS.closeDrawerIcon} />
              </IconButton>
            </Box>
            <Grid container direction="column" rowGap={4} mt={6}>
              {CONNECTED_NAV_ITEMS.map((navItem) => (
                <Grid item>
                  <Link
                    {...navItem}
                    size="big"
                    onClick={() => {
                      // TODO: Refine if it is needed to remove this eslint-disable
                      // eslint-disable-next-line no-unused-expressions
                      navItem.newTabLink && openInNewTab(navItem.newTabLink);
                      setIsDrawerOpen(false);
                    }}
                    isConnectWallet
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
          {(voter?.isRegisteredAsDRep || voter?.isRegisteredAsSoleVoter) && (
            <DRepInfoCard />
          )}
          <Box py={2} />
          <WalletInfoCard />
        </Box>
      </Background>
    </SwipeableDrawer>
  );
};
