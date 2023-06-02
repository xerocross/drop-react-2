import React from "react";
import { cleanup, fireEvent, render, act } from '@testing-library/react';
import FailedToSave from "./FailedToSave.jsx";
import $ from "jquery";
import { noop, exampleDrops2, exampleDrops6 } from "../testing-helpers.js";

let div;
let getByTestId;
let queryByTestId;
let container;

beforeEach(() => {
    div = document.createElement('div');
})

afterEach(() => {
    cleanup();
});

function renderWithOptions (config) {
    return render(<FailedToSave
        drops = {config.drops || []}
        tryAgainSave = {config.tryAgainSave || noop}
        isSyncing = {config.isSyncing || false}
    />, div);
}

it('renders without crashing', () => {
    ({ getByTestId } = renderWithOptions({}));
});

it('renders DropList if there are drops', () => {
    ({ getByTestId, queryByTestId } = renderWithOptions({
        drops : exampleDrops2
    }));
    const elt = queryByTestId("drop-list");
    expect(elt).toBeTruthy();
});

it('renders DropList with correct number of drops (6)', () => {
    ({ getByTestId, queryByTestId } = renderWithOptions({
        drops : exampleDrops6
    }));
    const elt = queryByTestId("drop-list");
    const dropitems = $(".drop-row", elt)
    expect(dropitems).toHaveLength(6);
});

it('calls tryAgainSave if user clicks try again button', () => {
    const tryAgainSave = jest.fn();
    ({ getByTestId, queryByTestId } = renderWithOptions({
        tryAgainSave : tryAgainSave
    }));
    const button = getByTestId("try-again-button");
    fireEvent.click(button);
    expect(tryAgainSave.mock.calls).toHaveLength(1);
});
