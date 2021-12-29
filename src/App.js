import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery"
import ReactPlayer from 'react-player';

import Navbar from "./components/navbar.component"
import GoogleSignIn from "./components/google-signin.component"
import AlbumSelector from "./components/album-selector.component"
import LoginForm from "./components/login-form.component"
import ExercisesList from "./components/exercises-list.component";
import EditExercise from "./components/edit-exercise.component";
import CreateExercise from "./components/create-exercise.component";
import CreateUser from "./components/create-user.component";
import PhotoFrame from "./components/photo_frame.component"
import axios from 'axios';


const fs = require("browserify-fs")


const regex = /"(https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9\-_]*)"/g // the only difference is the [ at the beginning
function extractPhotos(content) {
  const links = new Set()
  let match
  while (match = regex.exec(content)) {
    links.add(match[1])
  }
  return Array.from(links)
}


class App extends Component {
  // var photos = extractPhotos (getAlbum("j21noN5baZExj9Cj8"))
  constructor() {
    super()
    this.state = {
      "items": [],
      "displayAlbumSelector": false,
      "waitText": "",
      "gallery": []
    }
    this.albumData = []
    this.imageUrls = []

    this.getAlbumData = this.getAlbumData.bind(this)
    this.doneAuth = this.doneAuth.bind(this)
    this.doneSelect = this.doneSelect.bind(this)
  }

  async doneAuth(token) {
    console.log("DONE with google auth")
    this.setState({ waitText: "Loading..." })
    this.token = token
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const res = await axios.get(
      'https://photoslibrary.googleapis.com/v1/albums',
      config
    )
    var data = await res.data
    console.log(await res.data)
    var albums = await data["albums"]
    this.setState({ waitText: "Getting album data..." })
    const promises = albums.map(this.getAlbumData)
    // for (const album of albums) {
    //   await this.getAlbumData(album)
    // }
    await Promise.all(promises)
    console.log(this.albumData)
    this.setState({ displayAlbumSelector: true, waitText: "" })
  }

  async getAlbumData(album) {
    var album_id = album["id"]
    var mediaData = await axios({
      method: 'POST',
      url: 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${this.token}`
      },
      data: {
        'albumId': `${album_id}`
      },
      json: true
    })
    let albumName = album["title"]
    // console.log(await mediaData.data["mediaItems"][0]["baseUrl"])
    mediaData = await mediaData.data["mediaItems"]
    let albumUrl = ""
    if (!await mediaData) {
      albumUrl = "https://cdn.website.thryv.com/343f0986cb9d4bc5bc00d8a4a79b4156/dms3rep/multi/1274512-placeholder.png"
    } else {
      albumUrl = mediaData[0]["baseUrl"]
    }
    this.albumData.push([albumName, await albumUrl, album_id])
  }

  doneSelect(album_id) {
    this.setState({ displayAlbumSelector: false })
    console.log("Clicked button")
    console.log(album_id)
    // album_id = album_id.slice(1, album_id.length - 1)
    axios({
      method: 'POST',
      url: 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${this.token}`
      },
      data: {
        'albumId': `${album_id}`,
        'pageToken': ''
      },
      json: true
    })
      .then(res => {
        this.setState ({waitText: "Rendering album items..."})
        this.getImageUrls(res, album_id)
      })
  }

  getImageUrls(res, album_id) {

    var photos = res.data["mediaItems"]
    var nextPageToken = res.data["nextPageToken"]
    for (let i = 0; i < photos.length; i++) {
      console.log(photos[i]["baseUrl"])
      if (photos[i]["mimeType"].includes("image")) {
        this.imageUrls.push(<div><br></br><img src={photos[i]["baseUrl"]}></img></div>)
      } else {
        this.imageUrls.push(<div className="player-wrapper"><br></br><ReactPlayer className="react-player" width='40%' height='40%' key={i} url={photos[i]["baseUrl"] + "=dv"} controls /></div>)
      }
    }
    if (nextPageToken == null) {
      this.setState({ gallery: this.imageUrls , waitText: ""})
    } else {
      axios({
        method: 'POST',
        url: 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${this.token}`
        },
        data: {
          'albumId': `${album_id}`,
          'pageToken': `${nextPageToken}`
        },
        json: true
      })
        .then(res => {
          this.getImageUrls(res, album_id)
        })
    }
  }

  // componentDidMount() {
  //   axios.get("https://google-photos-album-demo.glitch.me/j21noN5baZExj9Cj8")
  //     .then(res => {
  //       var urls = res.data
  //       var items = []
  //       console.log(urls.length)
  //       for (var i = 0; i < urls.length; i++) {
  //         // console.log (urls[i])
  //         items.push(<PhotoFrame img_url={urls[i]}></PhotoFrame>)
  //       }

  //       return items
  //     }).then(items => this.setState({ items }))

  // }

  render() {
    return (
      <Router>
        <div className="container">
          <Navbar items={<LoginForm></LoginForm>}></Navbar>
          <br></br>
          <GoogleSignIn callbackFromParent={this.doneAuth}></GoogleSignIn>
          <br />
          <h2>
            {this.state["waitText"]}
          </h2>
          <AlbumSelector callbackFromParent={this.doneSelect} albumData={this.albumData} shouldDisplay={this.state["displayAlbumSelector"]}></AlbumSelector>

          {this.state["gallery"]}

          {/* <video width="320" height="240" controls>
            <source src="https://lh3.googleusercontent.com/mdh7OLMggUczNVhZ7rKMGiY98BtMJeAHpet5wrquqssvw-AnCxBqt1qUHpe7rDdKUCaINJF6ShdgF1iycJeYfLfVWq7da3QhH5sGG-vfwuRBcTxnl5lV-lpR92HLeijs0d9ortYBJw=dv" type="video/mp4"></source>
            Your browser does not support the video tag.
          </video>

          
          
          {this.state["items"]} */}


          {/* <Route path="/changeUrl" exact component={ChangeUrl} /> */}
          {/* <Route path="/edit/:id" component={EditExercise} />
        <Route path="/create" component={CreateExercise} />
        <Route path="/user" component={CreateUser} /> */}
        </div>
      </Router >
    );
  }
}

export default App;
