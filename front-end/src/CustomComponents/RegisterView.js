import {Component} from "react";
import axios from 'axios'
import { API_URL } from "../Utils/Configuration";
import {REGISTER} from "../Utils/Constants";
/**
 * The SignupView component provides a form for users to sign up.
 *
 * @class SignupView
 * @extends {React.Component}
 */
class SignupView extends Component{
    // TODO: change this implementation to match your use case.
    constructor(props){
        super(props);
        this.state={
            user:{
                type:REGISTER
            }
        }
    }

    QPostSignup=()=>{
        // TODO: you should validate the data before sending it to the server,
        axios.post(API_URL + '/users/register',{
            username:this.state.user.username,
            email:this.state.user.email,
            password:this.state.user.password
        })
            .then(response=>{
                // TODO: implement encryption for the password and handle bad responses
                console.log("Sent to server...")
            })
            .catch(err=>{
                console.log(err)
            })
    }

    QGetTextFromField=(e)=>{
        this.setState(prevState=>({
            user:{...prevState.user,[e.target.name]:e.target.value}
        }))
    }

    render(){
        console.log(this.state.user)
        return(
            <div className="card"
                 style={{width:"400px", marginLeft:"auto", marginRight:"auto", marginTop:"10px", marginBottom:"10px"}}>
                <form style={{margin:"20px"}} >
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input name="username"
                               onChange={(e)=>this.QGetTextFromField(e)}
                               type="text"
                               className="form-control"
                               id="exampleInputEmail1"
                               aria-describedby="emailHelp"/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input name="email"
                               onChange={(e)=>this.QGetTextFromField(e)}
                               type="email"
                               className="form-control"
                               id="exampleInputEmail1"
                               aria-describedby="emailHelp"/>
                        <div id="emailHelp"
                             className="form-text">We`&apos;`ll never share your email with anyone else.
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input name="password"
                               onChange={(e)=>this.QGetTextFromField(e)}
                               type="password"
                               className="form-control"
                               id="exampleInputPassword1"/>
                    </div>
                </form>
                <button style={{margin:"10px"}}
                        onClick={()=>this.QPostSignup()}
                        className="btn btn-primary bt">Submit</button>
            </div>
        )
    }
}

export default SignupView
