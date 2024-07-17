import React from "react";
import axios from "axios";
import {API_URL} from "../Utils/Configuration";
import {POST} from "../Utils/Constants";

class PostsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Posts: []
        }
    }

    componentDidMount() {
        axios.get(API_URL + '/posts')
            .then(response => {
                if (Array.isArray(response.data.arr)) {
                    this.setState({
                        Posts: response.data.arr
                    });
                } else {
                    console.error(response.data.msg);
                }
            })
            .catch(error => {
                // Handle the error here
                console.error("---------- An error occurred while fetching posts ----------")
                console.log(error)
            });
    }


    render() {
        const data = this.state.Posts
        return (<div>
            <h1>Here goes some search bar. SEARCH BAR</h1>
            <div className="row row-cols-1 row-cols-md-3 g-4" style={{margin: "10px"}}>
                {data.length > 0 ? data.map((d) => {
                    return (<div className="col" key={d.id}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{d.title}</h5>
                                <p style={{height: "5rem", overflow: "hidden"}}
                                   className="card-text">{d.body}</p>
                                <p className="card-text">
                                    Author: {d.name} {d.surname}<br/>
                                    Date: {d.created_at}
                                </p>
                            </div>
                            <button onClick={() => this.props.changeState({CurrentPage: POST, id: d.id})}
                                    style={{margin: "10px"}} className="btn btn-primary bt">Read more
                            </button>
                        </div>
                    </div>)
                }) : "Loading..."}
            </div>

        </div>)
    }

}

export default PostsView