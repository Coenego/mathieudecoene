'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import styles from './Guide.scss';

/**
 * Class representing a Guide component
 * @extends Component
 */
export default class Guide extends React.Component {

    /**
     * Create a new Guide class
     */
    constructor() {
        super();
    }

    /**
     * Render the Guide component
     * @return {*}
     */
    render() {

        // Compose the classes
        let classes = [`${styles['c-guide']}`, 'u-flex'];
        if (this.props.classes && this.props.classes.length) {
            classes = classes.concat(this.props.classes);
        }

        if (this.props.isComplete) {
            classes.push('is-complete');
        }

        // Compose the message
        let guideMessage = '';
        if (this.props.movementProgress >= 75) {
            guideMessage = 'Almost there';

        } else if (this.props.movementProgress < 75 && this.props.movementProgress >= 50) {
            guideMessage = 'Good progress';

        } else if (this.props.movementProgress < 50) {
            guideMessage = 'Keep going';
        }

        return (
            <div className={classes.join(' ')}>
                <span className={[`${styles['c-guide']}__icon`, 'u-flex'].join(' ')}>
                    <span className={`${styles['c-guide']}__icon__label`}>{guideMessage}</span>
                </span>
                <span className={`${styles['c-guide']}__meter`} style={{'height': `${this.props.movementProgress}%`}}></span>
            </div>
        );
    }
}

Guide.propTypes = {
    classes: PropTypes.array,
    isComplete: PropTypes.bool.isRequired,
    movementProgress: PropTypes.number.isRequired
};
