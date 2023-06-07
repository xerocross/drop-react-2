import React from "react";
import { cleanup, render, act } from '@testing-library/react';
import UnsavedDrops from "./UnsavedDrops.jsx";
import $ from "jquery";
import { drop1, drop2, drop3, drop4, drop5, drop6 } from "../testing-helpers.js";

let div;
let getByTestId;
let queryByTestId;
let trySaveUnsavedDrops;

const setProps = () => {
};
let unsavedDrops = [];

beforeEach(() => {
    setProps();
    div = document.createElement('div');
});

afterEach(() => {
    cleanup();
});

test('renders without crashing', () => {
    expect(() => {
        render(<UnsavedDrops
            unsavedDrops = {unsavedDrops}
            trySaveUnsavedDrops = {trySaveUnsavedDrops}
        />, div);
    }).not.toThrow();
});

test('renders DropList', () => {
    act(() => {
        ({ getByTestId, queryByTestId } = render(<UnsavedDrops
            unsavedDrops = {unsavedDrops}
            trySaveUnsavedDrops = {trySaveUnsavedDrops}
        />, div));
    });
    const elt = queryByTestId("drop-list");
    expect(elt).toBeTruthy();
});

test('renders DropList with correct number of drops (2)', () => {
    unsavedDrops = [
        drop1,
        drop2
    ];
    act(() => {
        ({ queryByTestId } = render(<UnsavedDrops
            unsavedDrops = {unsavedDrops}
            trySaveUnsavedDrops = {trySaveUnsavedDrops}
        />, div));
    });
    const elt = queryByTestId("drop-list");
    const dropitems = $(".drop-row", elt);
    expect(dropitems).toHaveLength(2);
});

test('renders DropList with correct number of drops (6)', () => {
    unsavedDrops = [
        drop1,
        drop2,
        drop3,
        drop4,
        drop5,
        drop6
    ];
    act(() => {
        ({ queryByTestId } = render(<UnsavedDrops
            unsavedDrops = {unsavedDrops}
            trySaveUnsavedDrops = {trySaveUnsavedDrops}
        />, div));
    });
    const elt = queryByTestId("drop-list");
    const dropitems = $(".drop-row", elt);
    expect(dropitems).toHaveLength(6);
});
