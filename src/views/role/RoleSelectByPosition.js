import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Badge,
  CircularProgress,
} from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react";
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import { MButton, MIconButton } from "../../components/@material-extend";
import { useSnackbar } from "notistack";
import { Icon } from "@iconify/react";
import closeFill from "@iconify/icons-eva/close-fill";
import SelectComp from "src/components/SelectComp";

export default function RoleSelectByPosition({ role, dataUpdated }) {
  const [units, setUnits] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [selectedUnit, setSelectedUnit] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [typeUser, setTypeUser] = useState("");
  const [contentSelected, setContentSelected] = useState(null);
  const [selectedData, setSelectedData] = useState("");
  const [btnSaveDisable, setBtnSaveDisable] = useState(true);
  const [loadProgress, setLoadProgress] = useState(false);

  const handleChange = (e) => {
    setBtnDisabled(false);
    setContentSelected(null);
    setSelectedUnit(e.target.value);
  };

  const fetchUnit = async () => {
    await axios.get(endpoint.employeeUnit.root).then((res) => {
      setUnits(res.data);
    });
  };

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

  const handleSubmit = async () => {
    setBtnSaveDisable(true);
    setLoadProgress(true);
    if (typeUser === "position") {
      const data = {
        unitId: selectedUnit,
        roleId: role.id,
        positionCode: selectedData.code,
      };

      await axios
        .post(endpoint.role.userInsertByPosition, data)
        .then(() => {
          dataUpdated(true);
          showMessageAlert("Data Berhasil ditambahkan", "success");
        })
        .catch(() => {
          showMessageAlert("Data Gagal ditambahkan", "error");
        });
    } else {
      const data = {
        occupationId: selectedData.id,
        roleId: role.id,
        unitId: selectedUnit,
      };
      await axios
        .post(endpoint.role.userInsertByPosition, data)
        .then(() => {
          dataUpdated(true);
          showMessageAlert("Data Berhasil ditambahkan", "success");
        })
        .catch(() => {
          showMessageAlert("Data Gagal ditambahkan", "error");
        });
    }
    setLoadProgress(false);
    setBtnSaveDisable(false);
  };

  const fetchPosition = async () => {
    const res = await axios.get(endpoint.position.byUnit, {
      params: { unitId: selectedUnit },
    });
    return res.data;
  };

  const fetchOccupation = async () => {
    const res = await axios.get(endpoint.position.getOccupaions, {
      params: { unitId: selectedUnit },
    });
    let arr = [];

    res.data.map((val) => {
      let obj = {
        id: val.employee_occupation_id,
        name: val.occupations.name,
      };
      arr.push(obj);
    });

    return arr;
  };

  const handleSelected = (data) => {
    setSelectedData(data);
  };

  const handleClickBtn = async (type) => {
    setTypeUser(type);

    let dataslist = [];
    if (type === "position") {
      dataslist = await fetchPosition();
    } else {
      dataslist = await fetchOccupation();
    }
    setContentSelected(
      <SelectComp type={type} val={handleSelected} listData={dataslist} />
    );
  };

  useEffect(() => {
    setContentSelected(null);
  }, [typeUser]);

  useEffect(() => {
    fetchUnit();
  }, []);

  useEffect(() => {
    if (selectedData !== "") {
      setBtnSaveDisable(false);
    }
  }, [selectedData]);

  return (
    <Fragment>
      <Typography variant="h6">Select By Occupation or Position</Typography>
      <Box sx={{ m: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl variant="outlined" style={{ width: "100%" }}>
              <InputLabel id="units_id">Unit</InputLabel>
              <Select
                labelId="units_id"
                label="Unit"
                value={selectedUnit}
                onChange={(e) => handleChange(e)}
              >
                {units.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            container
            xs={12}
            md={3}
            justifyContent="center"
            justifyItems="flex-end"
          >
            <MButton
              variant="contained"
              color="primary"
              style={{ margin: "0 8px" }}
              onClick={() => handleClickBtn("occupation")}
              disabled={btnDisabled}
            >
              By Occupation
            </MButton>
          </Grid>
          <Grid
            item
            container
            xs={12}
            md={3}
            justifyContent="center"
            justifyItems="flex-end"
          >
            <MButton
              variant="contained"
              color="primary"
              style={{ margin: "0 8px" }}
              onClick={() => handleClickBtn("position")}
              disabled={btnDisabled}
            >
              By Position
            </MButton>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ m: 2 }}>
        {contentSelected && (
          <Grid container spacing={2}>
            <Grid item xs={6} md={10}>
              {contentSelected}
            </Grid>
            <Grid item xs={6} md={2}>
              <MButton
                variant="contained"
                color="primary"
                style={{ margin: "0 8px" }}
                onClick={handleSubmit}
                disabled={btnSaveDisable}
              >
                Simpan{" "}
                {loadProgress && (
                  <Box sx={{ ml: 1 }}>
                    <CircularProgress />
                  </Box>
                )}
              </MButton>
            </Grid>
          </Grid>
        )}
      </Box>
    </Fragment>
  );
}
