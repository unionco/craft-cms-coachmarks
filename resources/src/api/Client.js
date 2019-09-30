import axios from 'axios';

/**
 * Configurate an axios client
 */
const client = axios.create({
  headers: {
    'X-CSRF-Token': window.Craft.csrfTokenValue,
  },
});


export default client;
