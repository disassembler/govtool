import { Box, Link, Typography } from "@mui/material";
import { useMemo } from "react";

import { ModalContents, ModalHeader, ModalWrapper } from "@atoms";
import type { WalletOption } from "@molecules";
import { WalletOptionButton } from "@molecules";
import { openInNewTab } from "@utils";
import { useTranslation } from "@hooks";

export const ChooseWalletModal = () => {
  const { t } = useTranslation();

  const walletOptions: WalletOption[] = useMemo(() => {
    if (!window.cardano) return [];
    const keys = Object.keys(window.cardano);
    const resultWallets: WalletOption[] = [];
    keys.forEach((k: string) => {
      const { icon, name, supportedExtensions } = window.cardano[k];
      if (icon && name && supportedExtensions) {
        // Check if the name already exists in resultWallets
        const isNameDuplicate = resultWallets.some(
          (wallet) => wallet.label === name,
        );
        // Check if the supportedExtensions array contains an entry with cip === 95
        const isCip95Available = Boolean(
          supportedExtensions?.find((i) => i.cip === 95),
        );
        // If the name is not a duplicate and cip === 95 is available, add it to resultWallets
        if (!isNameDuplicate && isCip95Available) {
          resultWallets.push({
            icon,
            label: name,
            name: k,
            cip95Available: true,
          });
        }
      }
    });
    return resultWallets;
  }, [window]);

  return (
    <ModalWrapper dataTestId="connect-your-wallet-modal">
      <ModalHeader>{t("wallet.connectYourWallet")}</ModalHeader>
      <ModalContents>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: "500",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          {t("wallet.chooseWallet")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "500px",
            overflow: "auto",
            width: "100%",
            padding: "8px",
          }}
        >
          {!walletOptions.length ? (
            <Typography
              color="primary"
              variant="body2"
              fontWeight={600}
              sx={{ textAlign: "center" }}
            >
              {t("wallet.noWalletsToConnect")}
            </Typography>
          ) : (
            walletOptions.map(({ icon, label, name, cip95Available }) => (
              <WalletOptionButton
                dataTestId={`${name}-wallet-button`}
                key={name}
                icon={icon}
                label={label}
                name={name}
                cip95Available={cip95Available}
              />
            ))
          )}
        </Box>
        <Typography
          sx={{
            fontSize: "11px",
            fontWeight: "500",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          {t("wallet.cantSeeWalletQuestion")}
          <Link
            fontSize={11}
            fontWeight={500}
            onClick={() =>
              openInNewTab(
                "https://docs.sanchogov.tools/how-to-use-the-govtool/getting-started/get-a-compatible-wallet",
              )
            }
            sx={{ cursor: "pointer" }}
          >
            {t("here")}
          </Link>
          .
        </Typography>
      </ModalContents>
    </ModalWrapper>
  );
};
