import client from './Client';

export async function getCoachmarks() {
  return client
    .get(window.Craft.getActionUrl('coachmarks/coachmarks/coachmarks'))
    .then(resp => resp.data);
}

export async function getCoachmarkById(id) {
    return client
    .get(window.Craft.getActionUrl('coachmarks/coachmarks/one/' + id))
    .then(resp => resp.data);
}

export async function newCoachmark(data) {
  return client
    .post(window.Craft.getActionUrl('coachmarks/coachmarks/new'), {
      coachmark: data,
    })
    .then(resp => resp.data)
    .catch(resp => {
      console.log(resp);
    });
}
