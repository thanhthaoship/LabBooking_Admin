"use client";

import SearchArea from "@/components/dashboard/SearchArea";
import Loading from "@/components/Loading";
import NotFound from "@/components/NotFound";
import { API_ENDPOINTS } from "@/config/api.endpoint";
import { AccountModel, AccountRoles } from "@/config/models/account";
import { ADMIN_ROUTES } from "@/config/routes";
import {
  IFilterRequest,
  IPagedResult,
  IResponseWithData,
} from "@/config/types";
import { swrNextFetcher } from "@/utils/swr-fetcher";
import TableHeader from "@components/data-table/TableHeader";
import Scrollbar from "@components/Scrollbar";
import { H3 } from "@components/Typography";
import { Edit } from "@mui/icons-material";
import {
  Box,
  Card,
  Chip,
  IconButton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";

import CustomSelect from "@/components/common/CustomSelect";
import TablePagination from "@/components/data-table/TablePagination";
import { FlexBox } from "@/components/flex-box";
import {
  accountTableHeading,
  AccountTableIds,
} from "@/config/table/account-heading";
import dayjs from "dayjs";
import React from "react";

interface IAccountFilterRequest extends IFilterRequest {
  role: "all" | "Admin" | "Manager";
  isActive: "all" | "active" | "inactive";
  sortBy: AccountTableIds;
}

export default function AccountListView() {
  const router = useRouter();
  const [params, setParams] = React.useState<IAccountFilterRequest>({
    pageNumber: 1,
    pageSize: 5,
    searchTerm: "",
    role: "all",
    isActive: "active",
    sortBy: "fullname",
    sortDirection: "asc",
  });

  const buildQueryParams = () => {
    const queryParams = new URLSearchParams();
    if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
    if (params.role !== "all") queryParams.append("role", params.role);
    if (params.isActive !== "all") {
      queryParams.append(
        "isActive",
        params.isActive === "active" ? "true" : "false"
      );
    }
    if (params.sortBy && params.sortDirection) {
      queryParams.append("sortBy", params.sortBy);
      queryParams.append("sortDirection", params.sortDirection);
    }
    queryParams.append("pageNumber", params.pageNumber.toString());
    queryParams.append("pageSize", params.pageSize.toString());
    return queryParams.toString();
  };

  const { data, isLoading } = useSWR<
    IResponseWithData<IPagedResult<AccountModel>>
  >(`${API_ENDPOINTS.ACCOUNT.FILTER}?${buildQueryParams()}`, swrNextFetcher);

  const pagedResult = data?.content || {
    items: [],
    pageNumber: 1,
    totalPages: 0,
    pageSize: 10,
    totalCount: 0,
  };

  const handleChangePage = (page: number) =>
    setParams({ ...params, pageNumber: page });

  const handleSort = (sortBy: AccountTableIds) => {
    setParams((prev) => ({
      ...prev,
      sortBy,
      sortDirection:
        prev.sortBy === sortBy && prev.sortDirection === "asc" ? "desc" : "asc",
    }));
  };

  // Update TableHeaderNoSort to TableHeader and pass sort handler
  return (
    <Box py={4}>
      <H3 mb={2}>Quản lý tài khoản</H3>

      <SearchArea
        handleSearch={(value) =>
          setParams({ ...params, pageNumber: 1, searchTerm: value })
        }
        buttonText="Thêm mới"
        handleBtnClick={() => router.push(ADMIN_ROUTES.ACCOUNT.CREATE)}
        searchPlaceholder="Tìm kiếm tài khoản..."
        additionalFilter={
          <FlexBox gap={2} flexWrap="wrap">
            <CustomSelect
              label="Vai trò"
              value={params.role}
              onChange={(value) =>
                setParams({ ...params, pageNumber: 1, role: value })
              }
              options={[
                { value: "all", label: "Tất cả" },
                { value: AccountRoles.User, label: "Người dùng" },
                { value: AccountRoles.Manager, label: "Quản lý" },
              ]}
              minWidth={200}
            />

            <CustomSelect
              label="Trạng thái"
              value={params.isActive}
              onChange={(value) =>
                setParams({ ...params, pageNumber: 1, isActive: value })
              }
              options={[
                { value: "all", label: "Tất cả" },
                { value: "active", label: "Đang hoạt động" },
                { value: "inactive", label: "Không hoạt động" },
              ]}
              minWidth={200}
            />
          </FlexBox>
        }
      />

      {pagedResult.items?.length > 0 ? (
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 900 }}>
              <Table>
                <TableHeader
                  sortDirection={params.sortDirection}
                  sortBy={params.sortBy}
                  hideSelectBtn
                  heading={accountTableHeading}
                  rowCount={pagedResult.items.length}
                  onRequestSort={handleSort}
                />

                <TableBody>
                  {pagedResult.items.map(
                    (account: AccountModel, index: number) => (
                      <TableRow key={account.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell align="left">{account.fullname}</TableCell>
                        <TableCell align="left">
                          {account.phoneNumber}
                        </TableCell>
                        <TableCell align="left">
                          {account.email || "-"}
                        </TableCell>
                        <TableCell align="left">
                          <Chip
                            size="small"
                            label={
                              account.roleName === AccountRoles.Manager
                                ? "Quản lý"
                                : "Người dùng"
                            }
                            color={
                              account.roleName === AccountRoles.Manager
                                ? "primary"
                                : "default"
                            }
                          />
                        </TableCell>
                        <TableCell align="left">
                          {dayjs(account.joinedDate).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell align="center">
                          <Switch checked={account.isActive} />
                        </TableCell>
                        <TableCell align="center">
                          <Link href={ADMIN_ROUTES.ACCOUNT.DETAILS(account.id)}>
                            <IconButton>
                              <Edit />
                            </IconButton>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          {pagedResult.totalPages > 1 && (
            <Stack alignItems="center" my={2}>
              <TablePagination
                onChange={(_, page) => handleChangePage(page)}
                count={pagedResult.totalPages}
                page={params.pageNumber}
                showFirstButton
                showLastButton
              />
            </Stack>
          )}
        </Card>
      ) : (
        <>{isLoading ? <Loading /> : <NotFound />}</>
      )}
    </Box>
  );
}
