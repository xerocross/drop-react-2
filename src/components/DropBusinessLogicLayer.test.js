import React from 'react';
import { cleanup, fireEvent, render, act } from '@testing-library/react';
import DropBusinessLogicLayer from "./DropBusinessLogicLayer.jsx";
import $ from "jquery";
import Store from "../store.js";
import { Provider } from "react-redux";
import { NEW_DROPTEXT, UPDATE_DROPS, ATTEMPT_SAVE_DROP, DROP_FAILED_TO_SAVE } from "../actions.js";
import { exampleDrops6, COPY } from "../testing-helpers.js";

let div;
let getByTestId, queryByTestId;
let container;
let store;

const noop = () => {};
let drops = [];

beforeEach(() => {
    store = Store();
    div = document.createElement('div');
})

afterEach(() => {
    cleanup();
});

function renderWithOptions (config) {
    return render(<Provider store={store}><DropBusinessLogicLayer
        deleteDrop = {config.deleteDrop || noop}
        createDrop = {config.createDrop || noop}
        refreshDrops = {noop}
        updateDrops = {noop}
        username = {config.username || "adam"}
        trySaveUnsavedDrops = {config.trySaveUnsavedDrops || noop}
        appAlert = {config.appAlert || noop}
        appConfirm = {config.appConfirm || noop}
        trySavingFailedDropsAgain = {config.trySavingFailedDropsAgain || noop}
    /></Provider>, div);
}

test('renders without crashing', () => {
    renderWithOptions({});
});

describe("handles FailedToSave", () => {
    it("renders FailedToSave if there are failed drops", () => {
        const drop = exampleDrops6[0];
        store.dispatch(ATTEMPT_SAVE_DROP(drop));
        store.dispatch(DROP_FAILED_TO_SAVE(drop));
        ({ getByTestId, queryByTestId } = renderWithOptions({}));
        const elt = queryByTestId("FailedToSave");
        expect(elt).toBeTruthy();
    });

    it("does not render FailedToSave if there are no failed drops", () => {
        ({ getByTestId, queryByTestId } = renderWithOptions({}));
        const elt = queryByTestId("FailedToSave");
        expect(elt).toBeFalsy();
    });

    it("dispatches TRY_SAVING_FAILED_DROPS_AGAIN if clicks try-again button", (done) => {
        const drop = exampleDrops6[0];
        store.dispatch(ATTEMPT_SAVE_DROP(drop));
        store.dispatch(DROP_FAILED_TO_SAVE(drop));
        store.dispatch = jest.fn(store.dispatch);
        ({ getByTestId, queryByTestId } = renderWithOptions({}));
        store.dispatch.mockClear();
        const tryAgainButton = $(".try-again-button", getByTestId("FailedToSave"))[0];
        fireEvent.click(tryAgainButton);
        const calls = store.dispatch.mock.calls;
        calls.forEach(call => {
            if (call[0].type === "TRY_SAVING_FAILED_DROPS_AGAIN") {
                done();
            }
        });
    });
    it("alerts TRY_SAVE_NOT_IMPLEMENTED alert if clicks try-again button", () => {
        const drop = exampleDrops6[0];
        store.dispatch(ATTEMPT_SAVE_DROP(drop));
        store.dispatch(DROP_FAILED_TO_SAVE(drop));
        const appAlert = jest.fn();
        ({ getByTestId, queryByTestId } = renderWithOptions({
            appAlert : appAlert
        }));
        const tryAgainButton = $(".try-again-button", getByTestId("FailedToSave"))[0];
        fireEvent.click(tryAgainButton);
        expect(appAlert.mock.calls[0][0]).toBe(COPY.TRY_SAVE_NOT_IMPLEMENTED);
    });
    it("calls trySavingFailedDropsAgain if user clicks the FailedToSave try-again button", () => {
        const drop = exampleDrops6[0];
        store.dispatch(ATTEMPT_SAVE_DROP(drop));
        store.dispatch(DROP_FAILED_TO_SAVE(drop));
        const trySavingFailedDropsAgain = jest.fn();
        ({ getByTestId, queryByTestId } = renderWithOptions({
            trySavingFailedDropsAgain : trySavingFailedDropsAgain
        }));
        const tryAgainButton = $(".try-again-button", getByTestId("FailedToSave"))[0];
        fireEvent.click(tryAgainButton);
        expect(trySavingFailedDropsAgain.mock.calls).toHaveLength(1);
    });

    it("disables try-again button on click", () => {
        const drop = exampleDrops6[0];
        store.dispatch(ATTEMPT_SAVE_DROP(drop));
        store.dispatch(DROP_FAILED_TO_SAVE(drop));
        store.dispatch = jest.fn(store.dispatch);
        ({ getByTestId, queryByTestId } = renderWithOptions({}));
        store.dispatch.mockClear();
        const tryAgainButton = $(".try-again-button", getByTestId("FailedToSave"))[0];
        fireEvent.click(tryAgainButton);
        expect($(tryAgainButton).prop('disabled')).toBe(true);
    });
});

describe("handles unsaved drops queue", () => {
    it('renders unsavedDrops if there is one', () => {
        store.dispatch(ATTEMPT_SAVE_DROP(exampleDrops6[0]));
        ({ getByTestId, queryByTestId } = renderWithOptions({}));
        const elt = queryByTestId("unsaved-drops");
        expect(elt).toBeTruthy();
    });

    it('does not render unsavedDrops if there arent any', () => {
        ({ getByTestId, queryByTestId } = renderWithOptions({}));
        const elt = queryByTestId("unsaved-drops");
        expect(elt).toBeFalsy();
    });
});

test('renders MainDumbViewLayer', () => {
    ({ getByTestId, queryByTestId } = renderWithOptions({}));
    const mainDumbViewLayer = queryByTestId("MainDumbViewLayer");
    expect(mainDumbViewLayer).toBeTruthy();
});

describe("handles drop input interaction", () => {
    test('calls createDrop if user clicks drop button and some text is set', (done) => {
        store.dispatch(NEW_DROPTEXT("apple"));
        const createDrop = function () {
            done();
        };
        ({ getByTestId, queryByTestId } = renderWithOptions({
            createDrop : createDrop
        }));
        const dropButton = getByTestId("drop-button");
        fireEvent.click(dropButton);
    });

    it('clears droptext if user clicks drop', () => {
        store.dispatch(NEW_DROPTEXT("apple"));
        store.dispatch = jest.fn(store.dispatch);
        ({ getByTestId, queryByTestId } = renderWithOptions({
        }));
        const dropButton = getByTestId("drop-button");
        fireEvent.click(dropButton);
        const val = $(getByTestId("main-drop-textarea")).val();
        expect(val).toBe("");
    });
    test('clicking drop button triggers alert if text is not set', (done) => {
        const appAlert = function () {
            done();
        };
        store.dispatch = jest.fn(store.dispatch);
        ({ getByTestId, queryByTestId } = renderWithOptions({
            appAlert : appAlert
        }));
        const dropButton = getByTestId("drop-button");
        fireEvent.click(dropButton);
    });
});

describe("handles delete button interaction", () => {
    it('calls appConfirm CONFIRM_DELETE_DROP if clicks delete', () => {
        store.dispatch(UPDATE_DROPS(exampleDrops6));
        const appConfirm = jest.fn();
        ({ getByTestId, queryByTestId } = renderWithOptions({
            appConfirm : appConfirm
        }));

        const dropSearchElt = getByTestId("drop-search");
        const dropRows = $(".drop-row", dropSearchElt);
        const delButtons = dropRows.find(".del-button");
        const firstDelButton = delButtons[0];
        fireEvent.click(firstDelButton);
        const calls = appConfirm.mock.calls;
        expect(calls[0][0]).toBe(COPY.CONFIRM_DELETE_DROP);
    });
    it('calls deleteDrop if user clicks delete (confirmed)', (done) => {
        store.dispatch(UPDATE_DROPS(exampleDrops6));
        const deleteDrop = jest.fn();
        ({ getByTestId, queryByTestId } = renderWithOptions({
            appConfirm : () => true,
            deleteDrop : deleteDrop
        }));
        const dropSearchElt = getByTestId("drop-search");
        const dropRows = $(".drop-row", dropSearchElt);
        const delButtons = dropRows.find(".del-button");
        const firstDelButton = delButtons[0];
        fireEvent.click(firstDelButton);
        setTimeout(() => {
            expect(deleteDrop.mock.calls).toHaveLength(1);
            const call = deleteDrop.mock.calls[0];
            const payload = call[0];
            expect(payload.text).toBe(exampleDrops6[0].text);
            done();
        }, 500);
    });
    it('does not call deleteDrop if user clicks delete, unconfirmed', (done) => {
        store.dispatch(UPDATE_DROPS(exampleDrops6));
        const deleteDrop = jest.fn();
        ({ getByTestId, queryByTestId } = renderWithOptions({
            appConfirm : () => false,
            deleteDrop : deleteDrop
        }));
        const dropSearchElt = getByTestId("drop-search");
        const dropRows = $(".drop-row", dropSearchElt);
        const delButtons = dropRows.find(".del-button");
        const firstDelButton = delButtons[0];
        fireEvent.click(firstDelButton);
        setTimeout(() => {
            expect(deleteDrop.mock.calls).toHaveLength(0);
            done();
        }, 500);
    });
});

describe("handles hashtag/drop intersection as expected", () => {
    describe("if searching drops without explicit hash marks", () => {
        it('shows one matching drop with substring', () => {
            drops = [
                {
                    text : "candy apple",
                    hashtags : [],
                    key : "0"
                },
                {
                    text : "candy pear",
                    hashtags : [],
                    key : "1"
                },
                {
                    text : "candy #watermelon",
                    hashtags : ["#watermelon"],
                    key : "2"
                }
            ];
            store.dispatch(UPDATE_DROPS(drops));
            store.dispatch(NEW_DROPTEXT("#pear"));
            ({ getByTestId, queryByTestId } = renderWithOptions({
            }));
            const dropSearchElt = getByTestId("drop-search");
            const dropRows = $(".drop-row", dropSearchElt);
            expect(dropRows).toHaveLength(1);
            const elt = dropRows.eq(0);
            expect(elt.attr("data-dropkey")).toBe(drops[1].key);
        });
        it('shows two matching drop with substring', () => {
            drops = [
                {
                    text : "candy apple",
                    hashtags : [],
                    key : "0"
                },
                {
                    text : "#candy pear",
                    hashtags : [],
                    key : "1"
                },
                {
                    text : "#watermelon",
                    hashtags : ["#watermelon"],
                    key : "2"
                }
            ];
            store.dispatch(UPDATE_DROPS(drops));
            store.dispatch(NEW_DROPTEXT("#candy"));
            ({ getByTestId, queryByTestId } = renderWithOptions({
            }));
            const dropSearchElt = getByTestId("drop-search");
            const dropRows = $(".drop-row", dropSearchElt);
            expect(dropRows).toHaveLength(2);
            expect(dropRows.eq(0).attr("data-dropkey")).toBe(drops[0].key);
            expect(dropRows.eq(1).attr("data-dropkey")).toBe(drops[1].key);
        });
    });

    it('shows only drops matching one hashtag (1)', () => {
        drops = [
            {
                text : "candy #apple",
                hashtags : ["#apple"],
                key : "0"
            },
            {
                text : "candy #pear",
                hashtags : ["#pear"],
                key : "1"
            },
            {
                text : "candy #watermelon",
                hashtags : ["#watermelon"],
                key : "2"
            }
        ];
        store.dispatch(UPDATE_DROPS(drops));
        store.dispatch(NEW_DROPTEXT("this is a #pear test string"));
        ({ getByTestId, queryByTestId } = renderWithOptions({
        }));
        const dropSearchElt = getByTestId("drop-search");
        const dropRows = $(".drop-row", dropSearchElt);
        expect(dropRows).toHaveLength(1);
        const elt = dropRows.eq(0);
        expect(elt.attr("data-dropkey")).toBe(drops[1].key);
    });

    it('shows only drops matching two hashtags', () => {
        drops = [
            {
                text : "candy #apple",
                hashtags : ["#apple"],
                key : "0"
            },
            {
                text : "candy #pear #apple",
                hashtags : ["#pear", "#apple"],
                key : "both"
            },
            {
                text : "candy #pear #watermelon",
                hashtags : ["#watermelon", "#pear"],
                key : "2"
            }
        ];
        store.dispatch(UPDATE_DROPS(drops));
        store.dispatch(NEW_DROPTEXT("this is a #pear test #apple"));
        ({ getByTestId, queryByTestId } = renderWithOptions({
        }));
        const dropSearchElt = getByTestId("drop-search");
        const dropRows = $(".drop-row", dropSearchElt);
        expect(dropRows).toHaveLength(1);
        const elt = dropRows.eq(0);
        expect(elt.attr("data-dropkey")).toBe(drops[1].key);
    });

    it("shows only drops matching one hashtag (2)", () => {
        drops = [
            {
                text : "candy #apple",
                hashtags : ["#apple"],
                key : "apple"
            },
            {
                text : "candy #pear #apple",
                hashtags : ["#pear", "#apple"],
                key : "both"
            },
            {
                text : "candy #pear #watermelon",
                hashtags : ["#watermelon", "#pear"],
                key : "neither"
            }
        ];
        const droptext = "this is a test #apple";
        store.dispatch(UPDATE_DROPS(drops));
        store.dispatch(NEW_DROPTEXT(droptext));
        ({ getByTestId, queryByTestId } = renderWithOptions({
        }));
        const dropSearchElt = getByTestId("drop-search");
        const dropRows = $(".drop-row", dropSearchElt);
        expect(dropRows).toHaveLength(2);
        expect(dropRows.eq(0).attr("data-dropkey")).toBe(drops[0].key);
        expect(dropRows.eq(1).attr("data-dropkey")).toBe(drops[1].key);
    });

    it("shows alls drops if text string has no hashtags", () => {
        drops = [
            {
                text : "candy #apple",
                hashtags : ["#apple"],
                key : "apple"
            },
            {
                text : "candy #pear #apple",
                hashtags : ["#pear", "#apple"],
                key : "both"
            },
            {
                text : "candy #pear #watermelon",
                hashtags : ["#watermelon", "#pear"],
                key : "neither"
            }
        ];
        const droptext = "this is a test apple";
        store.dispatch(UPDATE_DROPS(drops));
        store.dispatch(NEW_DROPTEXT(droptext));
        ({ getByTestId, queryByTestId } = renderWithOptions({
        }));
        const dropSearchElt = getByTestId("drop-search");
        const dropRows = $(".drop-row", dropSearchElt);
        expect(dropRows).toHaveLength(3);
    });

    it("shows alls drops if text string is empty", () => {
        drops = [
            {
                text : "candy #apple",
                hashtags : ["#apple"],
                key : "apple"
            },
            {
                text : "candy #pear #apple",
                hashtags : ["#pear", "#apple"],
                key : "both"
            },
            {
                text : "candy #pear #watermelon",
                hashtags : ["#watermelon", "#pear"],
                key : "neither"
            }
        ];
        const droptext = "";
        store.dispatch(UPDATE_DROPS(drops));
        store.dispatch(NEW_DROPTEXT(droptext));
        ({ getByTestId, queryByTestId } = renderWithOptions({
        }));
        const dropSearchElt = getByTestId("drop-search");
        const dropRows = $(".drop-row", dropSearchElt);
        expect(dropRows).toHaveLength(3);
    });

    it("shows no drops if no drops in intersection", () => {
        drops = [
            {
                text : "candy #apple",
                hashtags : ["#apple"],
                key : "0"
            },
            {
                text : "candy #pear #apple",
                hashtags : ["#pear", "#apple"],
                key : "1"
            },
            {
                text : "candy #watermelon",
                hashtags : ["#watermelon"],
                key : "2"
            }
        ];
        const droptext = "this is a test #pear and #watermelon";
        store.dispatch(UPDATE_DROPS(drops));
        store.dispatch(NEW_DROPTEXT(droptext));
        ({ getByTestId, queryByTestId } = renderWithOptions({
        }));
        const dropSearchElt = getByTestId("drop-search");
        const dropRows = $(".drop-row", dropSearchElt);
        expect(dropRows).toHaveLength(0);
    });
});
