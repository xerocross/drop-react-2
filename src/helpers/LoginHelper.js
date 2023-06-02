import LocalStorageUsername from "./LocalStorageUsername.js";
export default {
    tryToGetUsernameFromStorage () {
        const localUsername = LocalStorageUsername.getUsername();
        return localUsername || undefined;
    },
    setLocalUsername (username) {
        LocalStorageUsername.setUsername(username);
    },
    unsetLocalUsername () {
        LocalStorageUsername.clearUsername();
    }
}
