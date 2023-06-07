import React, { Component } from "react";
import "./DropDisplay.scss";
import PropTypes from 'prop-types';
import DropNote from "../entities/DropNote.js";

class DropDisplay extends Component {
    get innerHTML () {
        const hashtags = this.props.drop.hashtags;
        const rawHTML = this.props.drop.text;
        let output = rawHTML;
        for (const tag of hashtags) {
            const pattern = new RegExp(tag, 'gi');
            const len = tag.length; // this is known to be the length of all matches
            const indices = [];
            const matches = [...output.matchAll(pattern)];
            const replacement = `<span class = 'tag'>${tag}</span>`;
            let indexOffput = 0;
            for (const match of matches) {
                const matchIndex = match.index + indexOffput;
                indices.push(matchIndex);
                indexOffput += replacement.length - len;
            }
            for (let i = 0; i < indices.length; i++) {
                const index = indices[i];
                const replacement = `<span class = 'tag'>${matches[i][0]}</span>`;
                output = output.substring(0, index) + replacement + output.substring(index + len);
            }
        }
        return output;
    }

    render () {
        return (
            <div
                className = "drop-display"
                dangerouslySetInnerHTML={{ __html : this.innerHTML }}>
            </div>
        );
    }
}
DropDisplay.propTypes = {
    drop : PropTypes.instanceOf(DropNote)
};
export default DropDisplay;
