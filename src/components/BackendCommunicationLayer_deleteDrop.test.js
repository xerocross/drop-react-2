import React from 'react';
import { cleanup, fireEvent, act, render } from '@testing-library/react';
import BackendCommunicationLayer from "./BackendCommunicationLayer.jsx";
import Observable from "../helpers/Observable";
import $ from "jquery";
import Store from "../store.js";
import { Provider } from "react-redux";
import { UPDATE_DROPS } from "../actions.js";
import COPY from "../configuration/messages-copy.js";
import DropNote from "../entities/DropNote.js";

let div;
let container;
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
const exampleDrop = new DropNote("candyi #apple", "user");
exampleDrop.hashtags = ["#apple"];
exampleDrop.key = "syrup";
exampleDrop._id = "syrup";

const drops = [
    exampleDrop
];

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

describe("handles deleteDrop correctly", () => {
    describe("status messages", () => {
        it("pushes the COPY.DELETE_DROP_STATUS status if deleting drop from backend has been confirmed and is now being attempted", () => {
            const pushNewStatusMessage = jest.fn();

            store.dispatch(UPDATE_DROPS(drops));

            act(() => {
                ({ container } = renderWithOptions({
                    pushNewStatusMessage : pushNewStatusMessage,
                    appConfirm : () => true
                }));
            });
            const deleteButton = $(".drop-search", container).find(".del-button").get(0);
            pushNewStatusMessage.mockClear();
            act(() => {
                fireEvent.click(deleteButton);
            });
            expect(pushNewStatusMessage.mock.calls[0][0]).toBe(COPY.DELETE_DROP_STATUS);
        });

        it("pushes the COPY.SERVER_RESPONSE_ERROR status if deleting drop from backend has failed attempt", () => {
            let localObserver = {
                next : noop
            };
            DropBackendService.deleteDrop = (username) => {
                return new Observable((observer) => {
                    localObserver = observer;
                });
            };
            const pushNewStatusMessage = jest.fn();
            store.dispatch(UPDATE_DROPS(drops));
            act(() => {
                ({ container } = renderWithOptions({
                    pushNewStatusMessage : pushNewStatusMessage,
                    appConfirm : () => true
                }));
            });
            const deleteButton = $(".drop-search", container).find(".del-button").get(0);
            act(() => {
                fireEvent.click(deleteButton);
            });
            pushNewStatusMessage.mockClear();
            localObserver.next({
                status : "FAILED_ATTEMPT"
            });
            expect(pushNewStatusMessage.mock.calls[0][0]).toBe(COPY.SERVER_RESPONSE_ERROR);
        });
        it("pushes the COPY.DROP_WAS_DELETED status if deleting drop from backend succeeds", () => {
            let localObserver = {
                next : noop
            };
            DropBackendService.deleteDrop = (username) => {
                return new Observable((observer) => {
                    localObserver = observer;
                });
            };
            const pushNewStatusMessage = jest.fn();
            store.dispatch(UPDATE_DROPS(drops));
            act(() => {
                ({ container } = renderWithOptions({
                    pushNewStatusMessage : pushNewStatusMessage,
                    appConfirm : () => true
                }));
            });
            const deleteButton = $(".drop-search", container).find(".del-button").get(0);
            act(() => {
                fireEvent.click(deleteButton);
            });
            pushNewStatusMessage.mockClear();
            localObserver.next({
                status : "SUCCESS"
            });
            expect(pushNewStatusMessage.mock.calls[0][0]).toBe(COPY.DROP_WAS_DELETED);
        });
        it("pushes the COPY.DELETE_DROP_FAILED status if deleting drop from backend fails", () => {
            let localObserver = {
                next : noop
            };
            DropBackendService.deleteDrop = (username) => {
                return new Observable((observer) => {
                    localObserver = observer;
                });
            };
            const pushNewStatusMessage = jest.fn();
            store.dispatch(UPDATE_DROPS(drops));
            act(() => {
                ({ container } = renderWithOptions({
                    pushNewStatusMessage : pushNewStatusMessage,
                    appConfirm : () => true
                }));
            });
            const deleteButton = $(".drop-search", container).find(".del-button").get(0);
            act(() => {
                fireEvent.click(deleteButton);
            });
            pushNewStatusMessage.mockClear();
            act(() => {
                localObserver.next({
                    status : "FAIL"
                });
            });
            expect(pushNewStatusMessage.mock.calls[0][0]).toBe(COPY.DELETE_DROP_FAILED);
        });
    });

    test('calls DropBackendService.deleteDrop if user clicks delete and confirms', (done) => {
        const drops = [
            exampleDrop
        ];
        store.dispatch(UPDATE_DROPS(drops));
        DropBackendService.deleteDrop = (id) => {
            expect(id).toBe("syrup");
            return new Observable((observer) => {
                done();
            });
        };
        act(() => {
            ({ container } = renderWithOptions({
                appConfirm : () => true
            }));
        });
        const deleteButton = $(".drop-search", container).find(".del-button").get(0);
        act(() => {
            fireEvent.click(deleteButton);
        });
    });

    test('does not call DropBackendService.deleteDrop if user clicks drop and cancels', (done) => {
        const drops = [
            exampleDrop
        ];
        store.dispatch(UPDATE_DROPS(drops));
        DropBackendService.deleteDrop = (id) => {
            expect(false).toBe(true);
            done();
            return new Observable((observer) => {
                done();
            });
        };
        act(() => {
            ({ container } = renderWithOptions({
                appConfirm : () => false
            }));
        });
        const deleteButton = $(".drop-search", container).find(".del-button").get(0);
        act(() => {
            fireEvent.click(deleteButton);
        });
        done();
    });

    test('calls setFatalError if DropBackendService.deleteDrop returns status "FAIL"', (done) => {
        let localObserver = {
            next : noop
        };
        const setFatalError = () => {
            done();
        };
        store.dispatch(UPDATE_DROPS(drops));
        DropBackendService.deleteDrop = (id) => {
            expect(id).toBe("syrup");
            return new Observable((observer) => {
                localObserver = observer;
            });
        };
        act(() => {
            ({ container } = renderWithOptions({
                setFatalError : setFatalError,
                appConfirm : () => true
            }));
        });
        const deleteButton = $(".drop-search", container).find(".del-button").get(0);
        act(() => {
            fireEvent.click(deleteButton);
        });
        act(() => {
            localObserver.next({
                status : "FAIL"
            });
        });
    });

    test('calls deleteDropFailed if failed to delete drop', (done) => {
        let localObserver = {
            next : noop
        };
        const deleteDropFailed = (drop) => {
            done();
        };

        store.dispatch(UPDATE_DROPS(drops));
        DropBackendService.deleteDrop = (id) => {
            expect(id).toBe("syrup");
            return new Observable((observer) => {
                localObserver = observer;
            });
        };
        act(() => {
            ({ container } = renderWithOptions({
                appConfirm : () => true,
                deleteDropFailed : deleteDropFailed
            }));
        });
        const deleteButton = $(".drop-search", container).find(".del-button").get(0);
        act(() => {
            fireEvent.click(deleteButton);
        });
        act(() => {
            localObserver.next({
                status : "FAIL"
            });
        });
    });

    test('deletes drop in display on "delete" action and puts it back if delete failed', (done) => {
        const setFatalError = () => {
            done();
        };
        store.dispatch(UPDATE_DROPS(drops));
        expect(store.getState().drops).toHaveLength(1);
        let localObserver;
        DropBackendService.deleteDrop = (id) => {
            expect(id).toBe("syrup");
            return new Observable((observer) => {
                localObserver = observer;
            });
        };
        act(() => {
            ({ container } = renderWithOptions({
                appConfirm : () => true,
                setFatalError : setFatalError
            }));
        });
        const deleteButton = $(".drop-search", container).find(".del-button").get(0);
        act(() => {
            fireEvent.click(deleteButton);
        });
        expect(store.getState().drops).toHaveLength(0);
        act(() => {
            localObserver.next({
                status : "FAIL"
            });
        });
        expect(store.getState().drops).toHaveLength(1);
    });

    it("calls appConfirm with COPY.CONFIRM_DELETE_DROP if user clicks delete button", () => {
        const appConfirm = jest.fn();
        DropBackendService.deleteDrop = (username) => {
            return new Observable((observer) => {
            });
        };
        const pushNewStatusMessage = jest.fn();
        store.dispatch(UPDATE_DROPS(drops));
        act(() => {
            ({ container } = renderWithOptions({
                pushNewStatusMessage : pushNewStatusMessage,
                appConfirm : appConfirm
            }));
        });
        const deleteButton = $(".drop-search", container).find(".del-button").get(0);
        act(() => {
            fireEvent.click(deleteButton);
        });
        expect(appConfirm.mock.calls[0][0]).toBe(COPY.CONFIRM_DELETE_DROP);
    });
});
