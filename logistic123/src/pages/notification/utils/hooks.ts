import { useCallback, useRef } from 'react';
import tokenManage from 'helpers/request/tokenManager';
import { io, Socket } from 'socket.io-client';
import useEffectOnce from 'hoc/useEffectOnce';
import { CONFIG } from 'config';
import { useDispatch } from 'react-redux';
import { saveNotificationActions } from '../store/action';

export const useSocketNotification = () => {
  const socketRef = useRef<Socket>();
  const dispatch = useDispatch();

  useEffectOnce(() => {
    socketRef.current = io(CONFIG.BASE_URL, {
      reconnectionDelayMax: 10000,
      auth: {
        token: tokenManage.token,
      },
      query: {
        token: `Bearer ${tokenManage.token}`,
      },
      transports: ['websocket'],
      path: '/notification/socket.io',
    });

    socketRef.current.on('connection', (pkg) => {
      dispatch(
        saveNotificationActions.request(pkg?.totalUnreadNotification || 0),
      );
    });

    socketRef.current.on('new-push', (pkg) => {
      dispatch(
        saveNotificationActions.request(pkg?.totalUnreadNotification || 0),
      );
    });

    socketRef.current.on('read', (pkg) => {
      dispatch(
        saveNotificationActions.request(pkg?.totalUnreadNotification || 0),
      );
    });
  });

  const connectSocketNotification = useCallback(() => {
    socketRef?.current?.connect();
  }, []);

  const disconnectSocketNotification = useCallback(() => {
    socketRef?.current?.disconnect();
  }, []);

  return { connectSocketNotification, disconnectSocketNotification };
};
