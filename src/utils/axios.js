import axios from "axios";
// ----------------------------------------------------------------------

export const axiosInstance = axios.create();

if (process.env.REACT_APP_BACKEND_MODE === "PROD") {
  axiosInstance.defaults.baseURL = process.env.REACT_APP_API_PROD;
} else if (process.env.REACT_APP_BACKEND_MODE === "UAT") {
  axiosInstance.defaults.baseURL = process.env.REACT_APP_API_UAT;
} else {
  axiosInstance.defaults.baseURL = process.env.REACT_APP_API_LOCAL;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export const endpoint = {
  employee: {
    root: "/employee",
    option: "/employee/option",
  },
  jenjang: {
    root: "/jenjang",
    option: "/jenjang/option",
  },
  jurusan: {
    root: "/jurusan",
    sync: "/jurusan/sync",
    option: "/jurusan/option",
  },
  kelas: {
    root: "/kelas",
    sync: "/kelas/sync",
    option: "/kelas/option",
  },
  login: "login",
  register: "register",
  user: {
    root: "user",
    option: "/user/option",
    by_token: "user/by-token",
    role: "user/role",
    change_password: "user/change-password",
    reset_password: "user/reset-password",
    ofRole: "/users/of-role",
  },
  parameter: {
    root: "/parameter",
    option: "/parameter/option",
  },
  application: {
    root: "/application",
    option: "/application/option",
    role: "/application/role",
    menu: "/application/menu",
  },
  menu: {
    root: "/menu",
    option: "/menu/option",
    action: "/menu/action",
  },
  action: {
    root: "/action",
    option: "/action/option",
    approver: "/action/approver",
    role: "/action/role",
  },
  parallel: {
    root: "/parallel",
    sync: "/parallel/sync",
    option: "/parallel/option",
  },
  parent: {
    root: "/parent",
    option: "/parent/option",
    student: "/parent/student",
  },
  role: {
    root: "/role",
    detail: "/role/id",
    option: "/role/option",
    application: "/role/application",
    priviledge: "/role/priviledge",
    user: "/role/user",
    approval: "/role/approval",
    userInsertByPosition: "/role/byPosition",
  },
  school: {
    root: "/school",
    option: "/school/option",
  },
  position: {
    byUnit: "/postion/byUnitId",
    getOccupaions: "/position/occupations",
  },
  student: {
    root: "/student",
    sync: "/student/sync",
    option: "/student/option",
    parent: "/student/parent",
    mutation: "/student/mutation",
    sibling: "/student/sibling",
  },
  tahun_pelajaran: {
    root: "/tahun-pelajaran",
    option: "/tahun-pelajaran/option",
  },
  unit: {
    root: "/unit",
    option: "/unit/option",
  },
  employeeUnit: {
    root: "/employeeUnit",
    option: "/employeeUnit/option",
  },
  notification: {
    root: "/notification",
    totalunread: "/notification/total-unread",
    update: "/notification/update",
  },
  category: {
    root: "/category",
  },
  applicationCategory: {
    root: "/application-categories",
  },
};
