import React, { Component } from "react";
import DropListInner from "./DropListInner.jsx";
import "./DropList.scss";
import PropTypes from 'prop-types';

class DropList extends Component {
    render () {
        return (
            <div className = "drop-list"
                data-testid="drop-list"
            >
                {this.props.isSyncing &&
                    <div className = "syncing-bar"></div>
                }
                <DropListInner
                    drops = {this.props.drops}
                    deleteDrop = {this.props.deleteDrop}
                    isCanDelete = {this.props.isCanDelete}
                />
            </div>
        )
    }
}
DropList.propTypes = {
    isSyncing : PropTypes.bool,
    drops : PropTypes.array,
    deleteDrop : PropTypes.func,
    isCanDelete : PropTypes.bool
}

export default DropList;
