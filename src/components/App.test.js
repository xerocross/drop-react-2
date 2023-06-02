import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import App from "./App.jsx";
import DropBackendService from "../helpers/DropBackendService.js";
import Observable from "../helpers/Observable.js";
import LoginHelper from "../helpers/LoginHelper.js";
import $ from "jquery";
import DropNote from "../entities/DropNote.js"

jest.mock('../helpers/DropBackendService.js');
jest.mock('../helpers/LoginHelper.js');

let div;
let getByTestId, queryByTestId;

beforeEach(() => {
    div = document.createElement('div');
})

afterEach(() => {
    cleanup();
    LoginHelper.setLocalUsername.mockReset();
});

test('renders without crashing, no local username', () => {
    ({ getByTestId } = render(<App />, div));
});

const exampleData = () => {
    const drop = new DropNote("candy #apple", "adam");
    drop.hashtags = ["#apple"];
    drop.key = 0;
    return [drop];
}

test('renders without crashing if username in local storage', () => {
    LoginHelper.tryToGetUsernameFromStorage.mockReturnValueOnce("adam");
    DropBackendService.getUserDrops.mockReturnValueOnce(
        new Observable((observer) => {
            observer.next({
                status : "SUCCESS",
                data : exampleData()
            });
        }));
    ({ getByTestId } = render(<App />, div));
});

it('displays status messages visibly', () => {
    LoginHelper.tryToGetUsernameFromStorage.mockReturnValueOnce("adam");
    DropBackendService.getUserDrops.mockReturnValueOnce(
        new Observable((observer) => {
            observer.next({
                status : "SUCCESS",
                data : exampleData()
            });
        })
    );
    ({ getByTestId } = render(<App />, div));
    const StatusBar = getByTestId("StatusBar");
    const statusRows = $(".statusItem", StatusBar);
    const len = statusRows.length;
    expect(len).toBeGreaterThan(0);
});

describe("renders MainDumbViewLayer with data if username is set", () => {
    test('renders MainDumbViewLayer if username in local storage', () => {
        LoginHelper.tryToGetUsernameFromStorage.mockReturnValueOnce("adam");
        DropBackendService.getUserDrops.mockReturnValueOnce(
            new Observable((observer) => {
                observer.next({
                    status : "SUCCESS",
                    data : []
                });
            }));
        ({ getByTestId, queryByTestId } = render(<App />, div));
        const MainDumbViewLayer = queryByTestId("MainDumbViewLayer");
        expect(MainDumbViewLayer).toBeTruthy();
    });

    test('renders MainDumbViewLayer with data if username in local storage ', () => {
        LoginHelper.tryToGetUsernameFromStorage.mockReturnValueOnce("adam");
        DropBackendService.getUserDrops.mockReturnValueOnce(
            new Observable((observer) => {
                observer.next({
                    status : "SUCCESS",
                    data : exampleData()
                });
            }));
        ({ getByTestId, queryByTestId } = render(<App />, div));
        const DropSearchElt = queryByTestId("drop-search");
        const dropItems = $(".drop-item", DropSearchElt);
        expect(dropItems).toHaveLength(1);
    });
});

describe("handles fresh login situation", () => {
    it("renders username form if no local username found", () => {
        LoginHelper.tryToGetUsernameFromStorage.mockReturnValueOnce(undefined);
        ({ getByTestId, queryByTestId } = render(<App />, div));
        const usernameInput = queryByTestId("username-input");
        expect(usernameInput).toBeTruthy();
    });
    it("updates username in storage upon login", () => {
        LoginHelper.tryToGetUsernameFromStorage.mockReturnValueOnce(undefined);
        DropBackendService.getUserDrops.mockReturnValueOnce(
            new Observable((observer) => {
                observer.next({
                    status : "SUCCESS",
                    data : exampleData()
                });
            }));
        ({ getByTestId, queryByTestId } = render(<App />, div));
        const usernameInput = getByTestId("username-input");
        const loginDoneButton = getByTestId("login-done-button");

        fireEvent.change(usernameInput, { target : { value : "adam" } });
        fireEvent.click(loginDoneButton);
        expect(LoginHelper.setLocalUsername.mock.calls.length).toBe(1);
    });
    it("queries for data when user logs in", (done) => {
        LoginHelper.tryToGetUsernameFromStorage.mockReturnValueOnce(undefined);
        DropBackendService.getUserDrops.mockReturnValueOnce(
            new Observable((observer) => {
                done();
                observer.next({
                    status : "SUCCESS",
                    data : exampleData()
                });
            })
        );
        ({ getByTestId, queryByTestId } = render(<App />, div));
        const usernameInput = getByTestId("username-input");
        const loginDoneButton = getByTestId("login-done-button");
        fireEvent.change(usernameInput, { target : { value : "adam" } });
        fireEvent.click(loginDoneButton);
    });
});
