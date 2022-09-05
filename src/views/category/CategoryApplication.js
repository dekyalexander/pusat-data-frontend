import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
  Card,
  CardContent,
  Button,
  Grid,
  Dialog,
} from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import Scrollbar from "src/components/Scrollbar";
import { visuallyHidden } from "@material-ui/utils";

import { axiosInstance as axios, endpoint } from "../../utils/axios";
import CategorySelectApplication from "./CategorySelectApplication";
import SearchNotFound from "src/components/SearchNotFound";
import Protected from "src/components/Protected";
import { MButton, MIconButton } from "src/components/@material-extend";
import DeleteConfirmation from "src/components/DeleteConfirmation";
import { useSnackbar } from "notistack";
import { Icon } from "@iconify/react";
import closeFill from "@iconify/icons-eva/close-fill";

const TABLE_HEAD = [{ id: 1, name: "Application" }];

export default function CategoryApplication(props) {
  const { row, actionCode, handleSubmited, closeMainDialog } = props;
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [orderBy, setOrderBy] = useState("Application");
  const [order, setOrder] = useState("asc");
  const [dataApp, setDataApp] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [dialogContentAlert, setdialogContentAlert] = useState(null);
  const [openDialogAlert, setopenDialogAlert] = useState(false);

  const showMessageAlert = (message, type) => {
    enqueueSnackbar(message, {
      variant: type,
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      ),
    });
  };

  const handleCloseAlert = () => {
    setopenDialogAlert(false);
  };

  const handleDelete = async () => {
    let data = {
      categoryId: row.id,
      applicationId: selectedIds,
    };

    await axios
      .delete(endpoint.applicationCategory.root, { params: data })
      .then((res) => {
        console.log(res);
        showMessageAlert("Berhasil simpan data", "success");
        setSelectedIds([]);
        fetchDataAplikasi();
      })
      .catch((err) => {
        console.log(err);
        showMessageAlert("Gagal simpan data", "error");
      });
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

  const fetchDataAplikasi = async () => {
    let data = {
      categoryId: row.id,
    };
    await axios
      .get(endpoint.applicationCategory.root, { params: data })
      .then((res) => {
        console.log(res.data);
        setDataApp(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleRequestSort = (event) => (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const onUpdateData = (data) => {
    if (data) fetchDataAplikasi();

    setShowForm(false);
  };

  const handleClick = (event, id, row) => {
    if (selectedIds.includes(id)) {
      const ids = selectedIds.filter((item) => item !== id);
      setSelectedIds(ids);

      if (ids.length === 1) {
        const existingRow = dataApp.filter((data) => data.id === ids[0]);
        setSelectedRow(existingRow[0]);
      } else {
        setSelectedRow(null);
      }
    } else {
      setSelectedIds([...selectedIds, id]);
      setSelectedRow(row);
    }
  };

  const emptyData = dataApp.length === 0;

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = dataApp.map((data) => data.id);
      setSelectedIds(newSelecteds);
      return;
    }
    setSelectedIds([]);
  };

  useEffect(() => {
    fetchDataAplikasi();
  }, []);

  return (
    <Fragment>
      <Box sx={{ m: 2 }}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} container justifyContent="flex-end">
                <Protected allowedCodes={["CREATE"]}>
                  <Button variant="contained" onClick={() => setShowForm(true)}>
                    Tambah Aplikasi
                  </Button>
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
                {showForm && (
                  <CategorySelectApplication
                    dataApps={dataApp}
                    category={row}
                    handleUpdate={onUpdateData}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <Scrollbar>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              indeterminate={
                                selectedIds.length > 0 &&
                                selectedIds.length < dataApp.length
                              }
                              checked={
                                dataApp.length > 0 &&
                                selectedIds.length === dataApp.length
                              }
                              onChange={handleSelectAllClick}
                            />
                          </TableCell>
                          {TABLE_HEAD.map((header, i) => (
                            <TableCell key={i}>
                              <TableSortLabel
                                hideSortIcon
                                active={orderBy === header.id}
                                direction={
                                  orderBy === header.id ? order : "asc"
                                }
                                onClick={handleRequestSort(header.id)}
                              >
                                {header.name}
                                {orderBy === header.id ? (
                                  <Box sx={{ ...visuallyHidden }}>
                                    {order === "desc"
                                      ? "sorted descending"
                                      : "sorted ascending"}
                                  </Box>
                                ) : null}
                              </TableSortLabel>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dataApp.map((app, index) => {
                          const isItemSelected =
                            selectedIds.indexOf(app.id) !== -1;
                          return (
                            <TableRow
                              hover
                              key={index}
                              tabIndex={-1}
                              role="checkbox"
                              selected={isItemSelected}
                              aria-checked={isItemSelected}
                              onClick={(event) =>
                                handleClick(event, app.id, app)
                              }
                            >
                              <TableCell>
                                <Checkbox checked={isItemSelected} />
                              </TableCell>
                              <TableCell>{app.applications.name}</TableCell>
                            </TableRow>
                          );
                        })}
                        {emptyData && (
                          <TableRow>
                            <TableCell
                              align="center"
                              colSpan={TABLE_HEAD.length + 1}
                            >
                              <Box sx={{ py: 3 }}>
                                <SearchNotFound searchQuery={""} />
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      <Dialog
        open={openDialogAlert}
        maxWidth={"xs"}
        onClose={handleCloseAlert}
        fullWidth
        scroll="body"
      >
        {dialogContentAlert}
      </Dialog>
    </Fragment>
  );
}
