import { Icon } from "@iconify/react";
import { capitalCase } from "change-case";
import { useState, useEffect } from "react";
import bellFill from "@iconify/icons-eva/bell-fill";
import shareFill from "@iconify/icons-eva/share-fill";
import { useDispatch, useSelector } from "react-redux";
import roundVpnKey from "@iconify/icons-ic/round-vpn-key";
import roundReceipt from "@iconify/icons-ic/round-receipt";
import roundAccountBox from "@iconify/icons-ic/round-account-box";
// material
import { Container, Tab, Box, Tabs } from "@material-ui/core";

// redux
import {
  getCards,
  getProfile,
  getInvoices,
  getAddressBook,
  getNotifications,
} from "../../redux/slices/user";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// components

import RoleDetail from "./RoleDetail";
import RolePriviledge from "./RolePriviledge";
import RoleUser from "./RoleUser";
import RoleApproval from "./RoleApproval";

// ----------------------------------------------------------------------

export default function RoleForm(props) {
  const { row, actioncode } = props;
  const [currentTab, setCurrentTab] = useState("detail");

  let TABS = [
    {
      value: "detail",
      component: <RoleDetail {...props} />,
    },
  ];

  if (row && actioncode !== "CREATE") {
    TABS = [
      ...TABS,
      {
        value: "priviledge",
        component: <RolePriviledge {...props} />,
      },
      {
        value: "user",
        component: <RoleUser {...props} />,
      },
      {
        value: "approval",
        component: <RoleApproval {...props} />,
      },
    ];
  }

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Container>
      <Box
        sx={{
          paddingBottom: 2,
        }}
      >
        <Tabs
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={handleChangeTab}
        >
          {TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={capitalCase(tab.value)}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Box>
    </Container>
  );
}
