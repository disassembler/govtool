import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { blake2bHex } from "blakejs";
import { captureException } from "@sentry/react";
import { NodeObject } from "jsonld";

import {
  CIP_QQQ,
  DREP_CONTEXT,
  PATHS,
  storageInformationErrorModals,
} from "@consts";
import { useCardano, useModal } from "@context";
import {
  canonizeJSON,
  downloadJson,
  generateJsonld,
  generateMetadataBody,
} from "@utils";
import { MetadataValidationStatus } from "@models";

import { useValidateMutation } from "../mutations";

export type EditDRepInfoValues = {
  bio?: string;
  dRepName: string;
  email?: string;
  links?: Array<{ link: string }>;
  storeData?: boolean;
  storingURL: string;
};

export const defaultEditDRepInfoValues: EditDRepInfoValues = {
  bio: "",
  dRepName: "",
  email: "",
  links: [{ link: "" }],
  storeData: false,
  storingURL: "",
};

export const useEditDRepInfoForm = (
  setStep?: Dispatch<SetStateAction<number>>,
) => {
  // Local state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string | null>(null);
  const [json, setJson] = useState<NodeObject | null>(null);

  // DApp Connector
  const { buildDRepUpdateCert, buildSignSubmitConwayCertTx } = useCardano();

  // App Management
  const { closeModal, openModal } = useModal();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Queries
  const { validateMetadata } = useValidateMutation();

  // Form
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
    register,
    resetField,
    watch,
  } = useFormContext<EditDRepInfoValues>();
  const dRepName = watch("dRepName");
  const isError = Object.keys(errors).length > 0;

  // Navigation
  const backToForm = useCallback(() => {
    setStep?.(1);
    closeModal();
  }, [setStep]);

  const backToDashboard = useCallback(() => {
    navigate(PATHS.dashboard);
    closeModal();
  }, []);

  // Business Logic
  const generateMetadata = useCallback(async () => {
    const body = generateMetadataBody({
      data: getValues(),
      acceptedKeys: ["dRepName", "bio", "email"],
      standardReference: CIP_QQQ,
    });

    const jsonld = await generateJsonld(body, DREP_CONTEXT, CIP_QQQ);

    const canonizedJson = await canonizeJSON(jsonld);
    const canonizedJsonHash = blake2bHex(canonizedJson, undefined, 32);

    setHash(canonizedJsonHash);
    setJson(jsonld);

    return jsonld;
  }, []);

  const onClickDownloadJson = async () => {
    if (!json) return;
    downloadJson(json, dRepName);
  };

  const showLoadingModal = useCallback(() => {
    openModal({
      type: "loadingModal",
      state: {
        title: t("modals.pendingValidation.title"),
        message: t("modals.pendingValidation.message"),
        dataTestId: "storing-information-loading",
      },
    });
  }, []);

  const showSuccessModal = useCallback(() => {
    openModal({
      type: "statusModal",
      state: {
        status: "success",
        title: t("modals.registration.title"),
        message: t("modals.registration.message"),
        buttonText: t("modals.common.goToDashboard"),
        dataTestId: "governance-action-submitted-modal",
        onSubmit: backToDashboard,
      },
    });
  }, []);

  const onSubmit = useCallback(
    async (data: EditDRepInfoValues) => {
      const url = data.storingURL;

      try {
        if (!hash) throw MetadataValidationStatus.INVALID_HASH;

        setIsLoading(true);
        showLoadingModal();

        const { status } = await validateMetadata({
          url,
          hash,
        });

        if (status) {
          throw status;
        }

        const updateDRepMetadataCert = await buildDRepUpdateCert(url, hash);
        await buildSignSubmitConwayCertTx({
          certBuilder: updateDRepMetadataCert,
          type: "updateMetaData",
        });

        showSuccessModal();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (Object.values(MetadataValidationStatus).includes(error)) {
          openModal({
            type: "statusModal",
            state: {
              ...storageInformationErrorModals[
                error as MetadataValidationStatus
              ],
              onSubmit: backToForm,
              onCancel: backToDashboard,
            },
          });
        } else {
          captureException(error);
          openModal({
            type: "statusModal",
            state: {
              status: "warning",
              message: error?.replace("Error: ", ""),
              onSubmit: () => {
                closeModal();
                backToDashboard();
              },
              title: t("modals.common.oops"),
              dataTestId: "wallet-connection-error-modal",
            },
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [buildDRepUpdateCert, buildSignSubmitConwayCertTx, hash],
  );

  return {
    control,
    errors,
    generateMetadata,
    getValues,
    isError,
    isEditDRepMetadataLoading: isLoading,
    isValid,
    onClickDownloadJson,
    register,
    editDRepInfo: handleSubmit(onSubmit),
    resetField,
    watch,
  };
};
