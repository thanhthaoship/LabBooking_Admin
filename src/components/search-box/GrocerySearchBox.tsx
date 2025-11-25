import { API_ENDPOINTS } from "@/config/api.endpoint";
import { IProductFilterRequest, ProductModel } from "@/config/models/product";
import { IPagedResult, IResponseWithData } from "@/config/types";
import { defaultImageSrc } from "@/utils/constants";
import { swrFetcher } from "@/utils/swr-fetcher";
import {
  Box,
  Button,
  ClickAwayListener,
  MenuItem,
  Stack,
  SxProps,
  TextField,
} from "@mui/material";
import { ChangeEvent, useRef, useState, useTransition } from "react";
import useSWR from "swr";
import { SearchOutlinedIcon, SearchResultCard } from "./styled";
import { isEmpty } from "lodash";
import { FlexBox } from "../flex-box";
import Image from "next/image";
import { currency } from "@/lib";
import { Span } from "../Typography";
import { useRouter } from "next/navigation";
import { COMMON_ROUTES } from "@/config/routes";

interface IResult {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
}

const GrocerySearchBox = () => {
  const router = useRouter();

  const parentRef = useRef<HTMLDivElement>(null);
  const [_, startTransition] = useTransition();
  const [params, setParams] = useState<IProductFilterRequest>({
    pageNumber: 1,
    pageSize: 10,
    searchTerm: "",
  });

  const buildQueryParams = () => {
    const queryParams = new URLSearchParams();
    if (params.searchTerm) {
      queryParams.append("searchTerm", params.searchTerm);
      queryParams.append("pageNumber", params.pageNumber.toString());
      queryParams.append("pageSize", params.pageSize.toString());
    }

    return queryParams.toString();
  };

  const { data, isLoading } = useSWR<
    IResponseWithData<IPagedResult<ProductModel>>
  >(`${API_ENDPOINTS.PRODUCT.FILTER}?${buildQueryParams()}`, swrFetcher);

  const products = isEmpty(params.searchTerm) ? [] : data?.content?.items || [];

  const searchResults: IResult[] = products.map((product: ProductModel) => {
    const result: IResult = {
      productId: product.productId,
      name: product.name,
      imageUrl: product?.medias?.[0]?.fileUrl || defaultImageSrc,
      price: product.price,
    };
    return result;
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, searchTerm: e.target.value, pageNumber: 1 });
  };

  const inputSx: SxProps = {
    height: 44,
    paddingRight: 0,
    borderRadius: 300,
    color: "grey.700",
    overflow: "hidden",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "primary.main",
    },
  };

  const buttonSx: SxProps = {
    width: 160,
    height: "100%",
    borderRadius: "0 300px 300px 0",
  };

  function navigateToProductDetails(productId: string): void {
    setParams({ ...params, searchTerm: "" });
    router.push(COMMON_ROUTES.PRODUCTS.DETAIL(productId));
  }

  return (
    <ClickAwayListener
      onClickAway={() => setParams({ ...params, searchTerm: "" })}
    >
      <Box
        position="relative"
        flex="1 1 0"
        maxWidth="670px"
        mx="auto"
        ref={parentRef}
      >
        <TextField
          fullWidth
          // value={params.searchTerm}
          variant="outlined"
          placeholder="Tìm kiếm sản phẩm"
          onChange={handleSearch}
          slotProps={{
            input: {
              sx: inputSx,
              endAdornment: (
                <Button
                  disabled={isLoading}
                  color="primary"
                  disableElevation
                  variant="contained"
                  sx={buttonSx}
                >
                  Tìm kiếm
                </Button>
              ),
              startAdornment: <SearchOutlinedIcon fontSize="small" />,
            },
          }}
        />

        {searchResults.length > 0 && (
          <SearchResultCard elevation={2}>
            {searchResults.map((item: IResult) => (
              <MenuItem
                key={item.productId}
                onClick={() => navigateToProductDetails(item.productId)}
              >
                <FlexBox gap={1}>
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={50}
                    height={50}
                    style={{ objectFit: "contain" }}
                  />
                  <Stack gap={1}>
                    <Span>{item.name}</Span>
                    <Span>{currency(item.price)}</Span>
                  </Stack>
                </FlexBox>
              </MenuItem>
            ))}
          </SearchResultCard>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default GrocerySearchBox;
