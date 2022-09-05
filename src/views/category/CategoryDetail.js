import { Box, Button, Grid, TextField, Typography } from "@material-ui/core";
import { Fragment, useEffect, useState } from "react";
import { MButton } from "src/components/@material-extend";

import { axiosInstance as axios, endpoint } from "../../utils/axios";

export default function CategoryDetail(props) {
  const { row, actionCode, handleSubmited, closeMainDialog } = props;
  const [nameCategory, setnameCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (actionCode === "CREATE") {
      await axios
        .post(endpoint.category.root, { name: nameCategory })
        .then((res) => {
          console.log(res);
          handleSubmited("Berhasil tambah data", "success");
        })
        .catch(() => {
          console.log("gagal");
        });
    } else {
      await axios
        .put(endpoint.category.root, { id: row.id, name: nameCategory })
        .then((res) => {
          console.log(res);
          handleSubmited("Berhasil Edit data", "success");
        })
        .catch(() => {
          console.log("gagal");
        });
    }
  };

  useEffect(() => {
    if (row && actionCode !== "CREATE") {
      setnameCategory(row.name);
    }
  }, [row]);

  return (
    <Fragment>
      <Box sx={{ m: 2 }}>
        <Typography variant="h6">Detail Category</Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ m: 2 }}>
            <TextField
              fullWidth
              label="Nama Category"
              name="name"
              value={nameCategory}
              onChange={(e) => setnameCategory(e.target.value)}
            />
          </Grid>
          <Grid item container xs={12} justifyContent="flex-end">
            <Button type="submit" variant="contained">
              Simpan
            </Button>
          </Grid>
        </Grid>
      </form>
    </Fragment>
  );
}
