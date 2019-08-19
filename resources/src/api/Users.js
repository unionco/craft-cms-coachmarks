import axios from 'axios';

export async function getUsers() {
    return axios.get('/admin/coachmarks/api/users').then(resp => resp.data);
}
