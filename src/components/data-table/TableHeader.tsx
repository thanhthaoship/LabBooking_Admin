"use client";

import { SortDirection, TableHeadingItem } from "@/config/table/types";
import UpDown from "@components/icons/UpDown"; // styled components
import {
  styled,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  padding: "16px 20px",
  color: theme.palette.grey[900],
})); // ----------------------------------------------------------------------

interface IProps {
  heading: TableHeadingItem[];
  hideSelectBtn: boolean;
  rowCount: number;
  sortDirection?: SortDirection;
  sortBy?: string;
  onRequestSort?: (sortBy: string) => void;
  numSelected?: number;
  onSelectAllClick?: () => void;
}
// ----------------------------------------------------------------------
const TableHeader = ({
  sortDirection,
  heading,
  sortBy,
  onRequestSort,
  hideSelectBtn = false,
}: IProps) => {
  return (
    <TableHead
      sx={{
        backgroundColor: "grey.200",
      }}
    >
      <TableRow>
        {!hideSelectBtn && (
          <StyledTableCell align="left">
            {/* <Checkbox
              color="info"
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={(event) =>
                onSelectAllClick(event.target.checked, "product")
              }
            /> */}
          </StyledTableCell>
        )}

        {heading.map((headCell: TableHeadingItem) => {
          const isActive = sortBy === headCell.id;

          return (
            <StyledTableCell
              key={headCell.id}
              align={headCell.align}
              sortDirection={isActive ? sortDirection : false}
            >
              {headCell.sortable ? (
                <TableSortLabel
                  active={isActive}
                  onClick={() => onRequestSort?.(headCell.id)}
                  direction={isActive ? sortDirection : "asc"}
                  sx={{
                    "& .MuiTableSortLabel-icon": {
                      opacity: 1,
                    },
                  }}
                  IconComponent={() => (
                    <UpDown
                      sx={{
                        fontSize: 14,
                        ml: 1,
                        color: isActive ? "blue" : "grey.600",
                      }}
                    />
                  )}
                >
                  {headCell.label}
                </TableSortLabel>
              ) : (
                headCell.label
              )}
            </StyledTableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
