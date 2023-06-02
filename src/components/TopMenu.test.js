import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import $ from "jquery";
import Store from "../store.js";
import { Provider } from "react-redux";
import { POST_USERNAME_SET, UNSET_USERNAME, LOGOUT } from "../actions.js";
import TopMenu from "./TopMenu";
import LoginHelper from "../helpers/LoginHelper.js";

jest.mock("../helpers/LoginHelper.js");

jest.mock("../actions.js", () => ({
    default : 'mockedDefaultExport',
    LOGOUT : jest.fn()
}));

let getByTestId, queryByTestId;
let store;
const noop = () => {};
let div;

let DropBackendService;

beforeEach(() => {
    store = Store();
    div = document.createElement('div');
})

afterEach(() => {
    cleanup();
});

function renderWithOptions (config) {
    return render(<Provider store={store}><TopMenu
    /></ Provider>, div);
}

describe("if user is logged in", () => {
    it("it shows the logout button", () => {
        store.dispatch = jest.fn(store.dispatch);
        ({ getByTestId, queryByTestId } = renderWithOptions({}));
        const logoutButton = queryByTestId("logout-button");
        expect(logoutButton).toBeTruthy();
    });
    describe("when user clicks logout button", () => {
        it("dispatches LOGOUT thunk", () => {
            LOGOUT.mockReturnValueOnce({
                type : "LOGOUT"
            });
            store.dispatch = jest.fn(store.dispatch);
            LoginHelper.unsetLocalUsername = jest.fn();
            ({ getByTestId } = renderWithOptions({}));
            const logoutButton = getByTestId("logout-button");
            fireEvent.click(logoutButton);
            const calls = LOGOUT.mock.calls;
            expect(calls).toHaveLength(1);
        });
    });
});
