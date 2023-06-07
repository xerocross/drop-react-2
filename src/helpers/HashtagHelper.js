export default {
    removeDuplicates (arr) {
        const returnList = [];
        for (const item of arr) {
            const lowercaseItem = item.toLowerCase();
            if (!returnList.includes(lowercaseItem)) {
                returnList.push(lowercaseItem);
            }
        }
        return returnList;
    },
    parse (str) {
        const pattern = /#[0-9a-zA-Z]+/g;
        let hashtags = str.match(pattern);
        hashtags = this.removeDuplicates(hashtags || []);
        hashtags = hashtags.map(val => (val.toLowerCase()));
        return hashtags;
    }
};
