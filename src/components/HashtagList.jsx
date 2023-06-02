import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';

class HashtagList extends Component {
    render () {
        return (
            <div
                data-testid="hashtag-list"
                className="hashtag-list"
            >
                {
                    this.props.hashtags.map(tag => {
                        return (
                            <span key = {tag} data-testid="hashtag" className="hashtag">{tag}</span>
                        );
                    })
                }
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => ({
    hashtags : state.hashtags
})

const mapDispatchToProps = {
}
HashtagList.propTypes = {
    hashtags : PropTypes.arrayOf(PropTypes.string)
}
export default connect(mapStateToProps, mapDispatchToProps)(HashtagList);
