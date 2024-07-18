import React from "react"
import PropTypes from 'prop-types'
import axios from 'axios'
import {API_URL} from "../Utils/Configuration"
import {LOGIN, POST, POSTS} from "../Utils/Constants"
import './style.css'

class OnePostView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {}, comments: {}, user: {
                comment: "", username: localStorage.getItem("user"),
            }, status: {
                success: null, msg: ""
            },

        }
    }

    componentDidMount() {
        this.setState({id: this.props.id})
        axios.get(API_URL + "/posts/" + this.props.id, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                if (response.data.success && response.data.arr) {
                    this.setState({
                        post: response.data.arr
                    })
                    this.fetchComments()
                } else {
                    console.log("No post data received");
                }
            })
            .catch(error => {
                console.error(error.response.data);
                this.props.changeState({CurrentPage: LOGIN})
            })
    }

    Send() {
        axios.post(API_URL + "/posts/comment", {
            user: this.state.user.username, post_id: this.state.id, content: this.state.user.comment,
        })
            .then(response => {
                this.setState({status: response.data})
                console.log(response.data)
                this.fetchComments()
            })
            .catch(error => {
                console.error(error.response.data);
                // this.props.changeState({CurrentPage: LOGIN})
            })
    }

    fetchComments() {
        axios.get(API_URL + "/posts/comment/" + this.state.id, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                if (response.data.success && response.data.arr) {
                    this.setState({
                        comments: response.data.arr
                    })
                } else {
                    console.log("No comments data received");
                }
            })
            .catch(error => {
                console.error(error.response.data);
            })
    }

    SetValueFromUserInput = (e) => {
        this.setState(prevState => ({
            user: {...prevState.user, [e.target.id]: e.target.value}
        }))
    }

    render() {
        let post = this.state.post
        const comments = this.state.comments
        return (<div className="card" style={{margin: "10px"}}>
            {Object.keys(post).length !== 0 ? <div>
                <h5 className="card-header">{post.title}</h5>
                <div className="card-body">
                    <h5 className="card-title">Category: </h5>
                    <p className="card-title">{post.body}</p>
                    {/*<img className="img-fluid" src={API_URL + "/" + post.image} alt={"image"}></img>*/}
                    <img className="img-fluid my-custom-image" src={API_URL + "/" + post.image} alt={""}></img>

                    <button onClick={() => this.props.changeState({CurrentPage: POSTS})}
                            className="btn btn-primary">Return news
                    </button>
                </div>

                <hr/>
                <div className="card-body" style={{paddingTop: "0px"}}>
                <h5 style={{marginBottom: "10px"}}>Leave a comment:</h5>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <input id="comment" type="text" className="form-control" placeholder="Enter your comment here"
                               style={{marginRight: "10px", flex: "1"}} onChange={this.SetValueFromUserInput}/>
                        <button className="btn btn-primary" onClick={() => this.Send()}>Post</button>
                    </div>
                </div>
                <hr/>
                <div className="card-body" style={{paddingTop: "0px"}}>
                    <h5>Other comments:</h5>
                    {comments.length > 0 ? comments.map((d) => {
                        return (<p key={d.id}><b>{d.username}</b>: {d.content} - <i>{d.date}</i></p>)
                    }) : "There are no comments yet..."}
                </div>

            </div> : "Loading..."}
        </div>)
    }
}

OnePostView.propTypes = {
    changeState: PropTypes.func.isRequired, id: PropTypes.number.isRequired
}

export default OnePostView