import React, { Component } from 'react';
import { Carousel, Button } from "react-bootstrap"
import "./album-selector.component.scss"

export default class AlbumSelector extends Component {

    constructor(props) {
        super(props)
        this.state = {
            "carousels": []

        }
        this.activeIndex = 0;
        this.handleSelect = this.handleSelect.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleSelect(index, e) {
        this.activeIndex = index
    }

    handleClick() {
        let i = this.activeIndex
        let albumId = this.props.albumData[i][2]
        this.props.callbackFromParent (albumId)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps != this.props) {
            var carouselData = []
            console.log(this.props.albumData)
            for (let i = 0; i < this.props.albumData.length; i++) {
                let name = this.props.albumData[i][0]
                let url = this.props.albumData[i][1]
                carouselData.push(<Carousel.Item>
                    <div class="peopleCarouselImg">
                        <img
                            className="d-block w-100"
                            src={url}
                            alt="First slide"
                        />
                    </div>
                    <Carousel.Caption>
                        <h3>{name}</h3>
                    </Carousel.Caption>
                </Carousel.Item>)
            }
            console.log(carouselData)
            this.setState({ carousels: carouselData })
        }
    }

    render() {
        if (this.props.shouldDisplay) {
            console.log("HELLO WORLD")
            return (
                <div>
                    <Carousel interval={null} onSelect={this.handleSelect}>
                        {this.state["carousels"]}
                    </Carousel>
                    <br></br>
                    <Button variant="success" onClick={this.handleClick}>Select this album</Button>
                </div>
            )
        } else {
            return null
        }
    }
}