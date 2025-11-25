"use client";

import {
  Checkbox,
  styled,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  padding: "16px",
  color: theme.palette.grey[900],
})); // ----------------------------------------------------------------------

// ----------------------------------------------------------------------
const TableHeaderNoSort = (props) => {
  const {
    heading,
    rowCount,
    numSelected,
    onSelectAllClick = () => {},
    hideSelectBtn = false,
  } = props;
  return (
    <TableHead
      sx={{
        backgroundColor: "grey.200",
      }}
    >
      <TableRow>
        {!hideSelectBtn && (
          <StyledTableCell align="left">
            <Checkbox
              color="info"
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={(event) =>
                onSelectAllClick(event.target.checked, "product")
              }
            />
          </StyledTableCell>
        )}

        {heading.map((headCell) => (
          <StyledTableCell key={headCell.id} align={headCell.align}>
            {headCell.label}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeaderNoSort;
