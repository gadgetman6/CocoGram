// import React, { Component } from 'react';
// import $ from 'jquery'

// export default class ExercisesList extends Component {

//     gapi = require("googleapis")
//     GoogleAuth;
//     SCOPE = 'https://www.googleapis.com/auth/drive.metadata.readonly';


//     handleClientLoad() {
//         // Load the API's client and auth2 modules.
//         // Call the initClient function after the modules load.
//         this.gapi.load('client:auth2', this.initClient);
//     }

//     initClient() {
//         // Retrieve the discovery document for version 3 of Google Drive API.
//         // In practice, your app can retrieve one or more discovery documents.
//         var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

//         // Initialize the gapi.client object, which app uses to make API requests.
//         // Get API key and client ID from API Console.
//         // 'scope' field specifies space-delimited list of access scopes.
//         this.gapi.client.init({
//             'apiKey': 'YOUR_API_KEY',
//             'clientId': 'YOUR_CLIENT_ID',
//             'discoveryDocs': [discoveryUrl],
//             'scope': this.SCOPE
//         }).then(function () {
//             this.GoogleAuth = this.gapi.auth2.getAuthInstance();

//             // Listen for sign-in state changes.
//             this.GoogleAuth.isSignedIn.listen(this.updateSigninStatus);

//             // Handle initial sign-in state. (Determine if user is already signed in.)
//             var user = this.GoogleAuth.currentUser.get();
//             this.setSigninStatus();

//             // Call handleAuthClick function when user clicks on
//             //      "Sign In/Authorize" button.
//             $('#sign-in-or-out-button').click(function () {
//                 this.handleAuthClick();
//             });
//             $('#revoke-access-button').click(function () {
//                 this.revokeAccess();
//             });
//         });
//     }

//     handleAuthClick() {
//         if (this.GoogleAuth.isSignedIn.get()) {
//             // User is authorized and has clicked "Sign out" button.
//             this.GoogleAuth.signOut();
//         } else {
//             // User is not signed in. Start Google auth flow.
//             this.GoogleAuth.signIn();
//         }
//     }

//     revokeAccess() {
//         this.GoogleAuth.disconnect();
//     }

//     setSigninStatus(isSignedIn) {
//         var user = this.GoogleAuth.currentUser.get();
//         var isAuthorized = user.hasGrantedScopes(this.SCOPE);
//         if (isAuthorized) {
//             $('#sign-in-or-out-button').html('Sign out');
//             $('#revoke-access-button').css('display', 'inline-block');
//             $('#auth-status').html('You are currently signed in and have granted ' +
//                 'access to this app.');
//         } else {
//             $('#sign-in-or-out-button').html('Sign In/Authorize');
//             $('#revoke-access-button').css('display', 'none');
//             $('#auth-status').html('You have not authorized this app or you are ' +
//                 'signed out.');
//         }
//     }

//     updateSigninStatus(isSignedIn) {
//         this.setSigninStatus();
//     }

//     render() {
//         return (
//             <div>
//                 <p>You are on the Exercises List component!</p>
//             </div>
//         )
//     }
// }

import React, { Component } from 'react';
import { OauthSender, OauthReceiver } from 'react-oauth-flow';
import axios from 'axios';
import ReactPlayer from 'react-player'

export default class GoogleSignIn extends Component {

    constructor(props) {
        super(props)
        this.state = {
            "buttons": []
        }
        this.token = ""
        this.handleSuccess = this.handleSuccess.bind(this)
        this.clicked = this.clicked.bind(this)
        this.getImageUrls = this.getImageUrls.bind(this)
        this.imageUrls = []
    }

    responseGoogle = (response) => {
        console.log(response);
    }

    clicked(event) {
        console.log("Clicked button")
        var album_id = event.target.value
        console.log(album_id)
        album_id = album_id.slice(1, album_id.length - 1)
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
                this.imageUrls.push(<div><br></br><ReactPlayer key={i} url={photos[i]["baseUrl"]+"=dv"} controls /></div>)
            }
        }
        if (nextPageToken == null) {
            var buttons = this.imageUrls
            this.setState({ buttons })
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

    handleSuccess(token) {
        this.props.callbackFromParent (token)
        // console.log(token)
        // this.token = token
        // const config = {
        //     headers: { Authorization: `Bearer ${token}` }
        // };


        // axios.get(
        //     'https://photoslibrary.googleapis.com/v1/albums',
        //     config
        // ).then(res => {
        //     var data = res.data
        //     var albums = data["albums"]
        //     var buttons = []
        //     for (var i = 0; i < albums.length; i++) {
        //         buttons.push(<button onClick={this.clicked} key={i} value={JSON.stringify(albums[i]["id"])} class="btn btn-secondary">{JSON.stringify(albums[i]["title"])}</button>)
        //     }
        //     // console.log(buttons)
        //     this.setState({ buttons })
        // });
    }

    render() {
        return (
            <div>
                <OauthSender
                    authorizeUrl="https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/photoslibrary.readonly&token_uri=https://oauth2.googleapis.com/token&redirect_uri=http://6fe4c09c2c51.ngrok.io/&client_id=367400578612-k233bl0bk76mb2pjlqnscaf0do7769r1.apps.googleusercontent.com"
                    response_type="token"
                    state={{ from: '/settings' }}
                    render={({ url }) => <a class="btn btn-primary" href={url}>Authorize API</a>}
                />

                <OauthReceiver
                    tokenUrl="https://oauth2.googleapis.com/token"
                    clientId="367400578612-k233bl0bk76mb2pjlqnscaf0do7769r1.apps.googleusercontent.com"
                    clientSecret="okGpeFEVOfEu8uu9Uhc9uPop"
                    redirectUri="http://6fe4c09c2c51.ngrok.io/"
                    onAuthSuccess={this.handleSuccess}
                    onAuthError={this.handleError}
                // render={({ processing, state, error }) => (
                //     <div>
                //         {processing && <p>Authorizing now...</p>}
                //         {error && (
                //             <p className="error">An error occured: {error.message}</p>
                //         )}
                //     </div>
                // )}
                />

                {this.state["buttons"]}

            </div>
        )
    }
}