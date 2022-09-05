import { useSnackbar } from "notistack";
import { filter } from "lodash";
import { Icon } from "@iconify/react";
import closeFill from "@iconify/icons-eva/close-fill";
import { useState, useEffect } from "react";
import { useDebounce } from "react-use";

// material
import {
  Box,
  Card,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Grid,
  Typography,
  TableContainer,
  TablePagination,
  Dialog,
} from "@material-ui/core";
import { MButton, MIconButton } from "../../components/@material-extend";
// components
import Page from "../../components/Page";
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import StudentListHead from "./StudentListHead";
import StudentListToolbar from "./StudentListToolbar";
import StudentForm from "./StudentForm";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import Protected from "src/components/Protected";
import useAuth from "src/hooks/useAuth";
import { LoadingButton } from "@material-ui/lab";
import StudentTableBody from "./StudentTableBody";
import SiblingTableBody from "./SiblingTableBody";
import LoadingScreen from "src/components/LoadingScreen";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name" },
  { id: "NIY", label: "NIY" },
  { id: "Jenjang", label: "Jenjang" },
  { id: "Kelas", label: "Kelas" },
  { id: "Parallel", label: "Parallel" },
  { id: "KTP Ayah", label: "KTP Ayah" },
  { id: "Nama Ayah", label: "Nama Ayah" },
  { id: "HP Ayah", label: "HP Ayah" },
  { id: "KTP Ibu", label: "KTP Ibu" },
  { id: "Nama Ibu", label: "Nama Ibu" },
  { id: "HP Ibu", label: "HP Ibu" },
];

const TABLE_HEAD_SIBLING = [
  { id: "name", label: "Name", alignRight: false },
  { id: "NIY", label: "NIY" },
  { id: "Jenjang", label: "Jenjang" },
  { id: "Kelas", label: "Kelas" },
  { id: "Parallel", label: "Parallel" },
  { id: "sibling", label: "Siblings", alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Student() {
  const { user, roles } = useAuth();
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [order, setOrder] = useState("asc");
  const [dataTable, setdataTable] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [filters, setfilters] = useState({
    keyword: "",
    is_sibling: 0,
    is_history: 0,
    kelas_id: "",
    parallel_id: "",
    school_id: "",
    tahun_pelajaran_id: undefined,
  });
  const [tableHead, settableHead] = useState(TABLE_HEAD);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogContent, setdialogContent] = useState(null);
  const [maxWidth, setMaxWidth] = useState("sm");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [schoolOptions, setschoolOptions] = useState([]);
  const [kelasOptions, setkelasOptions] = useState([]);
  const [parallelOptions, setparallelOptions] = useState([]);
  const [tahunOptions, settahunOptions] = useState([]);
  const [syncTK, setsyncTK] = useState(false);
  const [syncSD, setsyncSD] = useState(false);
  const [syncSMP, setsyncSMP] = useState(false);
  const [syncSMA, setsyncSMA] = useState(false);
  const [syncPCI, setsyncPCI] = useState(false);
  const [search, setSearch] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  const getData = async (newPage, newRowsPerPage, exportType) => {
    setLoadingData(true);
    let parent_id = null;
    let student_id = null;
    if (user.user_type && user.user_type.code === "PARENT") {
      parent_id = user.parent ? user.parent.id : null;
    } else if (user.user_type && user.user_type.code === "STUDENT") {
      student_id = user.student ? user.student.id : null;
    }

    let params = {
      keyword: filters.keyword !== "" ? filters.keyword : undefined,
      school_id: filters.school_id,
      kelas_id: filters.kelas_id,
      parallel_id: filters.parallel_id,
      is_sibling: filters.is_sibling === 1 ? 1 : undefined,
      parent_id: parent_id,
      student_id: student_id,
      page: Number.isInteger(newPage) ? newPage : page,
      rowsPerPage: newRowsPerPage ? newRowsPerPage : rowsPerPage,
      export_type: exportType ? exportType : undefined,
    };
    if (exportType) {
      downloadFile(endpoint.student.root, exportType, params);
    } else {
      const response = await axios.get(endpoint.student.root, {
        params: params,
      });
      if (response && response.data) {
        setdataTable(response.data.data);
        setPage(response.data.current_page);
        setTotalRows(response.data.total);
      }
    }
    setLoadingData(false);
  };

  const downloadFile = async (url, extention, params) => {
    await axios
      .get(url, {
        params: params,
        responseType: "blob",
      })
      .then((rsp) => {
        const url = window.URL.createObjectURL(new Blob([rsp.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "student." + extention); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.log(error);
        //store.dispatch(showSnackbar('error','ups something wrong, let IT team fix this'))
        return { error: error };
      });
  };

  const getschoolOptions = async () => {
    const response = await axios.get(endpoint.school.option);
    if (response && response.data) {
      setschoolOptions(response.data);
    }
  };

  const getkelasOptions = async (school_id) => {
    const params = {
      school_id: school_id,
    };
    const response = await axios.get(endpoint.kelas.option, { params: params });
    if (response && response.data) {
      setkelasOptions(response.data);
    }
  };

  const getparallelOptions = async (kelas_id) => {
    const params = {
      kelas_id: kelas_id,
    };
    const response = await axios.get(endpoint.parallel.option, {
      params: params,
    });
    if (response && response.data) {
      setparallelOptions(response.data);
    }
  };

  const gettahunOptions = async () => {
    const response = await axios.get(endpoint.tahun_pelajaran.option);
    if (response && response.data) {
      settahunOptions(response.data);
    }
  };

  const submitSuccess = (message) => {
    enqueueSnackbar(message, {
      variant: "success",
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      ),
    });
  };

  const submitError = (message) => {
    enqueueSnackbar(message, {
      variant: "error",
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      ),
    });
  };

  const syncStudent = async (jenjang_code) => {
    startLoading(jenjang_code);

    const params = {
      jenjang_code: jenjang_code,
      tahun_pelajaran_id: filters.tahun_pelajaran_id,
    };

    const response = await axios
      .post(endpoint.student.sync, params)
      .catch(function (error) {
        submitError("failed");
      });

    if (response) {
      submitSuccess("sync data success");
      getData();
    }

    stopLoading(jenjang_code);
  };

  const startLoading = (jenjang_code) => {
    if (jenjang_code === "TK") {
      setsyncTK(true);
    } else if (jenjang_code === "SD") {
      setsyncSD(true);
    } else if (jenjang_code === "SMP") {
      setsyncSMP(true);
    } else if (jenjang_code === "SMA") {
      setsyncSMA(true);
    } else if (jenjang_code === "PCI") {
      setsyncPCI(true);
    }
  };

  const stopLoading = (jenjang_code) => {
    if (jenjang_code === "TK") {
      setsyncTK(false);
    } else if (jenjang_code === "SD") {
      setsyncSD(false);
    } else if (jenjang_code === "SMP") {
      setsyncSMP(false);
    } else if (jenjang_code === "SMA") {
      setsyncSMA(false);
    } else if (jenjang_code === "PCI") {
      setsyncPCI(false);
    }
  };

  const handleClose = () => {
    setopenDialog(false);
  };

  const showDialog = (actionCode, rowParam) => {
    let row = undefined;
    if (rowParam) {
      row = rowParam;
    } else {
      row = selectedRow;
    }
    setMaxWidth("md");
    setdialogContent(
      <StudentForm
        row={row}
        getData={getData}
        actionCode={actionCode}
        submitSuccess={submitSuccess}
        submitError={submitError}
        closeMainDialog={handleClose}
      />
    );

    setopenDialog(true);
  };

  const showDeleteConfirmation = () => {
    setMaxWidth("sm");
    setdialogContent(
      <DeleteConfirmation
        handleClose={handleClose}
        handleDelete={handleDelete}
        selectedIds={selectedIds}
        title="Student"
      />
    );

    setopenDialog(true);
  };

  const handleDelete = async () => {
    const params = {
      ids: selectedIds,
    };
    const response = await axios.delete(endpoint.student.root, {
      data: params,
    });
    if (response) {
      submitSuccess("delete data success");
      getData();
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = dataTable.map((data) => data.id);
      setSelectedIds(newSelecteds);
      return;
    }
    setSelectedIds([]);
  };

  const handleClick = (event, id, row) => {
    if (selectedIds.includes(row.id)) {
      const ids = selectedIds.filter((item) => item !== row.id);
      setSelectedIds(ids);

      if (ids.length === 1) {
        const existingRow = dataTable.filter((data) => data.id === ids[0]);
        setSelectedRow(existingRow[0]);
      } else {
        setSelectedRow(null);
      }
    } else {
      setSelectedIds([...selectedIds, row.id]);
      setSelectedRow(row);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
    getData(newPage + 1, null);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
    getData(1, +event.target.value);
  };

  const handleFilter = (field, event) => {
    let newFilters = { ...filters };
    let value = null;

    if (field === "school_id") {
      value = event.target.value;
      if (value !== null) {
        getkelasOptions(value);
      } else {
        setkelasOptions([]);
      }
      setparallelOptions([]);
      newFilters["kelas_id"] = "";
      newFilters["parallel_id"] = "";
    } else if (field === "kelas_id") {
      value = event.target.value;
      if (value !== null) {
        getparallelOptions(value);
      } else {
        setparallelOptions([]);
      }
      newFilters["parallel_id"] = "";
    } else if (field === "is_sibling") {
      value = event.target.checked ? 1 : 0;
      if (value === 1) {
        settableHead(TABLE_HEAD_SIBLING);
      } else {
        settableHead(TABLE_HEAD);
      }
    } else if (field === "is_history") {
      value = event.target.checked ? 1 : 0;
      gettahunOptions();

      if (value === 0) {
        delete newFilters["tahun_pelajaran_id"];
      }
    } else if (field === "tahun_pelajaran_id") {
      value = event.target.value;
    } else {
      value = event.target.value;
    }

    newFilters[field] = value;
    setfilters(newFilters);
  };

  const filteredData = applySortFilter(
    dataTable,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredData.length === 0;

  const getRoles = () => {
    roles.map((a) => {
      if (a.name === "Parent" || a.name === "Student") {
        setSearch(false);
      }
    });
  };

  useDebounce(
    () => {
      if (filters.keyword.trim() != "") {
      }
    },
    500,
    [filters.keyword]
  );

  useEffect(() => {
    getRoles();
    getschoolOptions();
    getData();
  }, []);

  return (
    <Page title="Student">
      <Grid container style={{ padding: "16px 0" }}>
        <Grid item xs={4} container justifyContent="flex-start">
          <Typography gutterBottom variant="h4" component="h6">
            Student
          </Typography>
        </Grid>
        <Grid item xs={12} container justifyContent="flex-start">
          {selectedIds.length > 0 && (
            <Protected allowedCodes={["EDIT"]}>
              <MButton
                variant="contained"
                color="error"
                style={{ margin: "0 8px 16px 8px" }}
                onClick={showDeleteConfirmation}
              >
                Delete
              </MButton>
            </Protected>
          )}
          {selectedIds.length === 1 && (
            <Protected allowedCodes={["EDIT"]}>
              <MButton
                variant="contained"
                color="info"
                style={{ margin: "0 8px 16px 8px" }}
                onClick={() => showDialog("EDIT")}
              >
                Edit
              </MButton>
            </Protected>
          )}

          <Protected allowedCodes={["SYNC_PCI"]}>
            <LoadingButton
              size="medium"
              type="button"
              variant="contained"
              style={{ margin: "0 8px 16px 8px" }}
              pending={syncPCI}
              onClick={() => syncStudent("PCI")}
            >
              Sync PCI
            </LoadingButton>
          </Protected>

          <Protected allowedCodes={["ARCHIVE_SMA"]}>
            <LoadingButton
              size="medium"
              type="button"
              variant="contained"
              style={{ margin: "0 8px 16px 8px" }}
              pending={syncPCI}
              onClick={() => {}}
            >
              Archive SMA
            </LoadingButton>
          </Protected>

          <Protected allowedCodes={["SYNC_SMA"]}>
            <LoadingButton
              size="medium"
              type="button"
              variant="contained"
              style={{ margin: "0 8px 16px 8px" }}
              pending={syncSMA}
              onClick={() => syncStudent("SMA")}
            >
              Sync SMA
            </LoadingButton>
          </Protected>

          <Protected allowedCodes={["ARCHIVE_SMP"]}>
            <LoadingButton
              size="medium"
              type="button"
              variant="contained"
              style={{ margin: "0 8px 16px 8px" }}
              pending={syncPCI}
              onClick={() => {}}
            >
              Archive SMP
            </LoadingButton>
          </Protected>

          <Protected allowedCodes={["SYNC_SMP"]}>
            <LoadingButton
              size="medium"
              type="button"
              variant="contained"
              style={{ margin: "0 8px 16px 8px" }}
              pending={syncSMP}
              onClick={() => syncStudent("SMP")}
            >
              Sync SMP
            </LoadingButton>
          </Protected>

          <Protected allowedCodes={["ARCHIVE_SD"]}>
            <LoadingButton
              size="medium"
              type="button"
              variant="contained"
              style={{ margin: "0 8px 16px 8px" }}
              pending={syncPCI}
              onClick={() => {}}
            >
              Archive SD
            </LoadingButton>
          </Protected>

          <Protected allowedCodes={["SYNC_SD"]}>
            <LoadingButton
              size="medium"
              type="button"
              variant="contained"
              style={{ margin: "0 8px 16px 8px" }}
              pending={syncSD}
              onClick={() => syncStudent("SD")}
            >
              Sync SD
            </LoadingButton>
          </Protected>

          <Protected allowedCodes={["ARCHIVE_TK"]}>
            <LoadingButton
              size="medium"
              type="button"
              variant="contained"
              style={{ margin: "0 8px 16px 8px" }}
              pending={syncPCI}
              onClick={() => {}}
            >
              Archive TK
            </LoadingButton>
          </Protected>

          <Protected allowedCodes={["SYNC_TK"]}>
            <LoadingButton
              size="medium"
              type="button"
              variant="contained"
              style={{ margin: "0 8px 16px 8px" }}
              pending={syncTK}
              onClick={() => syncStudent("TK")}
            >
              Sync TK
            </LoadingButton>
          </Protected>

          <MButton
            variant="outlined"
            color="info"
            style={{ margin: "0 8px 16px 8px" }}
            onClick={() => getData(undefined, undefined, "xlsx")}
          >
            EXCEL
          </MButton>
        </Grid>
      </Grid>
      <Card>
        {search && (
          <StudentListToolbar
            getData={getData}
            numSelected={selectedIds.length}
            filters={filters}
            handleFilter={handleFilter}
            schoolOptions={schoolOptions}
            kelasOptions={kelasOptions}
            parallelOptions={parallelOptions}
            tahunOptions={tahunOptions}
          />
        )}

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <StudentListHead
                order={order}
                orderBy={orderBy}
                headLabel={tableHead}
                rowCount={dataTable.length}
                numSelected={selectedIds.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />

              {filters.is_sibling === 0 && !loadingData && (
                <StudentTableBody
                  dataTable={dataTable}
                  selectedIds={selectedIds}
                  handleClick={handleClick}
                  showDialog={showDialog}
                />
              )}

              {filters.is_sibling === 1 && !loadingData && (
                <SiblingTableBody
                  dataTable={dataTable}
                  selectedIds={selectedIds}
                  handleClick={handleClick}
                  showDialog={showDialog}
                />
              )}

              {isUserNotFound && !loadingData && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={12}>
                      <Box sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={""} />
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
              {loadingData && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={12}>
                      <Box sx={{ m: 4 }}>
                        <LoadingScreen />
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100, 200]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page === 0 ? page : page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      <Dialog
        open={openDialog}
        maxWidth={maxWidth}
        onClose={handleClose}
        fullWidth
        scroll="body"
      >
        {dialogContent}
      </Dialog>
    </Page>
  );
}
