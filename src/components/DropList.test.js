import React from 'react';
import ReactDOM from 'react-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import DropList from "./DropList.jsx";
import $ from "jquery";
import DropNote from "../entities/DropNote.js";

let div;
let container;
afterEach(cleanup)

let getByTestId;
const noop = () => {};
const setProps = () => {
};

beforeEach(() => {
    setProps();
    div = document.createElement('div');
})

afterEach(() => {
    cleanup();
});

const exampleDrop = new DropNote("candied #apple", "adam");
exampleDrop.hashtags = ["#apple"];
exampleDrop.key = "0";
exampleDrop._id = "0";
const drops = [
    exampleDrop
]
const exampleDrop2 = new DropNote("#pear", "#pear");
exampleDrop2.hashtags = ["#pear"];
exampleDrop2.key = "1";
exampleDrop2._id = "1";

test('renders without crashing', () => {
    const div = document.createElement('div');
    render(<DropList
        drops = {[]}
        isCanDelete = {true}
        deleteDrop = {noop}
        isSyncing = {false}
    />, div);
});

test('shows right number of "drop" elements (1)', () => {
    ({ getByTestId, container } = render(<DropList
        drops = { drops }
        deleteDrop = {noop}
        isCanDelete = {true}
        isSyncing = {false}
    />, div));

    const dropRows = $(".drop-row", container);
    expect(dropRows).toHaveLength(1);
});

test('shows right number of "drop" elements (2)', () => {
    const drops = [exampleDrop, exampleDrop2];

    ({ getByTestId, container } = render(<DropList
        drops = { drops }
        deleteDrop = {noop}
        isCanDelete = {true}
        isSyncing = {false}
    />, div));

    const dropRows = $(".drop-row", container);
    expect(dropRows).toHaveLength(2);
});

test('indicates busy if isSyncing true', () => {
    ({ getByTestId, container } = render(<DropList
        drops = { [] }
        deleteDrop = {noop}
        isCanDelete = {true}
        isSyncing = {true}
    />, div));
    expect($(".syncing-bar", container)).toHaveLength(1);
});

test('does not indicate busy if isSyncing false', () => {
    ({ getByTestId, container } = render(<DropList
        drops = { [] }
        deleteDrop = {noop}
        isCanDelete = {true}
        isSyncing = {false}
    />, div));
    expect($(".syncing-bar", container)).toHaveLength(0);
});

test('clicking delete fires deleteDrop function', (done) => {
    const drops = [exampleDrop];
    const deleteDrop = (drop) => {
        done();
    }
    ({ getByTestId, container } = render(<DropList
        drops = { drops }
        deleteDrop = {deleteDrop}
        isCanDelete = {true}
        isSyncing = {false}
    />, div));
    const deleteButton0 = $(".drop-row", container).eq(0).find(".del-button")[0];
    fireEvent.click(deleteButton0);
});

test('clicking delete sends appropriate drop to deleteDrop function (0)', (done) => {
    const drops = [exampleDrop, exampleDrop2];
    const deleteDrop = (drop) => {
        expect(drop._id).toBe("0");
        done();
    }
    ({ getByTestId, container } = render(<DropList
        drops = { drops }
        deleteDrop = {deleteDrop}
        isCanDelete = {true}
        isSyncing = {false}
    />, div));
    const deleteButton0 = $(".drop-row", container).eq(0).find(".del-button")[0];
    fireEvent.click(deleteButton0);
});

test('clicking delete sends appropriate drop to deleteDrop function (1)', (done) => {
    const drops = [exampleDrop, exampleDrop2];
    const deleteDrop = (drop) => {
        expect(drop._id).toBe("1");
        done();
    }
    ({ getByTestId, container } = render(<DropList
        drops = { drops }
        deleteDrop = {deleteDrop}
        isCanDelete = {true}
        isSyncing = {false}
    />, div));
    const deleteButton0 = $(".drop-row", container).eq(1).find(".del-button")[0];
    fireEvent.click(deleteButton0);
});
