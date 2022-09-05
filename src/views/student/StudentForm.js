import { capitalCase } from "change-case";
import { useState, useEffect } from "react";
// material
import { Container, Tab, Box, Tabs } from "@material-ui/core";

// components

import StudentDetail from "./StudentDetail";
import StudentParent from "./StudentParent";
import StudentMutation from "./StudentMutation";
import StudentSibling from "./StudentSibling";

// ----------------------------------------------------------------------

export default function StudentForm(props) {
  const { row, actionCode } = props;
  const [currentTab, setCurrentTab] = useState("detail");

  let TABS = [
    {
      value: "detail",
      component: <StudentDetail {...props} />,
    },
  ];

  if (row && actionCode !== "CREATE") {
    TABS = [
      ...TABS,
      {
        value: "parent",
        component: <StudentParent {...props} />,
      },
      {
        value: "mutation",
        component: <StudentMutation {...props} />,
      },
      {
        value: "sibling",
        component: <StudentSibling {...props} />,
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
