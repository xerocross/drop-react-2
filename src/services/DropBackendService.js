import DurableAxios from "../helpers/DurableAxios.js";
const baseUrl = "https://thin-data-backend.herokuapp.com";

export default {
    saveNewDrop (drop) {
        const url = baseUrl + `/drop`;
        return DurableAxios.post({
            url : url,
            data : drop,
            numTries : 7
        });
    },
    deleteDrop (id) {
        const deleteUrl = `${baseUrl}/drop/${id}`;
        return DurableAxios.delete({
            url : deleteUrl,
            numTries : 7
        });
    },
    getUserDrops (username) {
        const url = `${baseUrl}/drops?username=${encodeURIComponent(username)}`;
        return DurableAxios.get({
            url : url,
            numTries : 7
        });
    }
};
