import axios from 'axios';

/**
 * Load all available users from the backend
 * @return {array}
 */
export async function getUsers() {
  const url = window.Craft.getActionUrl('coachmarks/users/users');

  return axios
    .get(url)
    .then(resp => resp.data);
}

/**
 * Get the current user ID from the backend
 * @return {Object}
 */
export async function getCurrentUser() {
  const url = window.Craft.getActionUrl('coachmarks/users/current');

  return axios
    .get(url)
    .then(resp => resp.data);
}
