import React from 'react';
import { cleanup, fireEvent, render, act } from '@testing-library/react';
import BackendCommunicationLayer from "./BackendCommunicationLayer.jsx";
import Observable from "../helpers/Observable";
import $ from "jquery";
import Store from "../store.js";
import { Provider } from "react-redux";
import { NEW_DROPTEXT } from "../actions.js";
import COPY from "../configuration/messages-copy.js";

let div;
let getByTestId;
const droptext = "apple #candy";
let store;
let queryByTestId;

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

describe("handles saveNewDrop correctly", () => {
    describe("communication with DropBackendService", () => {
        it('calls DropBackendService.saveNewDrop if text is set and user clicks "drop" button', (done) => {
            DropBackendService.saveNewDrop = (drop) => {
                return new Observable((observer) => {
                    done();
                });
            };
            act(() => {
                store.dispatch(NEW_DROPTEXT(droptext));
            });
            act(() => {
                ({ getByTestId } = renderWithOptions({}));
            });
            const dropButton = getByTestId("drop-button");
            act(() => {
                fireEvent.click(dropButton);
            });
        });
        it('passes droptext into saveNewDrop function', (done) => {
            DropBackendService.saveNewDrop = (drop) => {
                expect(drop.text).toBe("apple #candy");
                return new Observable((observer) => {
                    done();
                });
            };
            store.dispatch(NEW_DROPTEXT(droptext));
            act(() => {
                ({ getByTestId } = renderWithOptions({}));
            });
            const dropButton = getByTestId("drop-button");
            act(() => {
                fireEvent.click(dropButton);
            });
        });
        test('passes current username into saveNewDrop as .username', (done) => {
            const testname = "adamzap";
            DropBackendService.saveNewDrop = (drop) => {
                expect(drop.username).toBe(testname);
                return new Observable((observer) => {
                    done();
                });
            };
            store.dispatch(NEW_DROPTEXT(droptext));
            act(() => {
                ({ getByTestId } = renderWithOptions({
                    username : testname
                }));
            });
            const dropButton = getByTestId("drop-button");
            act(() => {
                fireEvent.click(dropButton);
            });
        });
    });

    describe("attempting...", () => {
        it("dispatches ATTEMPT_SAVE_DROP with drop payload when it begins attempting to save a new drop to backend", (done) => {
            store.dispatch(NEW_DROPTEXT(droptext));
            store.dispatch = jest.fn(store.dispatch);
            act(() => {
                ({ getByTestId } = renderWithOptions({
                }));
            });
            const dropButton = getByTestId("drop-button");
            store.dispatch.mockClear();
            act(() => {
                fireEvent.click(dropButton);
            });
            const calls = store.dispatch.mock.calls;
            calls.forEach(call => {
                if (call[0].type === "ATTEMPT_SAVE_DROP") {
                    expect(call[0].payload.text).toBe(droptext);
                    done();
                }
            });
        });
        it("pushes SENDING_DROP status when attempting to save drop", () => {
            const pushNewStatusMessage = jest.fn();
            store.dispatch(NEW_DROPTEXT(droptext));
            act(() => {
                ({ getByTestId } = renderWithOptions({
                    pushNewStatusMessage : pushNewStatusMessage
                }));
            });
            const dropButton = getByTestId("drop-button");
            pushNewStatusMessage.mockClear();
            act(() => {
                fireEvent.click(dropButton);
            });
            expect(pushNewStatusMessage.mock.calls[0][0]).toBe(COPY.SENDING_DROP);
        });
        it("adds drop to 'unsavedDrops' when user clicks to save new drop", () => {
            store.dispatch(NEW_DROPTEXT(droptext));
            act(() => {
                ({ getByTestId } = renderWithOptions({
                }));
            });
            const dropButton = getByTestId("drop-button");
            act(() => {
                fireEvent.click(dropButton);
            });
            const unsavedDropsElt = getByTestId("unsaved-drops");
            const unsavedDropsList = $(".drop-row", unsavedDropsElt);
            expect(unsavedDropsList).toHaveLength(1);
        });
        it("does not immediately add new drop to 'drops' when user clicks to save new drop", () => {
            DropBackendService.saveNewDrop = (username) => {
                return new Observable((observer) => {
                });
            };
            store.dispatch(NEW_DROPTEXT(droptext));
            act(() => {
                ({ getByTestId } = renderWithOptions({
                }));
            });
            const dropButton = getByTestId("drop-button");
            act(() => {
                fireEvent.click(dropButton);
            });
            const dropsearchElt = getByTestId("drop-search");
            const dropList = $(".drop-row", dropsearchElt);
            expect(dropList).toHaveLength(0);
        });
        it("pushes the SERVER_RESPONSE_ERROR status if create a drop on the server has a failed attempt", () => {
            let localObserver;
            DropBackendService.saveNewDrop = (username) => {
                return new Observable((observer) => {
                    localObserver = observer;
                });
            };
            const pushNewStatusMessage = jest.fn();
            store.dispatch(NEW_DROPTEXT(droptext));
            act(() => {
                ({ getByTestId } = renderWithOptions({
                    pushNewStatusMessage : pushNewStatusMessage
                }));
            });
            const dropButton = getByTestId("drop-button");
            act(() => {
                fireEvent.click(dropButton);
            });
            pushNewStatusMessage.mockClear();
            localObserver.next({
                status : "FAILED_ATTEMPT"
            });
            expect(pushNewStatusMessage.mock.calls[0][0]).toBe(COPY.SERVER_RESPONSE_ERROR);
        });
    });

    describe("failure...", () => {
        it("dispatches DROP_FAILED_TO_SAVE if a drop save is unsuccessful", (done) => {
            let localObserver;
            DropBackendService.saveNewDrop = (username) => {
                return new Observable((observer) => {
                    localObserver = observer;
                });
            };
            store.dispatch(NEW_DROPTEXT(droptext));
            store.dispatch = jest.fn(store.dispatch);
            act(() => {
                ({ getByTestId } = renderWithOptions({
                }));
            });
            const dropButton = getByTestId("drop-button");
            act(() => {
                fireEvent.click(dropButton);
            });
            store.dispatch.mockClear();
            act(() => {
                localObserver.next({
                    status : "FAIL"
                });
            });
            const calls = store.dispatch.mock.calls;
            calls.forEach(call => {
                if (call[0].type === "DROP_FAILED_TO_SAVE") {
                    expect(call[0].payload.text).toBe(droptext);
                    done();
                }
            });
        });
        it("adds drop to the FailedToSave list if saving fails", () => {
            let localObserver;
            DropBackendService.saveNewDrop = (username) => {
                return new Observable((observer) => {
                    localObserver = observer;
                });
            };
            store.dispatch(NEW_DROPTEXT(droptext));
            act(() => {
                ({ getByTestId, queryByTestId } = renderWithOptions({
                }));
            });
            const dropButton = getByTestId("drop-button");
            act(() => {
                fireEvent.click(dropButton);
            });
            act(() => {
                localObserver.next({
                    status : "FAIL"
                });
            });
            const FailedToSaveElt = queryByTestId("FailedToSave");
            const dropsFailedToSave = $(".drop-row", FailedToSaveElt);
            expect(dropsFailedToSave).toHaveLength(1);
        });
        // Adam Cross (2023): I don't understand the purpose of the
        // following test, so I'm commenting it out for possible
        // further inspection. As specification it seems like
        // nonsense.
        // it("removes drop from the UnsavedDrop list if saving fails", () => {
        //     let localObserver;
        //     DropBackendService.saveNewDrop = (username) => {
        //         return new Observable((observer) => {
        //             localObserver = observer;
        //         })
        //     };
        //     store.dispatch(NEW_DROPTEXT(droptext));
        //     ({ getByTestId, queryByTestId } = renderWithOptions({
        //     }));
        //     const dropButton = getByTestId("drop-button");
        //     fireEvent.click(dropButton);
        //     localObserver.next({
        //         status : "FAIL"
        //     });
        //     const unsavedDropsElt = queryByTestId("unsaved-drops");
        //     expect(unsavedDropsElt).toBeFalsy();
        // });
        it("pushes the POST_DROP_FAILED status if create a drop on the server fails", () => {
            let localObserver;
            DropBackendService.saveNewDrop = (username) => {
                return new Observable((observer) => {
                    localObserver = observer;
                });
            };
            const pushNewStatusMessage = jest.fn();
            store.dispatch(NEW_DROPTEXT(droptext));
            act(() => {
                ({ getByTestId } = renderWithOptions({
                    pushNewStatusMessage : pushNewStatusMessage
                }));
            });
            const dropButton = getByTestId("drop-button");
            act(() => {
                fireEvent.click(dropButton);
            });
            pushNewStatusMessage.mockClear();
            act(() => {
                localObserver.next({
                    status : "FAIL"
                });
            });
            expect(pushNewStatusMessage.mock.calls[0][0]).toBe(COPY.POST_DROP_FAILED);
        });
        test('calls setFatalError on failure', () => {
            const setFatalError = jest.fn();
            DropBackendService.saveNewDrop = (username) => {
                return new Observable((observer) => {
                    observer.next({
                        status : "FAIL"
                    });
                });
            };
            store.dispatch(NEW_DROPTEXT(droptext));
            act(() => {
                ({ getByTestId } = renderWithOptions({
                    setFatalError : setFatalError
                }));
            });
            const dropButton = getByTestId("drop-button");
            act(() => {
                fireEvent.click(dropButton);
            });
            expect(setFatalError.mock.calls).toHaveLength(1);
        });
    });

    describe("success...", () => {
        it("dispatches DROP_SUCCESSFULLY_SAVED if a drop is saved successfully", () => {
            let localObserver;
            DropBackendService.saveNewDrop = (username) => {
                return new Observable((observer) => {
                    localObserver = observer;
                });
            };
            store.dispatch(NEW_DROPTEXT(droptext));
            store.dispatch = jest.fn(store.dispatch);
            act(() => {
                ({ getByTestId } = renderWithOptions({
                }));
            });
            const dropButton = getByTestId("drop-button");
            act(() => {
                fireEvent.click(dropButton);
            });
            store.dispatch.mockClear();
            act(() => {
                localObserver.next({
                    status : "SUCCESS"
                });
            });
            expect(store.dispatch.mock.calls[0][0].type).toBe("DROP_SUCCESSFULLY_SAVED");
        });
        it("DROP_SUCCESSFULLY_SAVED receives the drop as payload", () => {
            let localObserver;
            DropBackendService.saveNewDrop = (username) => {
                return new Observable((observer) => {
                    localObserver = observer;
                });
            };
            store.dispatch(NEW_DROPTEXT(droptext));
            store.dispatch = jest.fn(store.dispatch);
            act(() => {
                ({ getByTestId } = renderWithOptions({
                }));
            });
            const dropButton = getByTestId("drop-button");
            act(() => {
                fireEvent.click(dropButton);
            });
            store.dispatch.mockClear();
            act(() => {
                localObserver.next({
                    status : "SUCCESS"
                });
            });
            const payload = store.dispatch.mock.calls[0][0].payload;
            expect(payload.text).toBe(droptext);
        });
        it("adds drop to list of 'drops' if drop is saved successfully", async () => {
            let localObserver;
            DropBackendService.saveNewDrop = (username) => {
                return new Observable((observer) => {
                    localObserver = observer;
                });
            };
            store.dispatch(NEW_DROPTEXT(droptext));
            act(() => {
                ({ getByTestId } = renderWithOptions({
                }));
            });
            const dropButton = getByTestId("drop-button");
            await act(async () => {
                fireEvent.click(dropButton);
            });
            const dropsearchElt = getByTestId("drop-search");
            let dropList;
            dropList = $(".drop-row", dropsearchElt);
            expect(dropList).toHaveLength(0);
            await act(() => {
                localObserver.next({
                    status : "SUCCESS"
                });
            });
            dropList = $(".drop-row", dropsearchElt);
            expect(dropList).toHaveLength(1);
        });
        it("removes drop from unsavedDrops list if drop is saved successfully", async () => {
            let localObserver;
            DropBackendService.saveNewDrop = (username) => {
                return new Observable((observer) => {
                    localObserver = observer;
                });
            };
            store.dispatch(NEW_DROPTEXT(droptext));
            act(() => {
                ({ getByTestId, queryByTestId } = renderWithOptions({
                }));
            });
            const dropButton = getByTestId("drop-button");
            await act(() => {
                fireEvent.click(dropButton);
            });
            await act(() => {
                localObserver.next({
                    status : "SUCCESS"
                });
            });
            const unsavedDropsElt = queryByTestId("unsaved-drops");
            expect(unsavedDropsElt).toBeFalsy();
        });
        it("pushes the DROP_SAVED_SUCCESS status if create a drop on the server succeeds", () => {
            let localObserver;
            DropBackendService.saveNewDrop = (username) => {
                return new Observable((observer) => {
                    localObserver = observer;
                });
            };
            const pushNewStatusMessage = jest.fn();
            store.dispatch(NEW_DROPTEXT(droptext));
            act(() => {
                ({ getByTestId } = renderWithOptions({
                    pushNewStatusMessage : pushNewStatusMessage
                }));
            });
            const dropButton = getByTestId("drop-button");
            act(() => {
                fireEvent.click(dropButton);
            });
            pushNewStatusMessage.mockClear();
            act(() => {
                localObserver.next({
                    status : "SUCCESS"
                });
            });
            expect(pushNewStatusMessage.mock.calls[0][0]).toBe(COPY.DROP_SAVED_SUCCESS);
        });
    });
});
