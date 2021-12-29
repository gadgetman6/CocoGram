import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, InputGroup, FormControl } from "react-bootstrap"

export default class Navbar extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    console.log(e.target.value)
  }

  render() {

    return (
      <nav class="navbar navbar-expand-md navbar-dark bg-dark">
        <div class="mx-auto order-0">
          <a class="navbar-brand mx-auto" href="#">CocoGram</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
        <div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
          <ul class="navbar-nav ml-auto">
            <form class="form-inline">
              <div class="form-group">
                <label for="staticEmail2" class="sr-only">Email</label>
                <input type="email" class="form-control" placeholder="Email address"></input>
              </div>
              <div class="form-group mx-sm-3">
                <label for="inputPassword2" class="sr-only">Password</label>
                <input type="password" class="form-control" id="inputPassword2" placeholder="Password"></input>
              </div>
              <button type="submit" class="btn btn-primary">Login</button>
            </form>
            {/* <li class="nav-item">
                  <div class="form-group mb-2">
                    <input type="email" class="form-control" placeholder="Enter email"></input>
                  </div>
                </li>
                <li class="nav-item">
                  <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword" placeholder="Password"></input>
                  </div>
                </li>
                <li class="nav-item">
                  <button class="btn btn-primary ml-0" onClick={this.handleSubmit}>Submit</button>
                </li> */}
          </ul>
        </div>
      </nav>
    );
  }
}