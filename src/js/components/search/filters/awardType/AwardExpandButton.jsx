/**
  * AwardExpandButton.jsx
  * Created by Kevin Li
  **/

import React from 'react';
import * as Icons from 'components/sharedComponents/icons/Icons';

const defaultProps = {
    hidden: false
};

const propTypes = {
    hidden: React.PropTypes.bool,
    toggleExpand: React.PropTypes.func,
    arrowState: React.PropTypes.string
};

export default class AwardExpandButton extends React.Component {
    render() {
        let hiddenClass = '';

        if (this.props.hidden) {
            hiddenClass = 'hidden-button';
        }

        let icon = <Icons.AngleRight />;
        if (this.props.arrowState === 'expanded') {
            icon = <Icons.AngleDown />;
        }

        return (
            <button
                className={`toggle ${hiddenClass}`}
                onClick={this.props.toggleExpand}
                title={`child filters`}
                disabled={this.props.hidden}>
                {icon}
            </button>
        );
    }
}

AwardExpandButton.defaultProps = defaultProps;
AwardExpandButton.propTypes = propTypes;
