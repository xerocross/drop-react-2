import React from 'react';
import { cleanup, render } from '@testing-library/react';
import App from "./components/App.jsx";
import DropBackendService from "./helpers/DropBackendService.js";
import Observable from "./helpers/Observable.js";
import LoginHelper from "./helpers/LoginHelper.js";
import $ from "jquery";

jest.mock('../helpers/DropBackendService.js');
jest.mock('../helpers/LoginHelper.js');

let div;

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
    return [
        {
            text : "candy #apple",
            hashtags : ["#apple"],
            key : "0"
        }
    ];
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
