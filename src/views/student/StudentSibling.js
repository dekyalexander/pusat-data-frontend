import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Table,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Button,
  Grid,
  Typography,
  TableContainer,
  Dialog,
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
  Input,
  CircularProgress
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MButton } from '../../components/@material-extend';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import StudentListHead from './StudentListHead';
import Conditional from '../../components/Conditional';
import DeleteConfirmation from '../../components/DeleteConfirmation';
import { axiosInstance as axios, endpoint } from '../../utils/axios';
import { useDebounce } from "react-use";
import Protected from 'src/components/Protected';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'jenjang', label: 'Jenjang', alignRight: false },
  { id: 'kelas', label: 'Kelas', alignRight: false },
  { id: 'parallel', label: 'Parallel', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
];

// ---------------------------------------------------------------------

export default function StudentSibling(props) {
  const {
    row,
    submitSuccess,
    submitError,
    closeMainDialog
  } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [order, setOrder] = useState('asc');
  const [dataTable, setdataTable] = useState([]);
  const [selectedSibling, setselectedSibling] = useState([]);
  const [newSiblings, setnewSiblings] = useState([]);
  const [siblingOptions, setsiblingOptions] = useState([]);
  const [openSubDialog, setopenSubDialog] = useState(false);
  const [openSiblingAutoComplete, setopenSiblingAutoComplete] = useState(false);
  const [siblingAutoCompleteLoading, setsiblingAutoCompleteLoading] = useState(false);
  const [autoCompleteKeyword, setAutoCompleteKeyword] = useState('');
  const [selectSibling, setselectSibling] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState('sm');
  const [actionCode, setactionCode] = useState('READ');

  
  const getStudentSiblingData = async() => {
    const params = {
      niy:row.niy
    }
    const response = await axios.get(endpoint.student.sibling,{params:params});
    if (response && response.data) {
      setdataTable(response.data);
    }
  };

  const getsiblingOptions = async(autoCompleteKeyword) => {
    setsiblingAutoCompleteLoading(true)
    const params = {
      name:autoCompleteKeyword
    }
    const response = await axios.get(endpoint.sibling.option,{params:params});
    if (response && response.data) {
      setsiblingOptions(response.data);
    }
    setsiblingAutoCompleteLoading(false)
    
  };

  useDebounce(
    () => {
      if(autoCompleteKeyword.trim()!=''){
        getsiblingOptions(autoCompleteKeyword)
      }      
    },
    500,
    [autoCompleteKeyword]
  );

  const closeSubDialog = () => {
    setopenSubDialog(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = dataTable.map((n) => n.id);
      setselectedSibling(newSelecteds);
      return;
    }
    setselectedSibling([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedSibling.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedSibling, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedSibling.slice(1));
    } else if (selectedIndex === selectedSibling.length - 1) {
      newSelected = newSelected.concat(selectedSibling.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedSibling.slice(0, selectedIndex),
        selectedSibling.slice(selectedIndex + 1)
      );
    }
    setselectedSibling(newSelected);
  };


  const showDeleteConfirmation = () => {
    setMaxWidth('sm');
    setdialogContent(
      <DeleteConfirmation
        handleClose={closeSubDialog}
        handleDelete={handleDelete}
        selectedIds={selectedSibling}
        title="Sibling"
      />
    );
    setopenSubDialog(true);
  };

  const handleDelete = async () => {
    const params={
      student_id:row.id,
      sibling_ids:selectedSibling
    }
    const response = await axios.delete(endpoint.student.sibling, {
      data: params
    });
    if (response) {
      submitSuccess('delete data success');
      getStudentSiblingData();
    }
    setselectedSibling([])
  };

  const showSelectSibling = () => {
    setselectSibling(true);
  };

  const addSibling = async() => {
    const sibling_ids = newSiblings.map(sibling=>(sibling.id))
    const params={
      student_id:row.id,
      sibling_ids:sibling_ids
    }
    await axios.put(endpoint.student.sibling, params);
    
    getStudentSiblingData()
    setselectSibling(false);
  };

  const selectNewSibling = (e)=>{
    setnewSiblings(e.target.value)
  }

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    if(row){
      getStudentSiblingData();
    }
    
  }, [row]);

  return (
    <>
      <Container>
        <Grid container style={{ marginBottom: 16 }}>
          <Grid container justifyContent="flex-end" alignItems="center">
              <Conditional condition={selectSibling === true}>
              <Autocomplete
                multiple
                id="get-sibling"
                style={{ width: 300 }}
                open={openSiblingAutoComplete}
                onOpen={() => {
                  setopenSiblingAutoComplete(true);
                }}
                onClose={() => {
                  setopenSiblingAutoComplete(false);
                }}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                options={siblingOptions}
                loading={siblingAutoCompleteLoading}
                onChange={(event, newValue) => {
                  setnewSiblings(newValue)
                }}
                onInputChange={(event, newInputValue) => {
                  setAutoCompleteKeyword(newInputValue)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Siblings"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {siblingAutoCompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
                <MButton
                  variant="contained"
                  color="primary"
                  style={{ margin: '0 8px' }}
                  onClick={addSibling}
                >
                  Submit Sibling
                </MButton>
                <MButton
                  variant="contained"
                  color="error"
                  style={{ margin: '0 8px' }}
                  onClick={()=>setselectSibling(false)}
                >
                  Cancel
                </MButton>
              </Conditional>
              <Conditional condition={selectedSibling.length > 0}>
                <Protected allowedCodes={['EDIT']} >
                  <MButton
                    variant="contained"
                    color="error"
                    style={{ margin: '0 8px' }}
                    onClick={showDeleteConfirmation}
                  >
                    Delete
                  </MButton>
                </Protected>
              </Conditional>

              <Conditional condition={selectSibling === false}>
                <Protected allowedCodes={['EDIT']} >
                  <MButton
                    variant="contained"
                    color="primary"
                    style={{ margin: '0 8px' }}
                    onClick={showSelectSibling}
                  >
                    Add Sibling
                  </MButton>                
                </Protected>
              </Conditional>
          </Grid>
        </Grid>

        <Card style={{ marginBottom: 16 }}>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <StudentListHead
                  order={order}
                  headLabel={TABLE_HEAD}
                  rowCount={dataTable.length}
                  numSelected={selectedSibling.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {dataTable.map((row) => {
                      const { id, name, jenjang, kelas, parallel } = row;
                      const isItemSelected = selectedSibling.indexOf(id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          student="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                          onClick={(event) => handleClick(event, id)}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            {name}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            {jenjang && jenjang.name}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            {kelas && kelas.name}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            {parallel && parallel.name}
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            {status && status.name}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  
                </TableBody>
                
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>

        <Grid container>
          <Grid item xs={6} container justifyContent="flex-start">
            
          </Grid>

          <Grid item xs={6} container justifyContent="flex-end">
            {props.closeSubDialog && (
              <Button
                variant="contained"
                onClick={props.closeSubDialog}
                color="inherit"
              >
                close
              </Button>
            )}

            {closeMainDialog && (
              <Button
                variant="contained"
                onClick={closeMainDialog}
                color="inherit"
              >
                close
              </Button>
            )}
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={openSubDialog}
        maxWidth={maxWidth}
        onClose={closeSubDialog}
        fullWidth
        scroll="body"
      >
        {dialogContent}
      </Dialog>
    </>
  );
}
