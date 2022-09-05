// material
import {
  Box,
  Card,
  Table,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
} from "@material-ui/core";
// components
import ClickableText from "../../components/ClickableText";

// ----------------------------------------------------------------------

export default function StudentTableBody(props) {
  const { dataTable = [], selectedIds = [], handleClick, showDialog } = props;

  return (
    <TableBody>
      {dataTable.map((row) => {
        const {
          id,
          name,
          niy,
          parent_mother,
          parent_father,
          jenjang = {},
          kelas = {},
          parallel = {},
        } = row;
        const isItemSelected = selectedIds.indexOf(id) !== -1;
        let title = "";
        if (parallel != null) {
          if (parallel.jurusan != null) {
            title = `${parallel.name} ${parallel.jurusan.code}`;
          } else {
            title = `${parallel.name}`;
          }
        } else {
          title = ``;
        }
        return (
          <TableRow
            hover
            key={id}
            tabIndex={-1}
            role="checkbox"
            selected={isItemSelected}
            aria-checked={isItemSelected}
            onClick={(event) => handleClick(event, id, row)}
          >
            <TableCell padding="checkbox">
              <Checkbox checked={isItemSelected} />
            </TableCell>
            <TableCell component="th" scope="row" padding="none">
              <Box
                sx={{
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ClickableText
                  variant="subtitle2"
                  onClick={() => showDialog("READ", row)}
                  text={name}
                />
              </Box>
            </TableCell>
            <TableCell>{niy}</TableCell>
            <TableCell>{jenjang && jenjang.code}</TableCell>
            <TableCell>{kelas && kelas.name}</TableCell>
            <TableCell>{parallel && title}</TableCell>
            <TableCell>{parent_father && parent_father.ktp}</TableCell>
            <TableCell>
              <Box
                sx={{
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  minWidth: 150,
                }}
              >
                {parent_father && parent_father.name}
              </Box>
            </TableCell>
            <TableCell>{parent_father && parent_father.mobilePhone}</TableCell>
            <TableCell>{parent_mother && parent_mother.ktp}</TableCell>
            <TableCell>{parent_mother && parent_mother.name}</TableCell>
            <TableCell>{parent_mother && parent_mother.mobilePhone}</TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
