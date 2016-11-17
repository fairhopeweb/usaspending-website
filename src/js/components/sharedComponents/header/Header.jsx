import React from 'react';

import WarningBanner from './WarningBanner';
import NavBar from './NavBar';

export default class Header extends React.Component {
    skippedNav(e) {
        // don't update the URL due to potential React Router conflicts
        e.preventDefault();
        // scroll to the main-content id
        const yPos = document.querySelector('#main-content').getBoundingClientRect().top;
        window.scrollTo(0, yPos);
    }
    render() {
        return (
            <div>
                <a
                    href="#main-content"
                    className="skip-nav"
                    onClick={this.skippedNav.bind(this)}>
                        Skip to main content
                </a>
                <header>
                    <WarningBanner />
                    <NavBar />
                </header>
            </div>
        );
    }

}
