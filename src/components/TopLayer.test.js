import React from 'react';
import { cleanup, fireEvent, render, act } from '@testing-library/react';
import $ from "jquery";
import Store from "../store.js";
import { Provider } from "react-redux";
import { NEW_DROPTEXT, UPDATE_DROPS, POST_USERNAME_SET, UNSET_USERNAME } from "../actions.js";
import TopLayer from "./TopLayer.jsx";
import LoginHelper from "../helpers/LoginHelper.js";
import DropBackendService from "../services/DropBackendService.js";
import Observable from "../helpers/Observable.js";

jest.mock('../services/DropBackendService.js');
jest.mock('../helpers/LoginHelper.js');

let div;
let getByTestId, queryByTestId;
let container;
let store;

const noop = () => {};
const drops = [];
const droptext = "test";
const drops_nonempty = [
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

const exampleData = () => {
    return [
        {
            text : "candy #apple",
            hashtags : ["#apple"],
            key : "0"
        }
    ];
};

beforeEach(() => {
    store = Store();
    div = document.createElement('div');
});

afterEach(() => {
    cleanup();
});

function renderWithOptions (config) {
    return ({ getByTestId } = render(<Provider store={store}><TopLayer /></Provider>, div));
}

it('renders without crashing', () => {
    ({ getByTestId } = renderWithOptions());
});

describe("if user is logged in", () => {
    it("renders TopMenu", () => {
        store.dispatch(POST_USERNAME_SET("adam"));
        DropBackendService.getUserDrops.mockReturnValueOnce(
            new Observable((observer) => {
            }));
        ({ getByTestId, queryByTestId } = renderWithOptions());
        const topMenuElt = queryByTestId("TopMenu");
        expect(topMenuElt).toBeTruthy();
    });
});
describe("if user is not logged in", () => {
    it("does not render TopMenu", () => {
        DropBackendService.getUserDrops.mockReturnValueOnce(
            new Observable((observer) => {
            }));
        ({ getByTestId, queryByTestId } = renderWithOptions());
        const topMenuElt = queryByTestId("TopMenu");
        expect(topMenuElt).toBeFalsy();
    });
});
