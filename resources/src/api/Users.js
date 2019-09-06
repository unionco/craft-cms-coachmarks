import axios from 'axios';



export async function getUsers() {
    return axios.get(window.Craft.getActionUrl('coachmarks/users/users')).then(resp => resp.data);
}
