// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

export const mode = process.env.REACT_APP_BACKEND_MODE;
export const folderName = process.env.REACT_APP_FOLDER_NAME;

const ROOTS_AUTH = mode === "LOCAL" ? "/auth" : `/${folderName}/auth`;
const ROOTS_DASHBOARD =
  mode === "LOCAL" ? "/dashboard" : `/${folderName}/dashboard`;

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, "/login"),
  loginUnprotected: path(ROOTS_AUTH, "/login-unprotected"),
  register: path(ROOTS_AUTH, "/register"),
  registerUnprotected: path(ROOTS_AUTH, "/register-unprotected"),
  resetPassword: path(ROOTS_AUTH, "/reset-password"),
  verify: path(ROOTS_AUTH, "/verify"),
};

export const PATH_PAGE = {
  comingSoon: "/coming-soon",
  maintenance: "/maintenance",
  pricing: "/pricing",
  payment: "/payment",
  page404: "/404",
  page500: "/500",
};

export const PATH_HOME = {
  cloud: "https://www.sketch.com/s/0fa4699d-a3ff-4cd5-a3a7-d851eb7e17f0",
  purchase: "https://material-ui.com/store/items/minimal-dashboard/",
  components: "/components",
  dashboard: ROOTS_DASHBOARD,
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, "/app"),
    ecommerce: path(ROOTS_DASHBOARD, "/ecommerce"),
    analytics: path(ROOTS_DASHBOARD, "/analytics"),
  },
  user: {
    root: path(ROOTS_DASHBOARD, "/user"),
    profile: path(ROOTS_DASHBOARD, "/user/profile"),
    cards: path(ROOTS_DASHBOARD, "/user/card"),
    list: path(ROOTS_DASHBOARD, "/user/list"),
    account: path(ROOTS_DASHBOARD, "/user/account"),
  },
  application: path(ROOTS_DASHBOARD, "/application"),
  menu: path(ROOTS_DASHBOARD, "/menu"),
  action: path(ROOTS_DASHBOARD, "/action"),
  role: path(ROOTS_DASHBOARD, "/role"),
  parameter: path(ROOTS_DASHBOARD, "/parameter"),
  unit: path(ROOTS_DASHBOARD, "/unit"),
  student: path(ROOTS_DASHBOARD, "/student"),
  employee: path(ROOTS_DASHBOARD, "/employee"),
  parent: path(ROOTS_DASHBOARD, "/parent"),
  jenjang: path(ROOTS_DASHBOARD, "/jenjang"),
  school: path(ROOTS_DASHBOARD, "/school"),
  kelas: path(ROOTS_DASHBOARD, "/kelas"),
  jurusan: path(ROOTS_DASHBOARD, "/jurusan"),
  parallel: path(ROOTS_DASHBOARD, "/parallel"),
  tahunPelajaran: path(ROOTS_DASHBOARD, "/tahun-pelajaran"),
  profile: path(ROOTS_DASHBOARD, "/profile"),
  category: path(ROOTS_DASHBOARD, "/category-application"),
};
