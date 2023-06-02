import React from 'react';
import ReactDOM from 'react-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import DropDisplay from "./DropDisplay.jsx";
import $ from "jquery";
import DropNote from "../entities/DropNote.js";

afterEach(cleanup)

let getByTestId;
let container;
const noop = () => {};
let div;
const setProps = () => {
}
const drop = (() => {
    const drop = new DropNote("#apple", "adam");
    drop.hashtags = ["#apple"];
    drop._id = "0"
    return drop;
})()

beforeEach(() => {
    div = document.createElement('div');
    setProps();
})

afterEach(() => {
    cleanup();
});

test('renders without crashing', () => {
    render(<DropDisplay
        drop = {drop}
    />, div);
});

test('shows correct drop html with two hashtags', () => {
    const drop = {
        text : "some #tag1 and some other #tag2",
        hashtags : ["#tag1", "#tag2"],
        _id : "0"
    };
    ({ getByTestId, container } = render(<DropDisplay
        drop = {drop}
    />, div));
    const elt = $(".drop-display", container);
    const tagSpans = $(".tag", elt);
    expect(tagSpans).toHaveLength(2);
});
