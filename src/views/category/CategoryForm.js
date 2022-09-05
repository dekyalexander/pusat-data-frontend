import { Box, Tabs, Tab } from "@material-ui/core";
import React, { Fragment, useState } from "react";
import CategoryApplication from "./CategoryApplication";
import CategoryDetail from "./CategoryDetail";
import { capitalCase } from "change-case";

export default function CategoryForm(props) {
  const { row, actionCode } = props;
  const [currentTab, setCurrentTab] = useState("detail");

  let TABS = [
    {
      value: "detail",
      component: <CategoryDetail {...props} />,
    },
  ];
  if (row && actionCode !== "CREATE") {
    TABS = [
      ...TABS,
      {
        value: "Application",
        component: <CategoryApplication {...props} />,
      },
    ];
  }

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };
  return (
    <Fragment>
      <Box
        sx={{
          padding: 2,
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
    </Fragment>
  );
}
