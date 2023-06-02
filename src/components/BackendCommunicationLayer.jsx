import React from "react";
import BaseComponent from "./BaseComponent.jsx";
import LocalStorageService from "../services/local-storage-service.js";
import DropBusinessLogicLayer from "./DropBusinessLogicLayer.jsx";
import HashtagHelper from "../helpers/HashtagHelper.js";
import StringHash from "../helpers/string-hash.js";
import {
    UPDATE_DROPS, SET_SYNCING, SET_IS_SYNCED, ADD_UNSAVED_DROP, DROP_SUCCESSFULLY_SAVED,
    ATTEMPT_SAVE_DROP, DROP_FAILED_TO_SAVE
} from "../actions.js";
import { connect } from "react-redux";

const processIncomingDropList = function (droplist) {
    const clonelist = droplist.slice();
    for (const drop of clonelist) {
        if (drop.text === undefined) {
            debugger;
            throw new Error("Encountered empty drop.");
        }
        drop.key = `${Date.now()}:${StringHash.getHash(drop.text)}:${drop._id}`;
        drop.hashtags = HashtagHelper.parse(drop.text);
    }
    return clonelist;
};

class BackendCommunicationLayer extends BaseComponent {
    constructor (props) {
        super(props);

        this.state = {
            isSyncing : true
        }
        this.bindOwn([
            "updateDroptext",
            "trySavingFailedDropsAgain",
            "mergeDropsIntoLocal",
            "persistDropToDatabase",
            "createDrop",
            "deleteDrop"
        ]);
    }

    componentDidMount () {
        this.refreshDropsFromServer(this.props.username)
    }

    updateDroptext (droptext) {
        this.props.updateDroptext(droptext);
    }

    trySavingFailedDropsAgain () {
        throw new Error("unexpected use of trySavingFailedDropsAgain, which does nothing");
    }

    mergeDropsIntoLocal (dropList) {
        for (const drop of dropList) {
            LocalStorageService.saveDrop(drop);
        }
    }

    setIsSynced () {
        this.props.SET_IS_SYNCED();
        this.props.pushNewStatusMessage(this.COPY.IS_SYNCED_MESSAGE);
    }

    setIsSyncing () {
        this.props.SET_SYNCING();
        this.props.pushNewStatusMessage(this.COPY.IS_SYNCING_MESSAGE);
    }

    persistDropToDatabase (drop) {
        this.props.ATTEMPT_SAVE_DROP(drop);
        this.props.pushNewStatusMessage(this.COPY.SENDING_DROP);
        const observable = this.props.DropBackendService.saveNewDrop(drop);
        observable.subscribe((response) => {
            switch (response.status) {
            case "SUCCESS":
                this.props.pushNewStatusMessage(this.COPY.DROP_SAVED_SUCCESS);
                this.props.DROP_SUCCESSFULLY_SAVED(drop);
                // this.refreshDropsFromServer(this.props.username);
                break;
            case "FAILED_ATTEMPT":
                this.props.pushNewStatusMessage(this.COPY.SERVER_RESPONSE_ERROR);
                break;
            case "FAIL":
                this.postDropFailed(drop);
                this.props.setFatalError();
                break;
            default:
                break;
            }
        });
    }

    processIncomingDropList (droplist) {
        const clonelist = droplist.slice();
        for (const drop of clonelist) {
            drop.key = `${Date.now()}:${StringHash.getHash(drop.text)}:${drop._id}:${drop.key}`;
            drop.hashtags = HashtagHelper.parse(drop.text);
        }
        return clonelist;
    }

    refreshDropsFromServer (username) {
        this.setIsSyncing();
        const observable = this.props.DropBackendService.getUserDrops(username);
        let droplist;
        observable.subscribe((response) => {
            switch (response.status) {
            case "SUCCESS":
                droplist = response.data.slice();
                droplist = processIncomingDropList(droplist);
                this.updateDrops(droplist);
                this.mergeDropsIntoLocal(droplist);
                this.setIsSynced();
                break;
            case "FAILED_ATTEMPT":
                this.props.pushNewStatusMessage(this.COPY.SERVER_RESPONSE_ERROR);
                break;
            case "FAIL":
                this.props.setFatalError();
                break;
            default:
                break;
            }
        });
    }

    updateDrops = function (drops) {
        this.props.UPDATE_DROPS(drops);
    }

    removeDropFromUnsaved (drop) {
        const unsavedDrops = this.props.unsavedDrops.slice();
        const index = unsavedDrops.indexOf(drop);
        if (index > -1) {
            unsavedDrops.splice(index, 1);
            this.props.updateUnsavedDrops(unsavedDrops);
        }
    }

    postDropFailed (drop) {
        this.props.DROP_FAILED_TO_SAVE(drop);
        this.props.pushNewStatusMessage(this.COPY.POST_DROP_FAILED);
    }

    deleteDropFailed (drop, deletedLocal) {
        if (deletedLocal) {
            this.pushNewLocalDrop(drop);
        }
        this.props.pushNewStatusMessage(this.COPY.DELETE_DROP_FAILED);
        this.props.deleteDropFailed(drop, deletedLocal);
    }

    deleteDropFromServer (drop) {
        const deletedLocal = this.deleteLocalDrop(drop)
        this.props.pushNewStatusMessage(this.COPY.DELETE_DROP_STATUS);
        const observable = this.props.DropBackendService.deleteDrop(drop._id);
        observable.subscribe((response) => {
            switch (response.status) {
            case "SUCCESS":
                this.props.pushNewStatusMessage(this.COPY.DROP_WAS_DELETED);
                this.refreshDropsFromServer(this.props.username);
                break;
            case "FAILED_ATTEMPT":
                this.props.pushNewStatusMessage(this.COPY.SERVER_RESPONSE_ERROR);
                break;
            case "FAIL":
                this.deleteDropFailed(drop, deletedLocal);
                this.props.setFatalError();
                break;
            default:
                break;
            }
        });
    }

    pushNewLocalDrop (drop) {
        const drops = this.props.drops.slice();
        drops.push(drop);
        this.updateDrops(drops);
    }

    deleteLocalDrop (drop) {
        const drops = this.props.drops.slice();
        const index = drops.indexOf(drop);
        if (index > -1) {
            drops.splice(drops.indexOf(drop), 1);
            this.updateDrops(drops)
            return true;
        }
        return false;
    }

    createDrop (drop) {
        this.persistDropToDatabase(drop);
    }

    deleteDrop (drop) {
        this.deleteDropFromServer(drop);
        if (this.props.deleteDrop) {
            this.props.deleteDrop(drop);
        }
    }

    refreshDrops () {
        return this.refreshDropsFromServer();
    }

    render () {
        this.runRenderValidation();
        return (
            <div data-testid="BackendCommunicationLayer">
                <DropBusinessLogicLayer
                    deleteDrop = {this.deleteDrop}
                    createDrop = {this.createDrop}
                    refreshDrops = {this.refreshDrops}
                    updateDrops = {this.updateDrops}
                    username = {this.props.username}
                    updateUnsavedDrops = {this.props.updateUnsavedDrops}
                    appAlert = {this.props.appAlert}
                    appConfirm = {this.props.appConfirm}
                    trySavingFailedDropsAgain = {this.trySavingFailedDropsAgain}
                />
            </div>
        );
    }
}
const mapStateToProps = (state, ownProps) => ({
    drops : state.drops,
    isSyncing : state.isSyncing
})
const mapDispatchToProps = {
    UPDATE_DROPS,
    SET_SYNCING,
    SET_IS_SYNCED,
    ADD_UNSAVED_DROP,
    DROP_SUCCESSFULLY_SAVED,
    ATTEMPT_SAVE_DROP,
    DROP_FAILED_TO_SAVE
}

export default connect(mapStateToProps, mapDispatchToProps)(BackendCommunicationLayer);
