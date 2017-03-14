import React, { Component } from 'react';
import {connect } from 'react-redux';
import { Link } from 'react-router';
import { Input } from 'react-bootstrap';

class Quotient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      result: []
    };
    this.FooBar = this.FooBar.bind(this);
  };
  FooBar(count) {
    let i;
    let result = [];
    this.setState({count: count});
    for (i = 1; i <= count ; i++) {

      if (i % 2 == 0) {
        result.unshift("foo");
      };
      if (i % 3 == 0) {
        result.unshift("bar");
      };
      if ((i % 3 != 0) && (i % 2 != 0)) {
        result.unshift(i);
      };
    };
    this.setState({
      result
    });
  };
  render () {
    let result = this.state.result;
    let count;
    const listResult = this.state.result.map((item,i) =>
    <li key={i}>
      {item}
    </li>
  );

  return (
    <div className="container">
      <div className="row">
        <div className="media1">
          <h3>Number</h3>
          <div className="input-group input-group-lg">
            <form>
              <input
                type="Text"
                className="form-control"
                placeholder="Number"
                onChange= {(e) =>  this.FooBar(e.target.value)}
              />
            </form>
          </div>
        </div>
        <div className="media1">
          <h3>Result</h3>
          <ul className="list-unstyled columnNum">
            {listResult}
          </ul>
        </div>
      </div>
    </div>
  );
};
};
export default Quotient;
