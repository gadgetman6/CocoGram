import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class PhotoFrame extends Component {

    constructor(props) {
        super(props)
        this.state = {
            url: props.img_url
        };
    }

    render() {
        return (
            <div>
                <img src={this.state.url} class="img-fluid" alt="Responsive Image">

                </img>

                <br></br>
                <br></br>
            </div>
        );
    }
}