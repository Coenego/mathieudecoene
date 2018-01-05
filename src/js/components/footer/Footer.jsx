'use strict';

import React from 'react';

import styles from './Footer.scss';

/**
 * Class representing a Footer component
 * @extends Component
 */
export default class Footer extends React.Component {

    /**
     * Create a new Footer class
     */
    constructor() {
        super();
    }

    /**
     * Render the Footer component
     * @return {*}
     */
    render() {
        return (
            <footer className={[`${styles['c-footer']}`, 'u-flex'].join(' ')} id="footer">
                <ul className={[`${styles['c-footer']}__list`, 'o-list', 'o-list--inline'].join(' ')}>
                    <li>
                        <a href="//linkedin.com/in/mathieudecoene" title="Visit my LinkedIn profile" tabIndex="0">
                            <span className="c-censor">LinkedIn</span>
                        </a>
                    </li>
                    <li>
                        <a href="//twitter.com/Coenego" title="Visit my Twitter profile" tabIndex="0">
                            <span className="c-censor">Twitter</span>
                        </a>
                    </li>
                </ul>
            </footer>
        );
    }
}
