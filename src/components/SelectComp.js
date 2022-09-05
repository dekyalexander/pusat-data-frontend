import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { useState } from "react";

export default function SelectComp(props) {
  const { type, listData, val } = props;
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    val(e.target.value);
  };

  return (
    <FormControl variant="outlined" style={{ width: "100%" }}>
      <InputLabel id={`${type}_id`}>{type}</InputLabel>
      <Select
        labelId={`${type}_id`}
        label={type}
        value={value}
        onChange={(e) => handleChange(e)}
      >
        {listData.map((data, i) => (
          <MenuItem key={i} value={data}>
            {data.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
