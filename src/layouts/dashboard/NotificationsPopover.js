// import faker from 'faker';
import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import { useRef, useState, useEffect } from 'react';
import { set, sub, formatDistanceToNow } from 'date-fns';
import { Icon } from '@iconify/react';
import bellFill from '@iconify/icons-eva/bell-fill';
import clockFill from '@iconify/icons-eva/clock-fill';
import doneAllFill from '@iconify/icons-eva/done-all-fill';
import useAuth from 'src/hooks/useAuth';
import { axiosInstance as axios, endpoint } from "../../utils/axios";
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../routes/paths';

// material
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  ListItem,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar
} from '@material-ui/core';
// utils
import { mockImgAvatar } from '../../utils/mockImages';
// components
import Scrollbar from '../../components/Scrollbar';
import MenuPopover from '../../components/MenuPopover';
import { MIconButton } from '../../components/@material-extend';
import { ConnectedTvOutlined } from '@material-ui/icons';


function renderContent(notification) {
  const title_notification = (
    <Typography variant="subtitle2">
      {notification.title_notification}
      <Typography
        component="span"
        variant="body2"
        sx={{ color: 'text.secondary' }}
      >
        {/* &nbsp; {noCase(notification.content_notification)} */}
        &nbsp; {notification.content_notification}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: (
        <img
          alt={notification.title_notification}
          src={`${process.env.PUBLIC_URL}/static/icons/ic_notification_package.svg`}
        />
      ),
      title_notification
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: (
        <img
          alt={notification.title_notification}
          src={`${process.env.PUBLIC_URL}/static/icons/ic_notification_shipping.svg`}
        />
      ),
      title_notification
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: (
        <img
          alt={notification.title_notification}
          src={`${process.env.PUBLIC_URL}/static/icons/ic_notification_mail.svg`}
        />
      ),
      title_notification
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: (
        <img
          alt={notification.title_notification}
          src={`${process.env.PUBLIC_URL}/static/icons/ic_notification_chat.svg`}
        />
      ),
      title_notification
    };
  }

  if (notification.type === 'information') {
    return {
      avatar: (
        <img
          alt={notification.title_notification}
          src={`${process.env.PUBLIC_URL}/static/icons/information.svg`}
        />
      ),
      title_notification
    };
  }
  
  return {
    avatar: <img 
                alt={notification.title_notification} 
                src={notification.reciver_name} 
            />,
    title_notification
  };
}

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired
};

function NotificationItem({ notification, getTotalUnRead, handleClose, getData, setNotifications}) {
  const history = useHistory();

  //buka ini jika ingin aupdate status reading di database
  // const updateNotif = async (id) => {
  //   let params = {
  //     idUserLogin: [id],
  //     notif:'Pusat'
  //   };
  //   const response = await axios.put(endpoint.notification.update, {params:params}, );
  //   if(response){
  //     getData();
  //     getTotalUnRead();
  //   }
  // };

  // const removeNotifShow = (id) => {
  //   console.log('ini isi notif', notification);
  //   setNotifications(notification.filter((notif) => notif.id !== id));
  // }



  const handleClickNotif = (id, path_tujuan) => {
    handleClose();
    // updateNotif(id);
    // removeNotifShow(id);
    // history.push(PATH_DASHBOARD.mpp.listmpptransactiondata);
    // history.push(PATH_DASHBOARD.mpp.listmppakademik);
  }

  const { id,sender_id,sender_application_name, title_notification, path_destination, type, avatar } = renderContent(notification);

  return (
    <ListItem
      button
      // to={PATH_DASHBOARD.mpp.listmpptransactiondata}
      disableGutters
      key={notification.id}
      // component={RouterLink}
      onClick={() => handleClickNotif(notification.id, notification.path_destination)}
      sx={{
        py: 1.5,
        px: 2.5,
        '&:not(:last-of-type)': { mb: '1px' },
        ...(notification.readed_notification && {
          bgcolor: 'action.selected'
        })
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
        {/* <Avatar sx={{ bgcolor: 'background.neutral' }}>{sender_application_name}</Avatar> */}
      </ListItemAvatar>
      <ListItemText
        primary={title_notification}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled'
            }}
          >
            <Box
              component={Icon}
              icon={clockFill}
              sx={{ mr: 0.5, width: 16, height: 16 }}
            />
            {formatDistanceToNow(new Date(notification.created_at))}
          </Typography>
        }
      />
    </ListItem>
  );
}

export default function NotificationsPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const {user, units=[]} = useAuth();
  // const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [notifications, setNotifications] = useState([]);
  // const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;
  const [totalUnRead, settotalUnRead] = useState(0);
  const [idUnred,setidUnred ] = useState([]);
  
  const handleMarkAllAsRead = () => {
    let idNotifUnread = [];
    setidUnred(
      notifications.filter((notif) => notif.readed_notification == 0).map(item => {
        idNotifUnread.push(item.id);
      })
    );

    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        readed_notification: 1,
      }))
    );

    settotalUnRead(0);
    updateAllUnread(idNotifUnread);
  };

  const handleClose = () => {
    setOpen(false);
  }
  
  const getData = async () => {
    const params = { 
      noindentitas:user.username,
    };

    const response = await axios.get(endpoint.notification.root, { params: params});
    // console.log('aku adalah response ', response);
    if (response && response.data) {
      setNotifications(response.data);
    }
  };

  const getTotalUnRead = async () => {
    const params = { 
      noindentitas:user.username,
    };
    const response = await axios.get(endpoint.notification.totalunread, { params: params});
    // console.log('aku adalah total unread response ', response);
    if (response && response.data) {
      settotalUnRead(response.data.total);
    }
  }

  const updateAllUnread = async (idNotifUnread) => {
    let params = {
      idUserLogin: idNotifUnread,
      notif:'Pusat Informasi'
    };
    const response = await axios.put(endpoint.notification.update, {params:params});
  };

  useEffect(() => {
    getData();
    getTotalUnRead();
  }, []);

  return (
    <>
      <MIconButton
        ref={anchorRef}
        onClick={() => setOpen(true)}
        color={open ? 'primary' : 'default'}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Icon icon={bellFill} width={20} height={20} />
        </Badge>
      </MIconButton>

      <MenuPopover
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorRef.current}
        sx={{ width: 360 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {totalUnRead} pesan belum dibaca
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Tandai semua sudah dibaca">
              <MIconButton color="primary" onClick={handleMarkAllAsRead}>
                <Icon icon={doneAllFill} width={20} height={20} />
              </MIconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: 'overline' }}
              >
                Baru
              </ListSubheader>
            }
            
          >
            {/* {notifications.slice(0, 2).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                getTotalUnRead={getTotalUnRead}
              />
            ))} */}

              {notifications.filter((item) => item.readed_notification === 0).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                getTotalUnRead={getTotalUnRead}
                handleClose={handleClose}
                getData={getData}
                setNotifications={notifications}
              />
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: 'overline' }}
              >
                Sebelumnya
              </ListSubheader>
            }
          >
            {/* {notifications.slice(2, 5).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                getTotalUnRead={getTotalUnRead}
              />
            ))} */}
            {notifications.filter((item) => item.readed_notification === 1).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                getTotalUnRead={getTotalUnRead}
                handleClose={handleClose}
              />
            ))}
          </List>
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple component={RouterLink} to="#">
            View All
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
