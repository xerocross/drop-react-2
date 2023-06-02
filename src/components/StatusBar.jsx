import React, { Component } from "react";
import "./StatusBar.scss";
import PropTypes from 'prop-types';

class StatusBar extends Component {
    render () {
        return (
            <div className="status-bar" data-testid = "StatusBar">
                {
                    this.props.statusMessages.map((statusObj) => {
                        return (
                            <div className="statusItem" key = {statusObj.key}>
                                {statusObj.text}
                            </div>
                        )
                    })

                }
            </div>
        )
    }
}
StatusBar.propTypes = {
    statusMessages : PropTypes.array
}
export default StatusBar;
