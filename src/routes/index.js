import NProgress from "nprogress";
import { Switch, Route, Redirect } from "react-router-dom";
import { Suspense, Fragment, lazy, useEffect, useMemo } from "react";
// material
import { makeStyles } from "@material-ui/core/styles";
// guards
import GuestGuard from "../guards/GuestGuard";
// components
import LoadingScreen from "../components/LoadingScreen";
//
import AuthGuard from "../guards/AuthGuard";
// layouts
import DashboardLayout from "../layouts/dashboard";
import HomeLayout from "../layouts/home";
import {
  PATH_PAGE,
  PATH_AUTH,
  PATH_DASHBOARD,
  mode,
  folderName,
} from "./paths";

// ----------------------------------------------------------------------

const nprogressStyle = makeStyles((theme) => ({
  "@global": {
    "#nprogress": {
      pointerEvents: "none",
      "& .bar": {
        top: 0,
        left: 0,
        height: 2,
        width: "100%",
        position: "fixed",
        zIndex: theme.zIndex.snackbar,
        backgroundColor: theme.palette.primary.main,
        boxShadow: `0 0 2px ${theme.palette.primary.main}`,
      },
      "& .peg": {
        right: 0,
        opacity: 1,
        width: 100,
        height: "100%",
        display: "block",
        position: "absolute",
        transform: "rotate(3deg) translate(0px, -4px)",
        boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 5px ${theme.palette.primary.main}`,
      },
    },
  },
}));

function RouteProgress(props) {
  nprogressStyle();

  NProgress.configure({
    speed: 500,
    showSpinner: false,
  });

  useMemo(() => {
    NProgress.start();
  }, []);

  useEffect(() => {
    NProgress.done();
  }, []);

  return <Route {...props} />;
}

export function renderRoutes(routes = []) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route, idx) => {
          const Component = route.component;
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;

          return (
            <RouteProgress
              key={`routes-${idx}`}
              path={route.path}
              exact={route.exact}
              render={(props) => (
                <Guard>
                  <Layout>
                    {route.routes ? (
                      renderRoutes(route.routes)
                    ) : (
                      <Component {...props} />
                    )}
                  </Layout>
                </Guard>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  );
}

const routes = [
  // Others Routes
  {
    exact: true,
    guard: GuestGuard,
    path: PATH_AUTH.login,
    component: lazy(() => import("../views/authentication/Login")),
  },
  {
    exact: true,
    path: PATH_AUTH.loginUnprotected,
    component: lazy(() => import("../views/authentication/Login")),
  },
  {
    exact: true,
    guard: GuestGuard,
    path: PATH_AUTH.register,
    component: lazy(() => import("../views/authentication/Register")),
  },
  {
    exact: true,
    path: PATH_AUTH.registerUnprotected,
    component: lazy(() => import("../views/authentication/Register")),
  },
  {
    exact: true,
    path: PATH_AUTH.resetPassword,
    component: lazy(() => import("../views/authentication/ResetPassword")),
  },
  {
    exact: true,
    path: PATH_AUTH.verify,
    component: lazy(() => import("../views/authentication/VerifyCode")),
  },
  {
    exact: true,
    path: PATH_PAGE.page404,
    component: lazy(() => import("../views/general/Page404")),
  },
  {
    exact: true,
    path: PATH_PAGE.page500,
    component: lazy(() => import("../views/general/Page500")),
  },
  {
    exact: true,
    path: PATH_PAGE.maintenance,
    component: lazy(() => import("../views/general/Maintenance")),
  },
  {
    exact: true,
    path: PATH_AUTH.root,
    component: () => <Redirect to={PATH_AUTH.login} />,
  },
  {
    path: PATH_DASHBOARD.root,
    guard: AuthGuard,
    layout: DashboardLayout,
    routes: [
      {
        exact: true,
        path: PATH_DASHBOARD.root,
        component: () => <Redirect to={PATH_DASHBOARD.general.app} />,
      },
      {
        exact: true,
        path: PATH_DASHBOARD.general.app,
        component: lazy(() => import("../views/dashboard/DashboardContent")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.application,
        component: lazy(() => import("../views/application/Application")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.menu,
        component: lazy(() => import("../views/menu/Menu")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.action,
        component: lazy(() => import("../views/action/Action")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.role,
        component: lazy(() => import("../views/role/Role")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.user.root,
        component: lazy(() => import("../views/user/User")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.parameter,
        component: lazy(() => import("../views/parameter/Parameter")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.unit,
        component: lazy(() => import("../views/unit/Unit")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.student,
        component: lazy(() => import("../views/student/Student")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.employee,
        component: lazy(() => import("../views/employee/Employee")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.parent,
        component: lazy(() => import("../views/parent/Parent")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.jenjang,
        component: lazy(() => import("../views/jenjang/Jenjang")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.school,
        component: lazy(() => import("../views/school/School")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.kelas,
        component: lazy(() => import("../views/kelas/Kelas")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.jurusan,
        component: lazy(() => import("../views/jurusan/Jurusan")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.parallel,
        component: lazy(() => import("../views/parallel/Parallel")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.tahunPelajaran,
        component: lazy(() =>
          import("../views/tahun-pelajaran/TahunPelajaran")
        ),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.profile,
        component: lazy(() => import("../views/profile/Profile")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.profile,
        component: lazy(() => import("../views/profile/Profile")),
      },
      {
        exact: true,
        path: PATH_DASHBOARD.category,
        component: lazy(() => import("../views/category/Category")),
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
  {
    path: "*",
    layout: HomeLayout,
    routes: [
      {
        exact: true,
        path: mode === "LOCAL" ? "/" : `/${folderName}`,
        component: () => (
          <Redirect
            to={mode === "LOCAL" ? "/dashboard" : `/${folderName}/dashboard`}
          />
        ),
      },
      // ----------------------------------------------------------------------

      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
];

export default routes;
