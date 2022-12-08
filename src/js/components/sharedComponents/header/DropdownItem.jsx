/**
 * DropdownItem.jsx
 * Created by Kevin Li 10/18/17
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import * as aboutTheDataActions from 'redux/actions/aboutTheDataSidebar/aboutTheDataActions';
import Analytics from 'helpers/analytics/Analytics';
import { getNewUrlForGlossary } from 'helpers/glossaryHelper';
import { getNewUrlForATD } from 'helpers/aboutTheDataSidebarHelper';
import DropdownComingSoon from './DropdownComingSoon';

const propTypes = {
    url: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ pathname: PropTypes.string, search: PropTypes.string })]),
    label: PropTypes.node,
    enabled: PropTypes.bool,
    shouldOpenNewTab: PropTypes.bool,
    isNewTab: PropTypes.bool,
    isFirst: PropTypes.bool,
    appendToExistingUrl: PropTypes.bool
};

const clickedHeaderLink = (route) => {
    Analytics.event({
        category: 'Header - Link',
        action: route
    });
};

const DropdownItem = ({
    url = '',
    label,
    enabled = true,
    shouldOpenNewTab = false,
    isFirst = false,
    isNewTab = false,
    appendToExistingUrl = false
}) => {
    const { pathname, search } = useLocation();

    let newUrl = url;
    if (appendToExistingUrl && pathname.includes('about-the-data')) {
        newUrl = getNewUrlForATD(pathname, url, search);
    } else if (appendToExistingUrl && pathname.includes('glossary')) {
        newUrl = getNewUrlForGlossary(pathname, url, search);
    }

    const dispatch = useDispatch();

    const openATD = (e) => {
        dispatch(aboutTheDataActions.showAboutTheData());
        e.preventDefault();
    };

    let className = 'nav-children__link_disabled';
    let comingSoon = (
        <div className="nav-children__coming-soon">
            <DropdownComingSoon />
        </div>
    );

    const newLabel = isNewTab && enabled
        ? (
            <>
                {label}
                <span className="new-badge dropdown-item"> NEW</span>
            </>
        )
        : null;

    if (enabled) {
        className = '';
        comingSoon = null;
    }

    const newTabProps = {};
    if (shouldOpenNewTab) {
        newTabProps.target = '_blank';
        newTabProps.rel = 'noopener noreferrer';
    }

    let link = (
        <Link
            className={`nav-children__link ${className}`}
            to={newUrl}
            onClick={clickedHeaderLink.bind(null, `${newUrl}`)}
            {...newTabProps}>
            {!newLabel && label}
            {newLabel}
            {comingSoon}
        </Link>
    );

    if (typeof url === 'string' && url.includes('http')) {
        link = (
            <a
                className={`nav-children__link ${className}`}
                href={newUrl}
                onClick={clickedHeaderLink.bind(null, `${newUrl}`)}
                {...newTabProps}>
                {!newLabel && label}
                {newLabel}
                {comingSoon}
            </a>
        );
    }

    if (appendToExistingUrl && label.includes("About the Data")) {
        link = (
            <Link
                className={`nav-children__link ${className}`}
                onClick={openATD}
                {...newTabProps}>
                {!newLabel && label}
                {newLabel}
                {comingSoon}
            </Link>
        );
    }

    let firstClass = '';
    if (isFirst) {
        firstClass = 'nav-children__list-separator_hidden';
    }

    return (
        <li className="nav-children__list-item">
            <hr className={`nav-children__list-separator ${firstClass}`} />
            {link}
        </li>
    );
};

DropdownItem.propTypes = propTypes;

export default DropdownItem;
