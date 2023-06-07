import { LocalStorageWrapper } from "cross-js-base";
const base_key = "drop-local-storage"

export default {
    getDropListKey (username) {
        return `${base_key}:${username}`;
    },
    getDropKey (dropId) {
        return `${base_key}:${dropId}`;
    },
    addToList (username, drop) {
        if (!localStorage) {
            return;
        }
        const listKey = this.getDropListKey(username);
        let list;
        try {
            list = JSON.parse(LocalStorageWrapper.getItem(listKey));
            list.push(drop._id);
            LocalStorageWrapper.setItem(listKey, JSON.stringify(list));
        } catch (e) {
            list = [];
            list.push(drop._id);
            LocalStorageWrapper.setItem(listKey, JSON.stringify(list));
        }
    },
    saveDrop (drop) {
        const username = drop.username;
        LocalStorageWrapper.setItem(this.getDropKey(drop._id), JSON.stringify(drop));
        this.addToList(username, drop);
    },
    getDrop (id) {
        return JSON.parse(LocalStorageWrapper.getItem(this.getDropKey(id)));
    }
}
