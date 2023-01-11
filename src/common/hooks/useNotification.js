import { notification } from 'antd';
import { useCallback } from 'react';

export function useNotification() {
  const [api, notifyContext] = notification.useNotification();
  const notify = useCallback((variant, message) => {
    return api[variant]({
      message,
      placement: 'top',
      duration: 2
    });
  }, []);

  return {
    notify,
    notifyContext
  };
}
