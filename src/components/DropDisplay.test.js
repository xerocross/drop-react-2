import React from 'react';
import { cleanup, render, act } from '@testing-library/react';
import DropDisplay from "./DropDisplay.jsx";
import $ from "jquery";
import DropNote from "../entities/DropNote.js";

afterEach(cleanup);
let div;
const setProps = () => {
};
const drop = (() => {
    const drop = new DropNote("#apple", "adam");
    drop.hashtags = ["#apple"];
    drop._id = "0";
    return drop;
})();

beforeEach(() => {
    div = document.createElement('div');
    setProps();
});

afterEach(() => {
    cleanup();
});

test('renders without crashing', () => {
    render(<DropDisplay
        drop = {drop}
    />, div);
});

test('shows correct drop html with two hashtags', () => {
    const drop = new DropNote("some #tag1 and some other #tag2", "user");
    drop.hastags = ["#tag1", "#tag2"];
    drop._id = "0";
    let container;
    act(() => {
        ({ container } = render(<DropDisplay
            drop = {drop}
        />, div));
    });
    const elt = $(".drop-display", container);
    const tagSpans = $(".tag", elt);
    expect(tagSpans).toHaveLength(2);
});

test('shows correct drop html with 2 tags where 1 is duplicated', () => {
    const drop = new DropNote("some #tag1 and #Tag1 some other #tag2 or #TAG2", "user");
    drop._id = "0";
    let container;
    act(() => {
        ({ container } = render(<DropDisplay
            drop = {drop}
        />, div));
    });
    const elt = $(".drop-display", container);
    const tagSpans = $(".tag", elt);
    expect(tagSpans).toHaveLength(4);
});
