import React from "react";

class TechNews extends React.Component {

    render() {
        return (<div className="card"
                     style={{margin: "10px"}}>
            <div className="card-body">
                <h4 className="card-title">Tech news scraped from TechRadar</h4>
                <p className="card-text">Wii</p>
            </div>
        </div>)
    }
}

export default TechNews