import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { 
  Box, 
  Card, 
  TextField, 
  Button, 
  FormControl, 
  Select, 
  MenuItem, 
  InputLabel, 
  Grid, 
  FormControlLabel, 
  FormHelperText, 
  Checkbox
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// utils
import fakeRequest from '../../utils/fakeRequest';
import Conditional from '../../components/Conditional';
import { axiosInstance as axios, endpoint } from '../../utils/axios';
// ----------------------------------------------------------------------

RoleDetail.propTypes = {
  sx: PropTypes.object
};

export default function RoleDetail(props) {
  const { 
    row,
    getData,
    sx, 
    submitSuccess, 
    submitError 
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [actionCode, setactionCode] = useState('READ');
  const [isSubmitting, setisSubmitting] = useState(false);
  const [errors, seterrors] = useState({});
  const [isUsernameChanged, setisUsernameChanged] = useState(false);
  const [userTypeOptions, setuserTypeOptions] = useState([]);
  const [state, setstate] = useState({
    id:undefined,
    name: '',
    email: '',
    username: '',
    user_type_value:1
  });

  const getuserTypeOptions = async () => {
    const params={
      group:'user_type'
    }
    const response = await axios.get(endpoint.parameter.option,{params:params});
    if (response && response.data) {
      setuserTypeOptions(response.data);
    }
    
  };

  const getDetail = (row) => {
    if (row) {
      setstate({ 
        ...row 
      });
    }
  };

  const handleChange=(fieldName,eventValue)=>{
    let newState = {...state}
    let value = eventValue

    if(fieldName==='username'){
      setisUsernameChanged(true)
    }
    
    if(fieldName==="is_head"){    
      value = eventValue.target.checked ? 1:0
    }      
    else{
      value = eventValue.target.value
    }    

    newState[fieldName] = value
    setstate(newState)
  }

  const submit = async()=>{
    let params = {
      name: state.name,
      email: state.email,
      username: isUsernameChanged ?  state.username : undefined,
      user_type_value:state.user_type_value,
    };
    if (actionCode === 'CREATE') {
      await axios.post(endpoint.user.root, params);
    } else {
      params = {...params, id:state.id}
      await axios.put(endpoint.user.root, params);
    }
    setisSubmitting(false);
    submitSuccess('saving data success');
    getData(); 
  }
  
  
  useEffect(() => {
    setactionCode(props.actionCode);
  }, [props.actionCode]);

  useEffect(() => {   
    getuserTypeOptions()  
    if(row && props.actionCode!=='CREATE'){ 
      getDetail(row);
    }
  }, [row]);

  return (
    <Card sx={{ p: 3, ...sx }} {...props}>                       
          
          <TextField
            value = {state.name}
            onChange={(e)=>handleChange('name',e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Name"
            sx={{ mb: 5 }}
          />

          <TextField
            value = {state.email}
            onChange={(e)=>handleChange('email',e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="Email"
            error={Boolean(errors.code)}
            helperText={errors.code}
            sx={{ mb: 5 }}
          />

          <TextField
            value = {state.username}
            onChange={(e)=>handleChange('username',e)}
            fullWidth
            autoComplete="on"
            type="text"
            label="User Name"
            error={Boolean(errors.code)}
            helperText={errors.code}
            sx={{ mb: 5 }}
          />

        <Grid container style={{ marginBottom: 16 }}>
          <FormControl
            variant="outlined"
            style={{ minWidth: 120, width: "50%" }}          
          >
            <InputLabel id="user_type_value-label">Level</InputLabel>
            <Select
              labelId="user_type_value-label"
              id="user_type_value-select"
              label="User Type"
              value={state.user_type_value}
              onChange={(e) => handleChange("user_type_value", e)}
            >
              {userTypeOptions.map((user_type) => (
                <MenuItem key={user_type.value} value={user_type.value}>
                  {user_type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

      
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Conditional condition={actionCode === 'READ'}>
              <Button onClick={() => setactionCode('EDIT')}>edit</Button>
            </Conditional>
            <Conditional condition={actionCode !== 'READ'}>
              <LoadingButton
                onClick={submit}
                variant="contained"
                pending={isSubmitting}
              >
                Save
              </LoadingButton>
            </Conditional>        
          </Box>

    </Card>
  );
}
