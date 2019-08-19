import { toJS, action } from 'mobx';
import Cookies from 'js-cookie';

export default class BaseCoachmarksStore {
    cookieName() {
        return '';
    }
    
    serialize() {
        let data = {}
        for (const key of Object.keys(this)) {
            if (key.indexOf('_') === 0 && this[key] !== undefined) {
                // console.log(key, toJS(this[key]));
                data[key] = this[key];
            }
        }
        // console.log(data);
        return JSON.stringify(data);
    }

    @action.bound deserialize(json) {
        try {
            const data = JSON.parse(json);
            for (const key of Object.keys(data)) {
                if (json[key] !== undefined) {
                    console.log(key, json[key]);
                    this[key] = json[key];
                }
            }
        }
        catch (e) {
            this.reset();
            // console.error(e);
        }
    }

    writeState() {
        console.log('writeState');
        Cookies.set(this.cookieName(), this.serialize());
    }

    @action.bound restore() {
        const state = Cookies.get(this.cookieName());
        this.deserialize(state);
    }
    
    @action.bound reset() {
        return;
    }
}