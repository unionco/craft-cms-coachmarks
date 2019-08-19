import axios from 'axios';

const client = axios.create({
  headers: {
    'X-CSRF-Token': window.Craft.csrfTokenValue,
  },
});

export async function getCoachmarks() {
  return client
    .get(window.Craft.getActionUrl('coacher/coachmarks/coachmarks'))
    .then(resp => resp.data);
}

export async function getCoachmarkById(id) {
    return client
    .get(window.Craft.getActionUrl('coacher/coachmarks/one/' + id))
    .then(resp => resp.data);
}

export async function newCoachmark(data) {
  return client
    .post(window.Craft.getActionUrl('coacher/coachmarks/new'), {
      coachmark: data,
    })
    .then(resp => resp.data)
    .catch(resp => {
      console.log(resp);
    });
}
