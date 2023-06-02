import HashtagHelpers from "./HashtagHelper.js";

export default {
    getSelectedDrops : function (droplist, hashtags) {
        let selectedDrops = droplist.slice();
        const test = (hashtags, tag) => {
            return (hashtags.indexOf(tag) > -1);
        }
        for (const tag of hashtags) {
            selectedDrops = selectedDrops.filter((drop) => (test(HashtagHelpers.parse(drop.text), tag)));
        }
        return selectedDrops;
    }
}
