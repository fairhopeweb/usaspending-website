/**
 * DetailsTabBar.jsx
 * Created by Elizabeth Dabbs 2/22/17
 **/

import React from 'react';

import DetailsTabItem from './DetailsTabItem';

const propTypes = {
    activeTab: React.PropTypes.string,
    clickTab: React.PropTypes.func,
    type: React.PropTypes.string
};

export default class DetailsTabBar extends React.Component {
    render() {
        const tabOptions = [
            {
                label: 'Transaction History',
                code: 'transaction',
                disabled: false
            },
            {
                label: 'Sub-Awards',
                code: 'subaward',
                disabled: true
            },
            {
                label: 'Financial System Details',
                code: 'financial',
                disabled: false
            }
        ];
        if (this.props.type === 'contract') {
            tabOptions.push({
                label: 'Additional Details',
                code: 'additional',
                disabled: false
            });
        }
        const tabs = tabOptions.map((tab) => (
            <DetailsTabItem
                {...tab}
                active={tab.code === this.props.activeTab}
                clickTab={this.props.clickTab}
                key={tab.code} />));

        return (
            <div className="table-tabs">
                {tabs}
            </div>
        );
    }
}

DetailsTabBar.propTypes = propTypes;
