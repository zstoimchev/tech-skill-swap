import React from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import { API_URL } from "../Utils/Configuration";

class PostsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Posts: []
        }
    }

    SetViewInParent = (obj) => {
        console.log(obj)
        this.props.IDFromChild(obj)
    }

    componentDidMount() {
        axios.get(API_URL + '/posts')
            .then(response => {
                console.log(response.data)
                this.setState({
                    Posts: response.data
                })
            })
    }

    render() {
        const data = this.state.Posts
        return (
            <div className="row row-cols-1 row-cols-md-3 g-4" style={{ margin: "10px" }}>
                {data.length > 0 ?
                    data.map((d) => {
                        return (
                            <div className="col" key={d.id}>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{d.title}</h5>
                                        <p className="card-text">{d.body}</p>
                                    </div>
                                    {/*<button onClick={() => this.QSetViewInParent({ page: "novica", id: d.id })}*/}
                                    {/*        style={{ margin: "10px" }} className="btn btn-primary bt">Read more</button>*/}
                                </div>
                            </div>
                        )
                    })
                    : "Loading..."}

            </div>
        )
    }
}

export default PostsView