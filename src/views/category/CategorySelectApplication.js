import {
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
  Dialog,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import { useSnackbar } from "notistack";
import { MIconButton } from "../../components/@material-extend";
import { Icon } from "@iconify/react";
import closeFill from "@iconify/icons-eva/close-fill";

export default function CategorySelectApplication(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { category, dataApps, handleUpdate } = props;
  const [nameApp, setNameApp] = useState("");
  const [selectedApp, setSelectedApp] = useState([]);
  const [listApp, setlistApp] = useState([]);
  const [btnDisabled, setBtnDisabled] = useState(true);

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

  const handleSave = async () => {
    setBtnDisabled(true);
    let data = {
      categoryId: category.id,
      apps: selectedApp,
    };
    await axios
      .post(endpoint.applicationCategory.root, data)
      .then(() => {
        handleUpdate(true);
        showMessageAlert("Berhasil simpan data", "success");
        setBtnDisabled(false);
      })
      .catch(() => {
        showMessageAlert("Gagal simpan data", "error");
        setBtnDisabled(false);
      });
  };

  useEffect(() => {
    if (selectedApp.length !== 0) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  }, [selectedApp]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (nameApp !== "") {
        let data = {
          keyword: nameApp,
        };
        const responseName = await axios.get(endpoint.application.option, {
          params: data,
        });
        let datasApps = responseName.data;
        dataApps.map((val) => {
          datasApps = datasApps.filter(function (obj) {
            return obj.id !== val.id;
          });
        });

        setlistApp(datasApps);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [nameApp]);

  return (
    <Box sx={{ m: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Autocomplete
            fullWidth
            multiple
            onInputChange={(e, newInput) => {
              setNameApp(newInput);
            }}
            getOptionSelected={(option, value) => option.id === value.id}
            options={listApp}
            onChange={(e, value) => {
              setSelectedApp(value);
            }}
            getOptionLabel={(list) => `${list.name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Masukan Nama Aplikasi"
                margin="none"
                InputProps={{
                  ...params.InputProps,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={btnDisabled}
          >
            Simpan
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
