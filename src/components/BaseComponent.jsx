import { Component } from "react";
import COPY from "../configuration/messages-copy.js";
import PropTypes from 'prop-types';
import DropNote from "../entities/DropNote.js"
class BaseComponent extends Component {
    log (str) {
        console.log(str);
    }

    bindOwn (keyArr) {
        for (const key of keyArr) {
            if (typeof this[key] === "function") {
                this[key] = this[key].bind(this);
            } else {
                debugger;
            }
        }
    }

    COPY = COPY;
    noop = () => {};
    // baseProps = ["drops", "droptext", "isSyncing", "unsavedDrops"];
    isBasePropsDefined () {
        return !(!this.props.drops || !this.props.droptext || !this.props.isSyncing);
    }

    validateBaseProps () {
        const notDefined = [];
        for (const key of this.baseProps) {
            if (typeof this.props[key] === "undefined") {
                notDefined.push(key);
            }
        }
        return notDefined;
    }

    runRenderValidation = this.noop
}
BaseComponent.propTypes = {
    drops : PropTypes.arrayOf(PropTypes.instanceOf(DropNote)),
    droptext : PropTypes.string,
    isSyncing : PropTypes.bool
}
export default BaseComponent;
