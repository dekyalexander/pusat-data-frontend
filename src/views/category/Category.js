import {
  Card,
  Grid,
  Table,
  TableBody,
  Typography,
  TableRow,
  TableCell,
  Box,
  TablePagination,
  Dialog,
  Checkbox,
} from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import ClickableText from "../../components/ClickableText";
import closeFill from "@iconify/icons-eva/close-fill";
import Page from "../../components/Page";
import Protected from "src/components/Protected";
import { MButton, MIconButton } from "../../components/@material-extend";
import { axiosInstance as axios, endpoint } from "../../utils/axios";

import { useSnackbar } from "notistack";
import Scrollbar from "src/components/Scrollbar";
import CategoryListHead from "./CategoryListHead";
import SearchNotFound from "src/components/SearchNotFound";
import CategoryForm from "./CategoryForm";
import DeleteConfirmation from "src/components/DeleteConfirmation";

const TABLE_HEAD = [{ id: "name", label: "Name", alignRight: false }];

export default function Category() {
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("name");
  const [categories, setCategories] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [openDialog, setopenDialog] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);
  const [dialogContent, setdialogContent] = useState(null);

  const [dialogContentAlert, setdialogContentAlert] = useState(null);
  const [openDialogAlert, setopenDialogAlert] = useState(false);

  const handleClick = (event, id, row) => {
    if (selectedIds.includes(row.id)) {
      const ids = selectedIds.filter((item) => item !== row.id);
      setSelectedIds(ids);

      if (ids.length === 1) {
        const existingRow = categories.filter((data) => data.id === ids[0]);
        setSelectedRow(existingRow[0]);
      } else {
        setSelectedRow(null);
      }
    } else {
      setSelectedIds([...selectedIds, row.id]);
      setSelectedRow(row);
    }
  };

  const handleCloseAlert = () => {
    setopenDialogAlert(false);
  };

  const handleClose = () => {
    setopenDialog(false);
  };

  const showDialog = (actionCode, data) => {
    let row;

    if (data) {
      row = data;
    } else {
      row = selectedRow;
    }

    setdialogContent(
      <CategoryForm
        row={row}
        actionCode={actionCode}
        handleSubmited={showMessageAlert}
        closeMainDialog={handleClose}
      />
    );

    setopenDialog(true);
  };

  const showMessageAlert = (message, type) => {
    fetchCategory();
    enqueueSnackbar(message, {
      variant: type,
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      ),
    });
  };

  const handleDelete = async () => {
    let data = {
      ids: selectedIds,
    };

    await axios
      .delete(endpoint.category.root, { params: data })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const showDeleteConfirmation = () => {
    setdialogContentAlert(
      <DeleteConfirmation
        handleClose={handleCloseAlert}
        handleDelete={handleDelete}
        selectedIds={selectedIds}
        title="Category"
      />
    );

    setopenDialogAlert(true);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = categories.map((data) => data.id);
      setSelectedIds(newSelecteds);
      return;
    }
    setSelectedIds([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
    fetchCategory(newPage + 1, null);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
    fetchCategory(1, +event.target.value);
  };

  const fetchCategory = async (newPage, newRowsPerPage) => {
    let data = {
      rowPerPage: newRowsPerPage ? newRowsPerPage : rowsPerPage,
      page: Number.isInteger(newPage) ? newPage : page,
    };
    await axios
      .get(endpoint.category.root, { params: data })
      .then((res) => {
        setTotalCategory(res.data.total);
        setPage(res.data.current_page);
        setCategories(res.data.data);
      })
      .catch((err) => {
        showMessageAlert(err, "error");
      });
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <Page title="Role">
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Typography variant="h6">Category Application</Typography>
        </Grid>
        <Grid item xs={12} md={12} container justifyContent="flex-end">
          <Protected allowedCodes={["CREATE"]}>
            <MButton
              variant="contained"
              color="primary"
              style={{ margin: "0 8px" }}
              onClick={() => showDialog("CREATE")}
            >
              New Category
            </MButton>
          </Protected>
          {selectedIds.length > 0 && (
            <Protected allowedCodes={["EDIT"]}>
              <MButton
                variant="contained"
                color="error"
                style={{ margin: "0 8px" }}
                onClick={showDeleteConfirmation}
              >
                Delete
              </MButton>
            </Protected>
          )}
        </Grid>
        <Grid item xs={12}>
          <Card>
            <Scrollbar>
              <Table>
                <CategoryListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={categories.length}
                  numSelected={selectedIds.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {categories.map((data, index) => {
                    const isItemSelected = selectedIds.indexOf(data.id) !== -1;
                    return (
                      <TableRow
                        hover
                        key={index}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                        onClick={(event) => handleClick(event, data.id, data)}
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
                              onClick={() => showDialog("READ", data)}
                              text={data.name}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {categories.length === 0 && (
                    <TableRow>
                      <TableCell align="center" colSpan={TABLE_HEAD.length + 1}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={""} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={totalCategory}
              rowsPerPage={rowsPerPage}
              page={page === 0 ? page : page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Grid>
      </Grid>
      <Dialog
        open={openDialog}
        maxWidth={"md"}
        onClose={handleClose}
        fullWidth
        scroll="body"
      >
        {dialogContent}
      </Dialog>

      <Dialog
        open={openDialogAlert}
        maxWidth={"xs"}
        onClose={handleCloseAlert}
        fullWidth
        scroll="body"
      >
        {dialogContentAlert}
      </Dialog>
    </Page>
  );
}
