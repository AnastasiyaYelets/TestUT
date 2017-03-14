import React, { Component, PropTypes } from 'react';
import {React_Boostrap_Carousel} from 'react-boostrap-carousel';
import webpush from 'web-push';

import Notification  from 'react-web-notification';
class SliderPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ignore: true,
      title: ''
    };
  }
  handlePermissionGranted(){
    console.log('Permission Granted');
    this.setState({
      ignore: false
    });
  }
  handlePermissionDenied(){
    console.log('Permission Denied');
    this.setState({
      ignore: true
    });
  }
  handleButtonClick() {
    if(this.state.ignore) {
      return;
    }
    const title = 'Test for UT';
    const options = {
    }
    this.setState({
      title: title,
      options: options
    });
  }
  render() {
    return (
      <div className="container-fluid">
        <div style={{height:300,margin:20}}   >
          <React_Boostrap_Carousel animation={true} id="carousel-example-generic" className="carousel-fade" >
            <div className='box' onClick={this.handleButtonClick.bind(this)}>
              <div>
              </div>
              <div className='content'>
                <div className="item active">
                  <div style={{height:300,width:"100%",backgroundColor:"green"}}>
                    <img src="src/img/4.jpg" alt = "i1" className="img-responsive center-block" style={{height:250,width:300, padding: 15}}/>
                  </div>
                  <div className="carousel-caption">
                    <h3>Raccoon Slider</h3>
                    <p>Three funny and cute raccoon photos.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='box' onClick={this.handleButtonClick.bind(this)} >
              <div className='content'>
                <div style={{height:300,width:"100%",backgroundColor:"green"}}>
                  <img src="src/img/2.jpg" alt = "i1" className="img-responsive center-block" style={{height:250,width:300, padding: 15}}/>
                </div>
              </div>
            </div>
            <div className='box' onClick={this.handleButtonClick.bind(this)}>
              <div className='content'>
                <div style={{height:300,width:"100%",backgroundColor:"green"}}>
                  <img src="src/img/3.jpg" alt = "i1" className="img-responsive center-block" style={{height:250,width:300, padding: 15}}/>
                </div>
              </div>
            </div>
          </React_Boostrap_Carousel>

          <Notification
            onPermissionGranted={this.handlePermissionGranted.bind(this)}
            onPermissionDenied={this.handlePermissionDenied.bind(this)}
            timeout={5000}
            title={this.state.title}
            options={this.state.options}
          />
        </div>
      </div>
    )
  };
};

export default SliderPage;
