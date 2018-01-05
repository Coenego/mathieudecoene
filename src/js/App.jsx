'use strict';

import React from 'react';

import styles from './App.scss';

import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import Overlay from 'components/overlay/Overlay';

import Intro from 'components/intro/Intro'

/**
 * Class representing an application component
 * @extends Component
 */
export default class App extends React.Component {

    /**
     * Create a new Application class
     */
    constructor() {
        super();

        this.state = {
            showIntro: true
        }
    }

    /**
     * Render the Application component
     * @return {*}
     */
    render() {

        let children = [
            <Header key='header' />,
            <Footer key='footer' />
        ];

        if (this.state.showIntro) {
            children.push(<Overlay key='overlay'><Intro /></Overlay>);
        }

        return children;
    }
}
