import HashtagHelper from "./helpers/HashtagHelper";
import QAHelper from "./helpers/QaHelper.js";

const initialState = (obj) => {
    let unsavedDrops = [];
    let dropsFailedToSave = [];

    QAHelper.exists("unsaved")
        .then(() => {
            unsavedDrops = QAHelper.exampleDrops.slice();
        });
    QAHelper.exists("failedsave")
        .then(() => {
            console.log("failedsave");
            dropsFailedToSave = QAHelper.exampleDrops.slice();
        });

    return Object.assign(obj, {
        droptext : "",
        drops : [],
        selectedDrops : [],
        hashtags : [],
        isSyncing : false,
        username : undefined,
        isUsernameSet : false,
        unsavedDrops : unsavedDrops,
        dropsFailedToSave : dropsFailedToSave,
        isTryingSaveAgain : false
    });
}

const cloneObj = (obj) => {
    const newObj = {};
    return Object.assign(newObj, obj);
}

function getHashtags (previousState, state) {
    const prevHashtags = previousState.hashtags;
    const newHashtagList = HashtagHelper.parse(state.droptext);
    if (prevHashtags.length !== newHashtagList.length) {
        return newHashtagList;
    } else {
        for (let i = 0; i < prevHashtags.length; i++) {
            if (prevHashtags[i] !== newHashtagList[i]) {
                return newHashtagList;
            }
        }
        return prevHashtags;
    }
}

function getSelectedDrops (previousState, state) {
    if (previousState.hashtags === state.hashtags && previousState.drops === state.drops) {
        return previousState.selectedDrops;
    }
    const hashtags = state.hashtags;
    let selectedDrops = state.drops.slice();
    function testFunc (drop, hashtag) {
        const pattern = new RegExp(hashtag.substring(1), "i"); // cut off the '#' symbol
        return pattern.test(drop.text);
    }
    for (const tag of hashtags) {
        selectedDrops = selectedDrops.filter(drop => testFunc(drop, tag));
    }
    return selectedDrops;
}

function addToList (list, elt) {
    const clonelist = list.slice();
    clonelist.push(elt);
    return clonelist;
}

function removeFromList (list, elt) {
    const cloneList = list.slice();
    const index = cloneList.indexOf(elt);
    if (index > -1) {
        cloneList.splice(index, 1);
    }
    return cloneList;
}

export default function (state, action) {
    if (typeof state === "undefined") {
        return initialState({});
    }
    const newState = cloneObj(state);
    let unsavedDrops;
    let index;
    let droplist;
    switch (action.type) {
    case "NEW_DROPTEXT":
        newState.droptext = action.payload;
        break;
    case "UPDATE_DROPS":
        newState.drops = action.payload;
        break;
    case "SET_SYNCING":
        newState.isSyncing = true;
        break;
    case "SET_IS_SYNCED":
        newState.isSyncing = false;
        break;
    case "TRY_SAVING_FAILED_DROPS_AGAIN":
        newState.isTryingSaveAgain = true;
        break;
    case "POST_USERNAME_SET":
        newState.isUsernameSet = true;
        newState.username = action.payload;
        break;
    case "UNSET_USERNAME":
        newState.isUsernameSet = false;
        newState.usernam = undefined;
        break;
    case "CREATE_NEW_DROP":
        newState.droptext = "";
        break;
    case "DROP_SUCCESSFULLY_SAVED":
        droplist = state.drops.slice();
        droplist.push(action.payload);
        newState.drops = droplist;
        unsavedDrops = state.unsavedDrops.slice();
        index = unsavedDrops.indexOf(action.payload);
        if (index > -1) {
            unsavedDrops.splice(index, 1);
        }
        newState.unsavedDrops = unsavedDrops;
        break;
    case "ATTEMPT_SAVE_DROP":
        const drop = action.payload;
        unsavedDrops = state.unsavedDrops.slice();
        unsavedDrops.push(drop);
        newState.unsavedDrops = unsavedDrops;
        break;
    case "DROP_FAILED_TO_SAVE":
        newState.dropsFailedToSave = addToList(state.dropsFailedToSave, action.payload);
        newState.unsavedDrops = removeFromList(state.unsavedDrops, action.payload);
        break;
    case "ADD_UNSAVED_DROP":
        throw new Error("deprecated");
    case "REMOVE_UNSAVED_DROP":
        throw new Error("REMOVE_UNSAVED_DROP");
    default:
        break;
    }

    newState.hashtags = getHashtags(state, newState);
    newState.selectedDrops = getSelectedDrops(state, newState);
    return newState;
}
