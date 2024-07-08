import React from "react";
import axios from "axios";
import {API_URL} from "../Utils/Configuration";

const api = axios.create({
    baseURL: API_URL, withCredentials: true, // enable credentials
});

class PostsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Posts: []
        }
    }

    componentDidMount() {
        api.get('/posts')
            .then(response => {
                if (Array.isArray(response.data)) {
                    this.setState({
                        Posts: response.data
                    });
                } else {
                    console.error(response.data.msg);
                }
            })
    }

    render() {
        const data = this.state.Posts
        return (<div className="row row-cols-1 row-cols-md-3 g-4" style={{margin: "10px"}}>
            {data.length > 0 ? data.map((d) => {
                return (<div className="col" key={d.id}>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">{d.title}</h5>
                            <p className="card-text">{d.body}</p>
                        </div>
                    </div>
                </div>)
            }) : "error not loading da ti ebam pleme majcino da ti ebam klenceno..."}

        </div>)
    }
}

export default PostsView