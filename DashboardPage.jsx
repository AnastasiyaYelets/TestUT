import React, { Component } from 'react';
import { Link } from 'react-router';
import firebase from 'firebase';
import TranscationsPage from './TranscationsPage';
import Modal from 'react-modal';
import moment from 'moment';
import Rating from 'react-rating';
import ItemsTable from './ItemsTable';


class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showReviews: false,
      userReviews: [],
      itemsReviews: [],
      reviewFilter: 'user',
      areUserReviews: true,
      areItemReviews: true,
      starredItems: [],
      starredLoaded: false,
    };
  }
  componentWillMount() {
    const { user } = this.props;
    this.fetchReviews(user.uid);
    this.fetchStarredItems(user.starred);
  }

  fetchReviews(id) {
    this.setState({userReviews: [], itemsReviews: []});
    firebase.database().ref('reviews')
    .orderByChild('subject')
    .equalTo(`${id}`)
    .once('value', snapshot => {
      const object = snapshot.val();
      if (object !== null) {
        const keys = Object.keys(object);
        this.setState({areUserReviews: keys.length});
        const userReviews = keys.map(key => object[key]);
        let reviewsWithUsername = [];
        userReviews.map(review => {
          firebase.database().ref('users/' + review.reviewer)
          .once('value', snapshot => {
            const object2 = snapshot.val();
            if (object2 !== null) {
              reviewsWithUsername.push({
                ...review,
                username: object2.username,
              });
            } else {
              reviewsWithUsername.push(review);
            }
          });
        });
        this.setState({userReviews: reviewsWithUsername});
      } else {
        this.setState({areUserReviews: false});
      }
    });

    firebase.database().ref('reviews')
    .orderByChild('itemOwner')
    .equalTo(`${id}`)
    .once('value', snapshot => {
      const object = snapshot.val();
      if (object !== null) {
        const keys = Object.keys(object);
        this.setState({areItemReviews: keys.length});
        const itemsReviews = keys.map(key => object[key]);
        let reviewsWithUsername = [];
        itemsReviews.map(review => {
          firebase.database().ref('users/' + review.reviewer)
          .once('value', snapshot => {
            const object2 = snapshot.val();
            if (object2 !== null) {
              reviewsWithUsername.push({
                ...review,
                username: object2.username,
              });
            } else {
              reviewsWithUsername.push(review);
            }
          });
        });
        this.setState({itemsReviews: reviewsWithUsername});
      } else {
        this.setState({areItemReviews: false});
      }
    });
  }

  calculateAverage(arr1, arr2) {
    const fields = ['cleaniness', 'condition', 'communication', 'overallExp', 'timeliness'];
    const reviews = [...arr1, ...arr2];
    if (!reviews.length) {
      return 'N/A';
    }
    let a = 0;
    reviews.forEach(review => {
      let b = 0;
      const keys = Object.keys(review).filter(key => fields.includes(key));
      keys.forEach(key => {
        b += review[key];
      });
      a += b / keys.length;
    });
    return Math.floor( a * 10 / reviews.length ) / 10;
  }

  fetchStarredItems(starred) {
    this.setState({
      starredItems: [],
      starredLoaded: false,
    });
    if (starred) {
      const keys = Object.keys(starred);
      const promises = keys.map((id, i) => {
        return firebase.database().ref('items/' + id).once('value').then(snapshot => {
          const object = snapshot.val();
          if (object !== null) {
            return firebase.database().ref('users/' + object.owner).once('value').then(snapshot => {
              const owner = snapshot.val();
              return (
                {
                  ...object,
                  username: owner.username,
                  avatar: owner.avatar
                }
              )
            });
          }
        })
      });
      Promise.all(promises).then(result => {
        const starredItems = result.filter(item => item !== undefined);
        this.setState({starredItems});
      });
    }
    this.setState({starredLoaded: true});
  }

  render () {
    const { showReviews, userReviews, itemsReviews, reviewFilter, areItemReviews, areUserReviews, starredLoaded, starredItems } = this.state;
    const { user, params, transactions, borrowerTransactionsFetched  } = this.props;
    const reviewsToDisplay = reviewFilter === 'user' ? userReviews : itemsReviews;
    const areReviewsFetched = (areItemReviews == itemsReviews.length) && (areUserReviews == userReviews.length);
    return (
      <div className="page">
        <div  className="dashboard__nav">
            <div className="col-4 userEdit left">
        <ul>
          <li>
            <Link to={`/school/${user.school}/${user.username}`}>
              <h3>@{user.username}</h3>
            </Link>
          </li>
          <li>
            <a onClick={() => this.setState({showReviews: true})}>
              <div className="">
                <span className="align-center">
               [{areReviewsFetched ? this.calculateAverage(userReviews,itemsReviews) : '...'}]
                </span>
              </div>
            </a>
          </li>
          <li>  Total: ${user.balance.total} </li>
          <li>  Available: ${user.balance.available}  -  <Link to="/deposit">Deposit</Link>       <span className="mid"> · </span>  <Link to="/withdraw">Withdraw</Link>    </li>
          <li className="left" >Edit -
            <Link to='/edit/profile'> Profile </Link>   <span className="mid"> · </span>
            <Link to={{pathname: '/setup/payment', state: {return: '/dashboard'}}}>
              Payment </Link>    <span className="mid"> · </span>
            <Link to="/dresser">
              <span className="align-center">
                Items
              </span>
            </Link>
          </li>
          <br />
          <li className="left" >
            <Link to="/refer"> Referrals </Link>
          </li>
          <div className="clearfix"></div>
          <li >
           <a onClick={() => firebase.auth().signOut()}>Sign Out <i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i>
           </a>
         </li>
      </ul></div>
      <div className="col-8 translist left">
        <TranscationsPage user={user} filter={params.filter} transactions={transactions} />
        <div className="clearfix"></div>
      </div>
    </div>
        <Modal
          isOpen={showReviews}
          onRequestClose={() => this.setState({showReviews: false})}
          contentLabel="Modal"
        >
          <div>
            <a
              onClick={() => this.setState({reviewFilter: 'user'})}
              style={{fontWeight: `${reviewFilter === 'user' ? 'bold' : 'normal'}`}}
            >
              Show reviews about me
            </a>
            <span> / </span>
            <a
              onClick={() => this.setState({reviewFilter: 'items'})}
              style={{fontWeight: `${reviewFilter === 'items' ? 'bold' : 'normal'}`}}
            >
              Show reviews about my items
            </a>
          </div>
          <div>
            {!reviewsToDisplay.length && <span>No reviews yet</span>}
            {!!reviewsToDisplay.length && reviewsToDisplay.map((review, i) => {
              if (reviewFilter === 'user') {
                return (
                  <div key={i}>
                    <Link to={`/school/${user.school}/${review.username}`}>{review.username}</Link>
                    <span>Review date: {moment(review.timestamp).format('l')}</span>
                    <p>Timeliness</p>
                    <Rating initialRate={review.timeliness} readonly fractions={2} />
                    <p>Communication</p>
                    <Rating initialRate={review.communication} readonly fractions={2}/>
                    <p>Overall experience</p>
                    <Rating initialRate={review.overallExp} readonly fractions={2} />
                    <p>Comments</p>
                    <p>{review.review}</p>
                  </div>
                );
              } else {
                return (
                  <div key={i}>
                    <Link to={`/school/${user.school}/${review.username}`}>{review.username}</Link>
                    <span>Review date: {moment(review.timestamp).format('l')}</span>
                    <p>Cleaniness</p>
                    <Rating readonly initialRate={review.cleaniness} fractions={2} />
                    <p>Condition</p>
                    <Rating readonly initialRate={review.condition} fractions={2} />
                    <p>Rented for</p>
                    <p>{review.chosenOccasion}</p>
                    <p>Comments</p>
                    <p>{review.review}</p>
                  </div>
                );
              }
            })}
          </div>
          <button onClick={() => this.setState({showReviews: false})}>Close reviews</button>
        </Modal>

          <div className="col-12  left px2">
                  <hr />
          {starredItems.length && (
              <div className="col-12 left px2">
                 <h2 className="items-table__header_hearts">Your <i className="fa fa-heart red" aria-hidden="true"></i>
        s </h2>
          <div className="clearfix"></div>
                <ItemsTable
                  items={starredItems}
                  school={user.school}
                  user={user}
                  showingStarred={true}
                  transactions={transactions}
                  isDashboard={true}
                  params={params}
                  borrowerTransactionsFetched={borrowerTransactionsFetched}
                />
              </div>
            )}

          </div>
      </div>
    );
  }
}

export default DashboardPage;
