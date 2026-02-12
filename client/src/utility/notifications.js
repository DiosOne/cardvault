import {toast} from 'react-toastify';
import {getMessage, resolveApiError} from '../utility/messages';

/**
 * Show a success toast based on a message key.
 * @param {string} key
 * @returns {void}
 */
export const notifySuccess= (key) => {
  toast.success(getMessage(key));
};

/**
 * Show an error toast using API error data or a fallback message.
 * @param {unknown} error
 * @param {string} [fallbackKey='GENERIC_ERROR']
 * @returns {void}
 */
export const notifyError= (error, fallbackKey= 'GENERIC_ERROR') => {
  toast.error(resolveApiError(error, fallbackKey));
};

/**
 * Show an informational toast based on a message key.
 * @param {string} key
 * @returns {void}
 */
export const notifyInfo= (key) => {
  toast.info(getMessage(key));
};

/**
 * Confirm a user action via a blocking browser prompt.
 * @param {string} messageKey
 * @param {string} [defaultText]
 * @returns {boolean}
 */
export const confirmAction= (messageKey, defaultText) => {
  const promptMessage= getMessage(messageKey) || defaultText;
  return window.confirm(promptMessage || 'Are you sure?');
};
