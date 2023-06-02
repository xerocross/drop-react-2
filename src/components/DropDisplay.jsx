import React, { Component } from "react";
import "./DropDisplay.scss";
import PropTypes from 'prop-types';
import DropNote from "../entities/DropNote.js";

class DropDisplay extends Component {
    get innerHTML () {
        const hashtags = this.props.drop.hashtags;
        let rawHTML = this.props.drop.text;
        for (const tag of hashtags) {
            const pattern = new RegExp(tag, 'g');
            rawHTML = rawHTML.replace(pattern, `<span class = 'tag'>${tag}</span>`)
        }
        return rawHTML;
    }

    render () {
        return (
            <div
                className = "drop-display"
                dangerouslySetInnerHTML={{ __html : this.innerHTML }}>
            </div>
        )
    }
}
DropDisplay.propTypes = {
    drop : PropTypes.instanceOf(DropNote)
}
export default DropDisplay;
