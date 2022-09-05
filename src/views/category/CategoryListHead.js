import {
  Checkbox,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Box,
} from "@material-ui/core";
import React from "react";

import { visuallyHidden } from "@material-ui/utils";

export default function CategoryListHead(props) {
  const {
    onSelectAllClick,
    rowCount,
    onRequestSort,
    numSelected,
    headLabel,
    order,
    orderBy,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headLabel.map((header) => (
          <TableCell
            key={header.id}
            align={header.alignRight ? "right" : "left"}
            sortDirection={orderBy === header.id ? order : false}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === header.id}
              direction={orderBy === header.id ? order : "asc"}
              onClick={createSortHandler(header.id)}
            >
              {header.label}
              {orderBy === header.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
