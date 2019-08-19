import axios from 'axios';

export async function getCoachmarks() {
  return axios.get('/admin/coachmarks/api/coachmarks').then(resp => resp.data);
}
