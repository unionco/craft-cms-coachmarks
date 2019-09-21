import { toJS, action } from 'mobx';
// import Cookies from 'js-cookie';

export default class BaseCoachmarksStore {
    cookieName() {
        return '';
    }
    
    skipProperties() {
        return [];
    }

    serialize() {
        let data = {}
        for (const key of Object.keys(this)) {
            if (key.indexOf('_') === 0 && this[key] !== undefined && !this.skipProperties().includes(key)) {
                // console.log(key, toJS(this[key]));
                data[key] = this[key];
            }
        }
        // console.log(data);
        return JSON.stringify(data);
    }

    @action.bound deserialize(json) {
        // debugger;
        try {
            // console.log(this.cookieName());
            // console.log(json);
            if (!json) {
                this.reset();
                return;
            }
            // console.log(json);
            const data = JSON.parse(json);
            for (const key of Object.keys(data)) {
                if (data[key] !== undefined && !this.skipProperties().includes(key)) { 
                    // console.log(key, data[key]);
                    this.set(key, data[key], false);
                }
            }
        }
        catch (e) {
            console.error(e);
            console.log(json);
            console.error('reseting');
            this.reset();
            // console.error(e);
        }
    }

    writeState() {
        console.log('writeState', this.cookieName());
        localStorage.setItem(this.cookieName(), this.serialize());
    }

    @action.bound restore() {
        const state = localStorage.getItem(this.cookieName());
        this.deserialize(state);
    }
    
    @action.bound reset() {
        return;
    }

    @action.bound set(prop, val, write = true) {
        this[prop] = val;
        if (write) {
            this.writeState();
        }
    }
}