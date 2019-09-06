import client from './Client';

export async function getCoachmarks() {
  return client
    .get(window.Craft.getActionUrl('coachmarks/coachmarks'))
    .then(resp => resp.data);
}

export async function getCoachmarkById(id) {
    return client
    .get(window.Craft.getActionUrl('coachmarks/coachmarks/one/' + id))
    .then(resp => resp.data);
}

export async function saveCoachmark(data) {
  return client
    .post(window.Craft.getActionUrl('coachmarks/coachmarks/edit'), {
      coachmark: data,
    })
    .then(resp => resp.data)
    .catch(resp => {
      console.log(resp);
    });
}
