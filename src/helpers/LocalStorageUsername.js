import { LocalStorageWrapper } from "cross-js-base";

export default {
    getUsername () {
        if (localStorage) {
            const username = LocalStorageWrapper.getItem("drop:username");
            return (username && username.length > 0) ? username : undefined;
        } else {
            return undefined;
        }
    },
    setUsername (username) {
        if (localStorage) {
            LocalStorageWrapper.setItem("drop:username", username);
        }
    },
    clearUsername () {
        if (localStorage) {
            LocalStorageWrapper.removeItem("drop:username");
        }
    }
};
