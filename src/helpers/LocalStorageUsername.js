export default {
    getUsername () {
        if (localStorage) {
            const username = localStorage.getItem("drop:username");
            return (username && username.length > 0) ? username : undefined;
        } else {
            return undefined;
        }
    },
    setUsername (username) {
        if (localStorage) {
            localStorage.setItem("drop:username", username);
        }
    },
    clearUsername () {
        if (localStorage) {
            localStorage.removeItem("drop:username");
        }
    }
}
