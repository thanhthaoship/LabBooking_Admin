"use client";

import { FlexBox } from "@/components/flex-box";
import SearchInput from "@components/SearchInput";
import { Add } from "@mui/icons-material";
import { Button, InputBaseProps, Theme, useMediaQuery } from "@mui/material";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";

// Update interface
interface SearchAreaProps extends InputBaseProps {
  searchPlaceholder?: string;
  buttonText?: string;
  handleSearch: (searchTerm: string) => void;
  handleBtnClick?: () => void;
  value?: string;
  additionalFilter?: React.ReactNode;
  additionalAction?: React.ReactNode; // Add this line
}

const SearchArea = ({
  handleSearch,
  searchPlaceholder = "Tìm kiếm...",
  buttonText = "Thêm Mới",
  value = "",
  additionalFilter,
  additionalAction,
  handleBtnClick,
}: SearchAreaProps) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const handleOnChange = (searchTerm: string) => setSearchTerm(searchTerm);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isEmpty(searchTerm)) {
        handleSearch(searchTerm);
      }
    }, 1000);

    if (isEmpty(searchTerm)) {
      handleSearch(searchTerm);
    }

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap">
      <SearchInput
        onChange={(e) => handleOnChange(e.currentTarget.value)}
        placeholder={searchPlaceholder}
        value={searchTerm}
      />
      {additionalFilter}

      <FlexBox gap={1}>
        {additionalAction}
        {handleBtnClick && (
          <Button
            onClick={handleBtnClick}
            color="info"
            fullWidth={downSM}
            variant="contained"
            startIcon={<Add />}
            sx={{
              maxHeight: 44,
            }}
          >
            {buttonText}
          </Button>
        )}
      </FlexBox>
    </FlexBox>
  );
};

export default SearchArea;
