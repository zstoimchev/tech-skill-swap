import React from "react";
import axios from "axios";
import {API_URL} from "../Utils/Configuration";
import {POST} from "../Utils/Constants";

class ProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Posts: []
        }
    }

    componentDidMount() {
        axios.get(API_URL + '/profile')
            .then(response => {
                console.log("received")
            })
            .catch(error => {
                console.error("caught error")
            });
    }


    render() {
        return (
            <div className="profile">
                <p>ferafrgfeg</p>
            </div>
        )
    }

}

export default ProfileView