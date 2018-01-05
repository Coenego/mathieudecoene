'use strict';

import React from 'react';

import styles from './Header.scss';

/**
 * Class representing a Header component
 * @extends Component
 */
export default class Header extends React.Component {

    /**
     * Create a new Header class
     */
    constructor() {
        super();
    }

    /**
     * Render the Header component
     * @return {*}
     */
    render() {
        return (
            <header className={[`${styles['c-header']}`, 'u-flex'].join(' ')}>
                <h1 className={`${styles['c-header']}__title`}>
                    <span className="c-censor"><a href="//mathieudecoene.be" tabIndex="0">Mathieu Decoene</a></span>
                </h1>
                <h2 className={`${styles['c-header']}__subtitle`}><span className="c-censor">Front-End Developer</span></h2>
            </header>
        );
    }
}
