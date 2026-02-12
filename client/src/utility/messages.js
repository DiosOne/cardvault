export const CLIENT_MESSAGES= {
  CARD_ADD_SUCCESS: 'Card added successfully!',
  CARD_ADD_ERROR: 'Could not add the card. Please try again.',
  CARD_DELETE_SUCCESS: 'Card deleted successfully!',
  CARD_DELETE_ERROR: 'Could not delete the card.',
  CARD_DELETE_CONFIRM: 'Delete this card?',
  CARD_UPDATE_SUCCESS: 'Card updated successfully!',
  CARD_UPDATE_ERROR: 'Could not update the card.',
  CARD_FETCH_SUCCESS: 'Fetching your cards.',
  CARD_FETCH_ERROR: "Couldn't fetch your cards please try again",
  REGISTER_SUCCESS: 'Registration successful!',
  REGISTER_ERROR: 'Registration failed. Please try again.',
  LOGIN_SUCCESS: 'Welcome back!',
  LOGIN_ERROR: 'Login failed. Please check your credentials.',
  PUBLIC_TRADES_ERROR: 'Failed to load public trade cards.',
  TRADE_SEND_SUCCESS: 'Trade request sent!',
  TRADE_SEND_ERROR: 'Failed to send trade request.',
  TRADE_ACCEPT_SUCCESS: 'Trade accepted.',
  TRADE_DECLINE_SUCCESS: 'Trade declined.',
  TRADE_ACTION_ERROR: 'Unable to update the trade. Please try again.',
  TRADE_FETCH_ERROR: 'Unable to load your trades right now.',
  AUTH_REQUIRED: 'Please log in to continue.',
  OWN_LISTING: 'You already listed this card.',
  MESSAGE_REQUIRED: 'Please enter a message before sending.',
  LOGOUT_CONFIRM: 'Log out of CardVault?',
  STATUS_REQUIRED: 'Please select a status before continuing.',
  TRADE_REFRESH_SUCCESS: 'Trade inbox updated.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

/**
 * Return a client-facing message by key, with a fallback when missing.
 * @param {string} key
 * @param {string} [fallbackKey='GENERIC_ERROR']
 * @returns {string}
 */
export const getMessage= (key, fallbackKey= 'GENERIC_ERROR') =>
  CLIENT_MESSAGES[key] || CLIENT_MESSAGES[fallbackKey];

/**
 * Resolve a friendly error message from API responses or thrown errors.
 * @param {unknown} error
 * @param {string} [fallbackKey='GENERIC_ERROR']
 * @returns {string}
 */
export const resolveApiError= (error, fallbackKey= 'GENERIC_ERROR') => {
  if (!error) return getMessage(fallbackKey);
  if (typeof error === 'string') return error;
  return (
    error?.response?.data?.message ||
    error?.message ||
    getMessage(fallbackKey)
  );
};
