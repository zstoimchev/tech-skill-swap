import React from "react";
import fixing_laptop from "../assets/img/fixing_laptop.jpg";

class HomeView extends React.Component {
    render() {
        return (<div className="card" style={{margin: "10px"}}>
            <div className="card-body">
                <h4 className="card-title">Welcome to Tech Skill Swap, a place where you can offer and receive
                    help!</h4>
                <p className="card-text">Welcome to Tech Skill Swap, a unique platform designed to foster a community of
                    learning, sharing, and problem-solving.</p>

                <p className="card-text">Are you a student struggling with a technical issue? Or perhaps you’re someone
                    with a knack for
                    solving problems? Tech Skill Swap is the place for you! Here, we believe in the power of collective
                    knowledge and the spirit of helping each other.</p>

                <p className="card-text">Our platform allows users to post any technical problems they are facing,
                    whether it’s a bug in your
                    code, a hardware issue with your laptop, or a concept you’re finding hard to grasp. No problem is
                    too big or too small!</p>

                <p className="card-text">But that’s not all. Tech Skill Swap is also a place for those who love to solve
                    problems. If you’re
                    someone who enjoys the thrill of cracking a tough problem or if you’re skilled in a particular area,
                    you can offer your help to others. You can choose to help for free, fostering a spirit of community
                    and learning. Or, if you prefer, you can offer your help for a small fee, making our platform a
                    great way for students to earn a little extra while doing what they love.</p>

                <p className="card-text">At Tech Skill Swap, we believe that everyone has something to learn, and
                    everyone has something to
                    teach. So why wait? Join us today, post your problem, or offer your skills. Let’s swap skills and
                    make tech less daunting, one problem at a time! </p>
                <img src={fixing_laptop} alt="your_alternative_text_here"/>

            </div>
        </div>)
    }
}

export default HomeView
