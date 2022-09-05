import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// redux
import { login, register, logout } from '../redux/slices/auth';

// ----------------------------------------------------------------------

export default function useAuth() {
  // JWT Auth
  const dispatch = useDispatch();
  const { application, applicationCode, user, roles, applications, menus, units, actions, isLoading, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // JWT Auth
  return {
    method: 'jwt',
    user,
    roles, 
    applicationCode,
    application,
    applications, 
    menus, 
    actions,
    isLoading,
    isAuthenticated,
    units,

    login: ({ username, password }) =>
      dispatch(
        login({
          username,
          password
        })
      ),

    register: ({ username, password, firstName, lastName }) =>
      dispatch(
        register({
          username,
          password,
          firstName,
          lastName
        })
      ),

    logout: () => dispatch(logout()),

    resetPassword: () => {},

    updateProfile: () => {},

  };
}
