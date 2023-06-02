import React from "react";
import BaseComponent from "./BaseComponent.jsx";
import LoginLayer from "./LoginLayer.jsx";
import StatusBar from "./StatusBar";
import DropBackendService from "../helpers/DropBackendService.js";
import LoginHelper from "../helpers/LoginHelper.js";
import { connect } from "react-redux";
import {} from "../actions.js";
import TopMenu from "./TopMenu.jsx";

class TopLayer extends BaseComponent {
    constructor (props) {
        super(props);
        this.bindOwn([
            "setFatalError",
            "pushNewStatusMessage"
        ]);
        this.state = {
            statusMessages : [],
            fatalError : false,
            unsavedDrops : []
        }
    }

    statusVisibilityDelay = 1500;
    setFatalError () {
        this.pushNewStatusMessage(this.COPY.FATAL_ERR, true);
        this.setState({
            fatalError : true
        });
    }

    appAlert (message) {
        window.alert(message);
    }

    appConfirm (message) {
        return window.confirm(message);
    }

    pushNewStatusMessage (statusText, noExpire) {
        const key = Date.now();
        const statusObject = {
            text : statusText,
            key : key
        };
        const statusMessages = this.state.statusMessages.slice();
        statusMessages.push(statusObject);
        this.setState({
            statusMessages : statusMessages
        });
        if (noExpire !== true) {
            setTimeout(() => {
                const statusMessages = this.state.statusMessages.slice();
                const statusObjectIndex = statusMessages.indexOf(statusObject);
                statusMessages.splice(statusObjectIndex, 1);
                this.setState({
                    statusMessages : statusMessages
                });
            }, this.statusVisibilityDelay);
        }
    }

    render () {
        return (
            <div className="TopLayer">
                <StatusBar
                    statusMessages = {this.state.statusMessages}
                />
                {this.props.isUsernameSet &&
                    <TopMenu />
                }
                <LoginLayer
                    pushNewStatusMessage = {this.pushNewStatusMessage}
                    DropBackendService = {DropBackendService}
                    setFatalError = {this.setFatalError}
                    appAlert = {this.appAlert}
                    appConfirm = {this.appConfirm}
                    LoginHelper = {LoginHelper}
                />
            </div>
        );
    }
}
const mapStateToProps = (state, ownProps) => ({
    isUsernameSet : state.isUsernameSet
})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(TopLayer);
