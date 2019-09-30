import client from './Client';

/**
 * Send a request to the steps controller edit method
 * @param {object} data 
 */
export async function saveStep(data) {
  // Get the URL from Craft
  const url = window.Craft.getActionUrl('coachmarks/steps/edit');
  
  return client
    .post(url, {
      step: data,
    })
    .then(resp => resp.data)
    .catch(resp => console.error(resp));
}
