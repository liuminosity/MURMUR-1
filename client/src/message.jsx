var React = require('react');
var moment = require('moment');
var CommentBox = require('./commentBox');
var CommentMessage = require('./commentMessage');

// var url = 'http://0.0.0.0:3000/';

var Message = React.createClass({

  getInitialState: function() {
    return {
      commentsView: false
    };
  },

  toggleCommentsView: function(){
    this.setState({ commentsView: !this.state.commentsView })
  },

  // Post upvote data to Server
  upVote: function(event){
    var messageId = $(event.target).closest('.jumbotron').attr('id');
    $.ajax({
      type: 'POST',
      url: 'vote' ,
      contentType: 'application/json',
      data: JSON.stringify({
        "id": this.props.id,
        "messageId": messageId,
        "vote": true
      }),
      success: function(){
      }
    });
  },

  // Post downvote data to Server
  downVote: function(event){
    console.log("roooooooooom",this.props.id);
    var messageId = $(event.target).closest('.jumbotron').attr('id');
    $.ajax({
      type: 'POST',
      url: 'vote' ,
      contentType: 'application/json',
      data: JSON.stringify({
        "id": this.props.id,
        "messageId": messageId,
        "vote": false
      }),
      success: function(){
      }
    });
  },

  toggleFavorite: function(event){

    var messageId = $(event.target).closest('.jumbotron').attr('id');
    $.ajax({
      type: 'POST',
      url: 'favorite' ,
      contentType: 'application/json',
      data: JSON.stringify({
        "id": this.props.id,
        "messageId": messageId
      }),
      success: function(){
      }
    });
  },

  componentDidMount: function () {
    var component = this;
    setTimeout(function () {
        component.setState({
          commentsView: false,
        });
    });
  },

  render: function() {

    var commentRows = [];
    if(this.props.comments.length !== 0){
      for(commentKey in this.props.comments){
        var comments = this.props.comments[commentKey];
        commentRows.push(
          <CommentMessage
            id={ this.props.id }
            messageId={ this.props.messageId }
            commentId={ comments.commentId }
            commentMessage={ comments.comment }
            commentVotes={ comments.votes }
            commentTimestamp={ comments.timestamp } />
        );
      }
    }

    var commentRowsSortedOptions = {
      recent: commentRows.slice().sort(function(a,b){
        return b.props.commentTimestamp - a.props.commentTimestamp;
      }),
      popular: commentRows.slice().sort(function(a,b){
        return b.props.commentVotes - a.props.commentVotes;
      }),
    }

    var commentNumber = this.props.comments.length !== 0 ?
      Object.keys(this.props.comments).length :
      'no ';
                    // 119{ commentNumber } comments

    var styleFavorites =
      // check if the 'uid' favorited the message
      false ?
        {
          float: 'left',
          marginRight: '10px',
          fontSize: '1.85em',
          color: '#F12938' // red if favorited
        }
        :
        {
          float: 'left',
          marginRight: '10px',
          fontSize: '1.85em',
          color: '#a8aeb8', // if NOT favorited
          borderColor: 'green'
        };

    return (
      <div className="jumbotron" id={ this.props.messageId } style={{ borderRadius: '40px', paddingLeft: '0', paddingRight: '0', paddingTop: '15px', paddingBottom: '7px', backgroundColor: '#ECF0F5'}} >
        <div className="container">
          <div className="col-xs-10" style={{ marginBottom: '20px', paddingLeft:'10px', marginBottom: '0'}}>
            <p style={{fontFamily: 'Alegreya', color: 'chocolate', marginLeft: "10px", marginBottom: '0'}}>
              { this.props.message }
            </p>
          </div>
          <div className="votes col-xs-2" style={ this.styles.votes }>
            <div style={ this.styles.voteContainer }>
              <i className="glyphicon glyphicon-chevron-up" style={{color: "#0000FF"}} onClick={ this.upVote }></i>
              <span className="count" style={{fontFamily: 'Alegreya'}}> { this.props.votes } </span>
              <i className="glyphicon glyphicon-chevron-down" style={{color: "#0000FF"}} onClick={ this.downVote }></i>
            </div>
          </div>

          <div className="col-xs-12" style={{paddingLeft:'10px'}}>
            <div className="col-xs-1" style = { styleFavorites }>
              <span style={ {float: "left"} } onClick={ this.toggleFavorite }>
                <i className="glyphicon glyphicon-heart"></i>
              </span>
            </div>
            <div className="col-xs-2" style={ this.styles.timestamp }>
              <i className="glyphicon glyphicon-time" style={ this.styles.iconStyle }></i>
              <span style={{fontFamily:"Alegreya", fontStyle: "italic", fontSize: '.8em', position: 'relative', top: '-7px'}}>
                { moment(this.props.timestamp).fromNow() }
              </span>
            </div>
            <div style={ this.styles.comments }>
              <div className="commentViewToggle" onClick={ this.toggleCommentsView }>
                <i className="glyphicon glyphicon-comment" style={ this.styles.iconStyle }></i>
                <span style={{fontStyle: "italic", fontSize: '.8em'}}>
                  <span style={{fontFamily:"Alegreya", fontWeight: 'bold', color: 'blue', fontSize: '1.1em', position: 'relative', top: '-7px'}}> { this.state.commentsView ? 'hide ' : 'show ' } </span>
                  <span style={{fontFamily:"Alegreya", position: 'relative', top: '-7px'}}> { commentNumber + ' comments'} </span>
                </span>
              </div>
            </div>
          </div>

          <div style={ this.state.commentsView ? this.styles.commentsView : this.styles.hidden }>
            <CommentBox id={ this.props.id } messageId={ this.props.messageId } token={ this.props.token } auth={ this.props.auth }/>
            { commentRowsSortedOptions['recent'] }
          </div>

        </div>
      </div>
    )
  },

  styles: {
    timestamp: {
      float: "left"
    },
    comments: {
      float: "left"
    },
    votes: {
      fontSize: "19px",
      textAlign: 'center'
    },
    commentButton: {
      position: "relative",
      top: "-3px"
    },
    voteContainer: {
      width: "20px",
      float: "right"
    },
    iconStyle: {
      marginLeft: "20px",
      marginRight: "10px",
      fontSize: '1.85em',
      color: '#a8aeb8'
    },
    commentsView: {
      display: "block",
    },
    hidden: {
      display: "none",
    }
  }
});

module.exports = Message;