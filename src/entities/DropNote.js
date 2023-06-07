import HashtagHelpers from "../helpers/HashtagHelper.js";
import StringHash from "../helpers/StringHash.js";

export default class Drop {
    constructor (text, username) {
        const time = Date.now();
        const preHash = `${username}:${time}:${text}`
        let hash = StringHash.getHash(preHash);
        hash = Math.abs(hash);
        this.text = text;
        this.hashtags = HashtagHelpers.parse(text);
        this.username = username;
        this.key = hash;
    }
}
