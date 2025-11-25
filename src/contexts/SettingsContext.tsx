"use client";

import { API_ENDPOINTS } from "@/config/api.endpoint";
import { SiteSettingsModel } from "@/config/models/site-settings";
import { IResponseWithData } from "@/config/types";
import { swrFetcher } from "@/utils/swr-fetcher";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import useSWR from "swr";

const INITIAL_STATE: SiteSettingsModel = {
  address: "108 A Đường Đinh Văn Tả , Phường Bình Hàn , Hai Duong, Vietnam",
  phone: "0977661882",
  email: "congbinhdental.tbyt@gmail.com",
  facebook: "",
  twitter: "",
  siteDescription: "",
  siteName: "",
};

interface IContextProps {
  value: SiteSettingsModel;
  handleMutate: () => void;
}

const SettingsContext = createContext<IContextProps>({
  value: INITIAL_STATE,
  handleMutate: () => {},
});

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const { data, mutate } = useSWR<IResponseWithData<SiteSettingsModel>>(
    `${API_ENDPOINTS.SITE_SETTINGS.INDEX}`,
    swrFetcher
  );

  const handleMutate = () => mutate();
  const contextValue = useMemo(
    () => ({
      value: data?.content || INITIAL_STATE,
      handleMutate,
    }),
    [data, handleMutate]
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => useContext(SettingsContext);
export default SettingsContext;
