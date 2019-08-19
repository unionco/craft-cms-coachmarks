import axios from 'axios';



export async function getUsers() {
    return axios.get(window.Craft.getActionUrl('coacher/users/users')).then(resp => resp.data);
}
