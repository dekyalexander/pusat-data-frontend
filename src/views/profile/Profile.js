// material
import { useState } from "react";
import {
  Box,
  Grid,
  Container,
  Typography,
  Button,
  Dialog,
  ListItem,
  ListItemText,
} from "@material-ui/core";
// components
import Page from "../../components/Page";
import useAuth from "src/hooks/useAuth";
import Mchip from "src/components/@material-extend/MChip";
import ChangePasswordForm from "./ChangePasswordForm";

// ----------------------------------------------------------------------

export default function Profile(props) {
  const { user = {}, roles = [] } = useAuth();
  const [openDialog, setopenDialog] = useState(false);
  const [maxWidth, setMaxWidth] = useState("sm");

  const showChangePassword = () => {
    setopenDialog(true);
  };

  const handleClose = () => {
    setopenDialog(false);
  };

  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Profile</Typography>
        </Box>
        <Grid container>
          <Grid item xs={2} container>
            Name
          </Grid>
          <Grid item xs={1} container>
            :
          </Grid>
          <Grid item xs={9} container>
            {user.name}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={2} container>
            Username
          </Grid>
          <Grid item xs={1} container>
            :
          </Grid>
          <Grid item xs={9} container>
            {user.username}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={2} container>
            Role
          </Grid>
          <Grid item xs={1} container>
            :
          </Grid>
          <Grid item xs={9} container>
            {roles.map((role, index) => (
              <ListItem key={index} component="div">
                <ListItemText primary={`- ${role.name}`} />
              </ListItem>
            ))}
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={3} container>
            <Button
              variant="contained"
              onClick={showChangePassword}
              color="primary"
            >
              Change Password
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={openDialog}
        maxWidth={maxWidth}
        onClose={handleClose}
        fullWidth
        scroll="body"
      >
        <ChangePasswordForm closeSubDialog={handleClose} />
      </Dialog>
    </Page>
  );
}
