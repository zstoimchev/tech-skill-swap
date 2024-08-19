import React from "react";

class AboutView extends React.Component {

    render() {
        return (<div className="card"
                     style={{margin: "10px"}}>
            <div className="card-body">
                <h4 className="card-title">About Tech Skill Swap</h4>
                <p className="card-text">Welcome to Tech Skill Swap, a unique platform designed to foster a
                    community of learning, sharing, and problem-solving. To get started, you'll need to create an
                    account. Don't worry, it's a simple process!</p>

                <p className="card-text">First, you'll need to choose a username. Usernames can contain letters,
                    numbers, and special characters. Once you've chosen a username, you'll need to create a
                    password. We recommend using a mix of uppercase and lowercase letters, numbers, and symbols to
                    ensure your password is strong.</p>

                <p className="card-text">After creating your account, you'll need to verify your email address. This
                    is a crucial step to ensure the security of your account. And don't worry, if you ever forget
                    your password, we have a "forgot password" option to help you recover your account.</p>

                <p className="card-text">Once your account is set up, you're ready to start swapping skills! Whether
                    you're a student struggling with a technical issue or a problem-solving enthusiast, Tech Skill
                    Swap is the place for you. Post your problem or offer your skills, and let's make tech less
                    daunting, one problem at a time!</p>
            </div>
        </div>)
    }
}

export default AboutView