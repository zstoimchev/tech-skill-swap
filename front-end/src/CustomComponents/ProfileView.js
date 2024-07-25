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
                this.setState({Posts: response.data.postData, User: response.data.userData});
            })
            .catch(error => {
                console.error("caught error")
                console.log(error)
            })
    }


    render() {
        const p = this.state.Posts
        if (this.state.User === null) {
            return <div>Loading...</div>
        }

        return (<div className="card" style={{margin: "10px"}}>
            <div className="card-body">

                <div className={"d-flex align-items-center"}>
                    <h2 className="card-title"><b>{this.state.User.name} {this.state.User.surname}</b></h2>
                    <button className={"btn btn-primary btn-md ms-auto"}>Edit Name/Surname</button>
                </div>
                <hr/>

                <div className={"d-flex align-items-center"}>
                    <h5>Email: <i>{this.state.User.email}</i></h5>
                    <button className={"btn btn-primary btn-sm ms-auto"}>Update E-mail</button>
                </div>

                <div className={"d-flex align-items-center"}>
                    <h5>Username: <i>{this.state.User.username}</i></h5>
                    <button className={"btn btn-primary btn-sm ms-auto"}>Edit username</button>
                </div>

                <div className={"d-flex align-items-center"}>
                    <h5>Role: <i>Seeker or Helper</i></h5>
                </div>

                <h5>Change your password, click here</h5>
                <hr/>

                <div className="row row-cols-1 g-4" style={{margin: "10px"}}>
                    <h4 className={"card-title"} style={{fontWeight:"bold"}}>All posts asking/requesting for help:</h4>    {p.length > 0 ? p.map((d) => {
                    return (<div className="col" key={d.id}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{d.title}</h5>
                                <p className="card-text">{d.body}</p>
                            </div>
                            <button onClick={() => this.props.changeState({CurrentPage: POST, id: d.id})}
                                    style={{margin: "10px"}} className="btn btn-primary bt">Read more
                            </button>
                        </div>

                    </div>)
                }) : "No help requested yet"}
                </div>


            </div>
        </div>)
    }

}

export default ProfileView