import React, { Component } from "react";
import PageNavigation from "../common/PageNavigation";
import SurveyContext from "../../context/SurveyContext";
import StringBlock from "./../common/StringBlock";

const exampleStrs = [
  {
    string: "dpdddddppddp",
    top: [1, 0, 2, 0, 2, 0, 1, 1, 1, 2, 1, 0],
    bottom: [1, 1, 1, 2, 0, 1, 2, 0, 1, 2, 1, 2]
  },
  {
    string: "ddd",
    top: [1, 0, 2],
    bottom: [1, 2, 0]
  }
];

class Task2Instructions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime: null,
      endTime: null,
      duration: null
    };

    this.saveResults = this.saveResults.bind(this);
  }

  componentDidMount() {
    this.setState({
      startTime: new Date()
    });
  }

  async saveResults() {
    const endTime = new Date();
    const duration = (endTime - this.state.startTime) / 1000;

    return new Promise((resolve, reject) => {
      this.setState(
        {
          startTime: this.state.startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration
        },
        async () => {
          await this.context.addUserResponse("task2-instructions", this.state);
          resolve();
        }
      );
    });
  }

  render() {
    return (
      <div>
        <h2>Instructions for Task 2:</h2>

        <p>
          In this task, you will be presented with <strong>50</strong> strings of p's and d's with
          apostrophes written above and below each letter. For example:
        </p>

        <StringBlock
          string={exampleStrs[0].string}
          top={exampleStrs[0].top}
          bottom={exampleStrs[0].bottom}
        />

        <p>
          Your task will be to count all the{" "}
          <strong>d's with a total of 2 apostrophes</strong>. In other words,
          your task will be to count the following:
        </p>

        <StringBlock
          string={exampleStrs[1].string}
          top={exampleStrs[1].top}
          bottom={exampleStrs[1].bottom}
        />

        <p>
          Work as quickly and as accurately as you can. Type in your response
          using the keys labeled 4 through 7 on the keyboard.
        </p>
      
        <p>
          Remember you will see 50 strings of p's and d's. Counting the apostrophes for each string does not
          take very long, so while there are 50 strings, the task is relatively quick. 
        </p>
      
        <p>If you are ready to begin, click next.</p>

        <PageNavigation beforeNavigate={this.saveResults} to="/task/2/quiz" />
      </div>
    );
  }
}

Task2Instructions.contextType = SurveyContext;

export default Task2Instructions;
