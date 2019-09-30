import axios from 'axios';

const client = axios.create({
  headers: {
    'X-CSRF-Token': window.Craft.csrfTokenValue,
  },
});


export default client;
