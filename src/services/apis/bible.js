import axios from 'axios';

const API_VERSION = 'v1';
export default axios.create({
  baseURL: `https://api.scripture.api.bible/${API_VERSION}`,
  headers: {
    'api-key': '85fb473bddda81865874c94b56b885fc',
  },
});
