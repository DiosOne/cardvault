import {toast} from 'react-toastify';
import {getMessage, resolveApiError} from '/messages';

export const notifySuccess= (key) => {
  toast.success(getMessage(key));
};

export const notifyError= (error, fallbackKey= 'GENERIC_ERROR') => {
  toast.error(resolveApiError(error, fallbackKey));
};

export const notifyInfo= (key) => {
  toast.info(getMessage(key));
};

export const confirmAction= (messageKey, defaultText) => {
  const promptMessage= getMessage(messageKey) || defaultText;
  return window.confirm(promptMessage || 'Are you sure?');
};
