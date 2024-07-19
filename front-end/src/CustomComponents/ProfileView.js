import React from "react";
import axios from "axios";
import {API_URL} from "../Utils/Configuration";
import {POST} from "../Utils/Constants";

class ProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Posts: [], User: null, username: localStorage.getItem("user"),
        }
    }

    componentDidMount() {
        axios.get(API_URL + '/profile/' + this.state.username)
            .then(response => {
                this.setState({Posts: response.data.postsData, User: response.data.userData});
            })
            .catch(error => {
                console.error("caught error")
                console.log(error)
            });
    }


    render() {
        const p = this.state.Posts
        if (this.state.User === null) {
            return <div>Loading...</div>;  // Or some other placeholder content
        }

        return (<div className="card" style={{margin: "10px"}}>
            <div className="card-body">
                <h3 className="card-title"><b>{this.state.User.name} {this.state.User.surname}</b></h3>
                <p className={"card-text"}>Email: {this.state.User.email} <br/>
                    Username: {this.state.User.username} <br/>
                    Change your password</p>
                <h5 className={"card-header"}>Everything you have posted so far (posts for requesting or seeking help of
                    any kind):</h5>
                <div className="row row-cols-1 g-4" style={{margin: "10px"}}>
                    {p.length > 0 ? p.map((d) => {
                        return (<div className="col" key={d.id}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{d.title}</h5>
                                    <p className="card-text">{d.body}</p>
                                </div>

                            </div>
                            <button onClick={() => this.props.changeState({CurrentPage: POST, id: d.id})}
                                    style={{margin: "10px"}} className="btn btn-primary bt">Read more
                            </button>
                        </div>)
                    }) : "Loading..."}
                </div>


            </div>
        </div>)
    }

}

export default ProfileView