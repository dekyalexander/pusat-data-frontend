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
  { id: 'tahun pelajaran', label: 'Tahun Pelajaran', alignRight: false },
  { id: 'jenjang', label: 'Jenjang', alignRight: false },
  { id: 'kelas', label: 'Kelas', alignRight: false },
  { id: 'parallel', label: 'Parallel', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
];

// ---------------------------------------------------------------------

export default function StudentMutation(props) {
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
  const [selectedMutation, setselectedMutation] = useState([]);
  const [newMutations, setnewMutations] = useState([]);
  const [mutationOptions, setmutationOptions] = useState([]);
  const [openSubDialog, setopenSubDialog] = useState(false);
  const [openMutationAutoComplete, setopenMutationAutoComplete] = useState(false);
  const [mutationAutoCompleteLoading, setmutationAutoCompleteLoading] = useState(false);
  const [autoCompleteKeyword, setAutoCompleteKeyword] = useState('');
  const [selectMutation, setselectMutation] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState('sm');
  const [actionCode, setactionCode] = useState('READ');

  
  const getStudentMutationData = async() => {
    const params = {
      niy:row.niy
    }
    const response = await axios.get(endpoint.student.mutation,{params:params});
    if (response && response.data) {
      setdataTable(response.data);
    }
  };

  const getmutationOptions = async(autoCompleteKeyword) => {
    setmutationAutoCompleteLoading(true)
    const params = {
      name:autoCompleteKeyword
    }
    const response = await axios.get(endpoint.mutation.option,{params:params});
    if (response && response.data) {
      setmutationOptions(response.data);
    }
    setmutationAutoCompleteLoading(false)
    
  };

  useDebounce(
    () => {
      if(autoCompleteKeyword.trim()!=''){
        getmutationOptions(autoCompleteKeyword)
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
      setselectedMutation(newSelecteds);
      return;
    }
    setselectedMutation([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedMutation.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedMutation, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedMutation.slice(1));
    } else if (selectedIndex === selectedMutation.length - 1) {
      newSelected = newSelected.concat(selectedMutation.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedMutation.slice(0, selectedIndex),
        selectedMutation.slice(selectedIndex + 1)
      );
    }
    setselectedMutation(newSelected);
  };


  const showDeleteConfirmation = () => {
    setMaxWidth('sm');
    setdialogContent(
      <DeleteConfirmation
        handleClose={closeSubDialog}
        handleDelete={handleDelete}
        selectedIds={selectedMutation}
        title="Mutation"
      />
    );
    setopenSubDialog(true);
  };

  const handleDelete = async () => {
    const params={
      student_id:row.id,
      mutation_ids:selectedMutation
    }
    const response = await axios.delete(endpoint.student.mutation, {
      data: params
    });
    if (response) {
      submitSuccess('delete data success');
      getStudentMutationData();
    }
    setselectedMutation([])
  };

  const showSelectMutation = () => {
    setselectMutation(true);
  };

  const addMutation = async() => {
    const mutation_ids = newMutations.map(mutation=>(mutation.id))
    const params={
      student_id:row.id,
      mutation_ids:mutation_ids
    }
    await axios.put(endpoint.student.mutation, params);
    
    getStudentMutationData()
    setselectMutation(false);
  };

  const selectNewMutation = (e)=>{
    setnewMutations(e.target.value)
  }

  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {
    if(row){
      getStudentMutationData();
    }
    
  }, [row]);

  return (
    <>
      <Container>
        <Grid container style={{ marginBottom: 16 }}>
          <Grid container justifyContent="flex-end" alignItems="center">
              <Conditional condition={selectMutation === true}>
              <Autocomplete
                multiple
                id="get-mutation"
                style={{ width: 300 }}
                open={openMutationAutoComplete}
                onOpen={() => {
                  setopenMutationAutoComplete(true);
                }}
                onClose={() => {
                  setopenMutationAutoComplete(false);
                }}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                options={mutationOptions}
                loading={mutationAutoCompleteLoading}
                onChange={(event, newValue) => {
                  setnewMutations(newValue)
                }}
                onInputChange={(event, newInputValue) => {
                  setAutoCompleteKeyword(newInputValue)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Mutations"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {mutationAutoCompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
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
                  onClick={addMutation}
                >
                  Submit Mutation
                </MButton>
                <MButton
                  variant="contained"
                  color="error"
                  style={{ margin: '0 8px' }}
                  onClick={()=>setselectMutation(false)}
                >
                  Cancel
                </MButton>
              </Conditional>
              <Conditional condition={selectedMutation.length > 0}>
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

              <Conditional condition={selectMutation === false}>
                <Protected allowedCodes={['EDIT']} >
                  <MButton
                    variant="contained"
                    color="primary"
                    style={{ margin: '0 8px' }}
                    onClick={showSelectMutation}
                  >
                    Add Mutation
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
                  numSelected={selectedMutation.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {dataTable.map((row) => {
                      const { id, tahun_pelajaran, jenjang, kelas, parallel } = row;
                      const isItemSelected = selectedMutation.indexOf(id) !== -1;

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
                            {tahun_pelajaran && tahun_pelajaran.name}
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
