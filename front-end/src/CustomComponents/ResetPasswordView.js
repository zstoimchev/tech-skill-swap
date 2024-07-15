import React from "react"

class ResetPasswordView extends React.Component {

    render() {
        return (
            <div className="card"
                 style={{
                     width: "400px",
                     marginLeft: "auto",
                     marginRight: "auto",
                     marginTop: "10px",
                     marginBottom: "10px"
                 }}>
                <div className="card-body">
                    <h5 className="card-title">Reset Password</h5>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="email" aria-describedby="emailHelp"/>
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default ResetPasswordView