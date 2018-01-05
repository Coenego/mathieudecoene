'use strict';

import React from 'react';

import styles from './Overlay.scss';

/**
 * Class representing an overlay component
 * @extends Component
 */
export default class Overlay extends React.Component {

    /**
     * Create a new Overlay class
     */
    constructor() {
        super();
    }

    /**
     * Close the overlay
     * @param  {Event}      e       The dispatched event
     */
    close(e) {
        console.log('close');
    }

    /**
     * Render the Overlay component
     * @return {*}
     */
    render() {
        return (
            <dialog className={[styles['c-overlay'], 'u-flex'].join(' ')} role="dialog">
                {this.props.children}
                <a className={`${styles['c-overlay']}__close`} href="#" onClick={this.close} aria-label="Continue to website" tabIndex="1">Skip</a>
            </dialog>
        );
    }
}
