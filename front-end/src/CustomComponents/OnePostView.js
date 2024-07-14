import React from "react";
// import PropTypes from 'prop-types';
import axios from 'axios'
import {API_URL} from "../Utils/Configuration";
import {POSTS} from "../Utils/Constants";

class OnePostView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {}
        }
    }

    componentDidMount() {
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
                } else {
                    console.log("No post data received");
                }
            })
            .catch(error => {
                console.error("Error fetching post data: ", error);
            })

    }

    render() {
        let post = this.state.post
        return (<div className="card" style={{margin: "10px"}}>
            {Object.keys(post).length !== 0 ? <div>
                <h5 className="card-header">{post.title}</h5>
                <div className="card-body">
                    <h5 className="card-title">{post.body}</h5>
                    {/*<img className="img-fluid" src={API_URL+"/"+post.file} alt={""}></img>*/}
                    <p>Here goes image if existent</p>
                    <button onClick={() => this.props.changeState({CurrentPage: POSTS})}
                            className="btn btn-primary">Return news
                    </button>
                </div>
            </div> : "Loading..."}
        </div>)
    }
}

// SingleNovicaView.propTypes = {
//     QIDFromChild: PropTypes.func.isRequired,
//     data: PropTypes.number.isRequired
// }

export default OnePostView