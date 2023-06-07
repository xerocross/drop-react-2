import React from 'react';
import { cleanup, render, act } from '@testing-library/react';
import BackendCommunicationLayer from "./BackendCommunicationLayer.jsx";
import Observable from "../helpers/Observable";
import Store from "../store.js";
import { Provider } from "react-redux";
import COPY from "../configuration/messages-copy.js";

let div;
let store;

let DropBackendService;
const getBackendService = () => {
    return {
        getUserDrops : () => (new Observable((observer) => {

        })),
        saveNewDrop : (username) => {
            return new Observable((observer) => {
                observer.next({
                });
            });
        },
        deleteDrop : (username) => {
            return new Observable((observer) => {
            });
        }
    };
};
const noop = () => {};
let getByTestId;
beforeEach(() => {
    div = document.createElement('div');
    store = Store();
    DropBackendService = getBackendService();
});

afterEach(() => {
    cleanup();
});

const throwIt = (val) => {
    throw new Error(`${val} not defined`);
};

function renderWithOptions (config) {
    return render(<Provider store={store}><BackendCommunicationLayer
        username = {config.username || "adam"}
        pushNewStatusMessage = {config.pushNewStatusMessage || noop}
        changeUser = {config.changeUser || noop}
        DropBackendService = {config.DropBackendService || DropBackendService}
        setFatalError = {config.setFatalError || noop}
        updateDrops = {config.updateDrops || noop}
        isSyncing = {config.isSyncing || false}
        unsavedDrops = {config.unsavedDrops || []}
        updateDroptext = {config.updateDroptext || noop}
        createDrop = {config.createDrop || noop}
        updateUnsavedDrops = {config.updateUnsavedDrops || noop}
        appAlert = {config.appAlert || (() => throwIt("appAlert"))}
        appConfirm = {config.appConfirm || (() => throwIt("appConfirm"))}
        deleteDropFailed = {config.deleteDropFailed || noop}
    /></ Provider>, div);
}

describe("status messages", () => {
    it("pushes the COPY.IS_SYNCING_MESSAGE status if refreshes drops from backend, start", () => {
        const pushNewStatusMessage = jest.fn();
        ({ getByTestId } = renderWithOptions({
            pushNewStatusMessage : pushNewStatusMessage
        }));
        expect(pushNewStatusMessage.mock.calls[0][0]).toBe(COPY.IS_SYNCING_MESSAGE);
    });
    it("pushes the COPY.IS_SYNCED_MESSAGE status if refreshing drops from backend succeeds", () => {
        let localObserver;
        DropBackendService.getUserDrops = (username) => {
            return new Observable((observer) => {
                localObserver = observer;
            });
        };
        const pushNewStatusMessage = jest.fn();
        ({ getByTestId } = renderWithOptions({
            pushNewStatusMessage : pushNewStatusMessage
        }));
        act(() => {
            localObserver.next({
                status : "SUCCESS",
                data : []
            });
        });
        expect(pushNewStatusMessage.mock.calls[1][0]).toBe(COPY.IS_SYNCED_MESSAGE);
    });
    it("pushes the COPY.SERVER_RESPONSE_ERROR status if refreshing drops from backend has failed attempt", () => {
        let localObserver;
        DropBackendService.getUserDrops = (username) => {
            return new Observable((observer) => {
                localObserver = observer;
            });
        };
        const pushNewStatusMessage = jest.fn();
        ({ getByTestId } = renderWithOptions({
            pushNewStatusMessage : pushNewStatusMessage
        }));
        act(() => {
            localObserver.next({
                status : "FAILED_ATTEMPT"
            });
        });
        expect(pushNewStatusMessage.mock.calls[1][0]).toBe(COPY.SERVER_RESPONSE_ERROR);
    });
});

test('calls getUserDrops on mount', (done) => {
    DropBackendService.getUserDrops = () => {
        done();
        return new Observable((observer) => {});
    };
    renderWithOptions({});
});

test('calls setFatalError if call to DropBackendService.getUserDrops returns "FAIL" status', (done) => {
    const setFatalError = () => {
        done();
    };
    DropBackendService.getUserDrops = (username) => {
        return new Observable((observer) => {
            observer.next({
                status : "FAIL"
            });
        });
    };
    (renderWithOptions({
        setFatalError : setFatalError
    }));
});

test('calls getUserDrops on mount with the username that was passed in', (done) => {
    DropBackendService.getUserDrops = (username) => {
        expect(username).toBe("adam");
        done();
        return new Observable((observer) => {
        });
    };
    renderWithOptions({});
});

test('calls getUserDrops on mount and subscribes to observable', (done) => {
    DropBackendService.getUserDrops = (username) => {
        return new Observable((observer) => {
            done();
        });
    };
    renderWithOptions({});
});

test('dispatches UPDATE_DROPS if getUserDrops returns "SUCCESS"', () => {
    let localObserver;
    DropBackendService.getUserDrops = (username) => {
        return new Observable((observer) => {
            localObserver = observer;
        });
    };
    store.dispatch = jest.fn();
    ({ getByTestId } = renderWithOptions({}));
    store.dispatch.mockClear();
    localObserver.next({
        status : "SUCCESS",
        data : [
            {
                text : "candy #apple",
                hashtags : ["#apple"],
                key : "0"
            }
        ]
    });
    expect(store.dispatch.mock.calls[0][0].type).toBe("UPDATE_DROPS");
});

test('passes correct number of data entries to UPDATE_DROPS (3)', () => {
    let localObserver;
    DropBackendService.getUserDrops = (username) => {
        return new Observable((observer) => {
            localObserver = observer;
        });
    };
    store.dispatch = jest.fn();
    ({ getByTestId } = renderWithOptions({}));
    store.dispatch.mockClear();
    localObserver.next({
        status : "SUCCESS",
        data : [
            {
                text : "candy #apple",
                hashtags : ["#apple"],
                key : "0"
            },
            {
                text : "candy #apple",
                hashtags : ["#apple"],
                key : "1"
            },
            {
                text : "candy #apple",
                hashtags : ["#apple"],
                key : "2"
            }
        ]
    });
    expect(store.dispatch.mock.calls[0][0].type).toBe("UPDATE_DROPS");
});
