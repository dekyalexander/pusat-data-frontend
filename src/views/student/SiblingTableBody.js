// material
import {
  Box,
  Card,
  Table,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell
} from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
// components
import ClickableText from '../../components/ClickableText';

// ----------------------------------------------------------------------


export default function SiblingTableBody(props) {
  const { dataTable = [], selectedIds = [], handleClick, showDialog } = props
  return (
    <TableBody>
      {dataTable.map((row) => {
        const { id, name, niy, jenjang = {}, kelas = {}, parallel = {}, sibling_students = [] } = row;
        const isItemSelected = selectedIds.indexOf(id) !== -1;
        let title = '';
        if(parallel != null){
          if(parallel.jurusan != null){
            title = `${parallel.name} ${parallel.jurusan.code}`;
          }else{
            title = `${parallel.name}`
          }
        }else{
          title = ``
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
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ClickableText
                  variant="subtitle2"
                  onClick={() => showDialog('READ', row)}
                  text={name}
                />
              </Box>
            </TableCell>
            <TableCell>
              {niy}
            </TableCell>
            <TableCell>
              {jenjang && jenjang.code}
            </TableCell>
            <TableCell>
              {kelas && kelas.name}
            </TableCell>
            <TableCell sx={{ minWidth: 130 }}>
              {parallel && title}
            </TableCell>
            <TableCell>
              {
                sibling_students && sibling_students.map(sibling => (
                  <Box key={sibling.id} sx={{
                    border: 1,
                    p:1,
                    whiteSpace:'nowrap',
                  }}>
                    {sibling.name}-
                    {sibling.jenjang && sibling.jenjang.code}-
                    {sibling.kelas && sibling.kelas.name}-
                    {sibling.parallel && sibling.parallel.name}
                  </Box>
                ))
              }
            </TableCell>
          </TableRow>
        );
      })}

    </TableBody>
  );
}
