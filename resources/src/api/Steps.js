import client from './Client';

export async function newStep(data) {
  console.log(data);
  return client
    .post(window.Craft.getActionUrl('coacher/steps/new'), {
      step: data,
    })
    .then(resp => resp.data)
    .catch(resp => console.error(resp));
}
