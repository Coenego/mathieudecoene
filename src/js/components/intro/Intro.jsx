'use strict';

import React from 'react';

import Guide from './components/guide/Guide';

import styles from './Intro.scss';

let _canvasHeight = 0;
let _canvasWidth = 0;

let _remainingMovementScore = 0;

/**
 * Class representing an intro component
 * @extends Component
 */
export default class Intro extends React.Component {

    /**
     * Create a new Intro class
     */
    constructor() {
        super();

        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.touchMoveHandler = this.touchMoveHandler.bind(this);

        this.state = {
            isComplete: false,
            movementProgress: 0
        }
    }

    /**
     * Start listening to user events
     */
    componentDidMount() {

        _canvasHeight = document.body.clientHeight;
        _canvasWidth = document.body.clientWidth;

        _remainingMovementScore = _canvasWidth;

        // Capture mouse/touch events
        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('touchmove', this.touchMoveHandler);

        // Capture window events
        window.addEventListener('resize', this.resizeHandler);
    }

    /**
     * Calculate the distance between the center and the touch position
     * @param   {Number}    clientCoordsX       The x-position
     * @param   {Number}    clientCoordsY       The y-position
     * @return  {Number}                        The distance factor
     */
    calculateDistanceFactorBetweenCenterAndTouchPosition(clientCoordsX, clientCoordsY) {

        let canvasCoordsX = _canvasWidth * .5;
        let canvasCoordsY = _canvasHeight * .5;

        let coordsX = canvasCoordsX - clientCoordsX;
        let coordsY = canvasCoordsY - clientCoordsY;

        let distanceCenterToBrowser = Math.sqrt(Math.pow(0 - canvasCoordsX, 2) + Math.pow(0 - canvasCoordsY, 2));
        let distanceClientToCenter = Math.sqrt(Math.pow(coordsX, 2) + Math.pow(coordsY, 2));

        return Math.ceil((distanceClientToCenter / distanceCenterToBrowser) * 100);
    }

    /**
     * Update the mouse movement score
     * @param  {Number}         movement
     * @param  {Number}         factor
     */
    updateMouseMovementScore(movement, factor = .1) {

        // Update the score
        if (_remainingMovementScore <= 0) return;
        _remainingMovementScore -= Math.abs(movement * factor);

        let movementProgress = Math.ceil((1 - Math.abs(_remainingMovementScore / _canvasWidth)) * 100);

        this.setState({'movementProgress': movementProgress});
        if (movementProgress === 100 && !this.state.isComplete) {
            this.setState({'isComplete': true});
        }
    }

    /**
     * Handle mouse move events
     * @param  {MouseEvent}     evt     The dispatched event
     */
    mouseMoveHandler(evt) {
        this.updateMouseMovementScore(evt.movementX, .05);
    }

    /**
     * Handle touch move events
     * @param  {TouchEvent}     evt     The dispatched event
     */
    touchMoveHandler(evt) {
        if (!evt.touches.length) return;
        let moveFactor = this.calculateDistanceFactorBetweenCenterAndTouchPosition(evt.touches[0].clientX, evt.touches[0].clientY);
        this.updateMouseMovementScore(moveFactor, .025);
    }

    /**
     * Render the Intro component
     * @return {*}
     */
    render() {

        // Compose the classes
        let classes = [styles['c-intro'], 'u-flex'];
        if (this.state.isComplete) {
            classes.push('is-complete');
        }

        // Compose the guide classes
        let guideClasses = [`${styles['c-intro']}__guide`];
        if (this.state.movementProgress >= 50) {
            guideClasses.push('is-large');
        }

        return (
            <div className={classes.join(' ')}>
                <Guide classes={guideClasses} movementProgress={this.state.movementProgress} isComplete={this.state.isComplete} />
                <div className={`${styles['c-intro']}__label`}>Let's generate some static electricity</div>
            </div>
        );
    }
}
