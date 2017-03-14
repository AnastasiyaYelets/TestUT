import React, { Component } from 'react';
import {connect } from 'react-redux';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';


class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      result: []
    };
  };
  render () {
    let result = this.state.result;
    let count;
    const listResilt = result.map((item) =>
    <li key={item.toString()}>
      {item}
    </li>
    );
    return (
      <div className="container">
        <ul className="nav nav-pills">
          <li role="presentation" className="active"><a href="/">Counter</a></li>
          <li role="presentation"><a href="/quotient">Quotient</a></li>
          <li role="presentation"><a href="/slider">Slider</a></li>
        </ul>
        <div className="row">
          <div className="media1">
            <h3>Counter</h3>
            <button
              type="button"
              className="btn btn-success lg"
              onClick={() => {
                count = this.state.count+1;
                result = [ count, ...this.state.result];
                this.setState({
                  count,
                  result
                });
              }}
              >Add 1</button>
            </div>
            <div className="media1">
              <h3>Result</h3>
              <ul className="list-unstyled columnNum">
                {listResilt}
              </ul>
            </div>
          </div>
        </div>
      );
    };
  };
  export default Counter;
