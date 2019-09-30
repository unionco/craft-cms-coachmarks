import client from './Client';

/**
 * Load all coachmarks for current user from backend
 * @return {array}
 */
export async function getCoachmarks() {
    // Get the URL from Craft
  const url = window.Craft.getActionUrl('coachmarks/coachmarks');

  return client
    .get(url)
    .then(resp => resp.data);
}

/**
 * Save the coachmark in the backend
 * @param {Object} data 
 * @return {Object}
 */
export async function saveCoachmark(data) {
  const url = window.Craft.getActionUrl('coachmarks/coachmarks/edit');
  
  return client
    .post(url, {
      coachmark: data,
    })
    .then(resp => resp.data)
    .catch(resp => {
      console.log(resp);
    });
}
