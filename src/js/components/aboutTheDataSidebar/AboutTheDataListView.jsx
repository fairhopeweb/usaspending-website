/**
 * AboutTheDataListView.jsx
 * Created by Andrea Blackwell 11/14/22
 */

import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    section: PropTypes.string,
    selectItem: PropTypes.func
};

const AboutTheDataListView = ({ section, selectItem }) =>
    <>
        <div className="atd__heading">{section.heading}</div>
        <hr />
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
        {section.fields.map((list, index) => <p className="atd__link" onClick={() => selectItem(index, section)}>{list.name}</p>)}
    </>;

AboutTheDataListView.propTypes = propTypes;
export default AboutTheDataListView;
