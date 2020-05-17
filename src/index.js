import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import allWords from "./words.js"



  var words = allWords;




class LanguageButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <button onClick={this.props.click} >{true ? "Switch languages" : "t2" } </button>
  }
}


class Correction extends React.Component {
  render() {

    return <p
      id="correction"
      style={{ visibility: this.props.show ? "visible" : "hidden" } }
    >
      {this.props.text}
    </p>
  }
}

class Checker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      base: 0 ,
      input:"",
      isDone:false,
      failedAttempt:false,
      correctCount: 0,
      failCount: 0,
      wrongWords: [],
      langA: 1, // 0 or 1
      langB: () => 1 - this.state.langA


    }
  }

  //När användaren trycker submit
  handleClick = () => {

    if(! (this.state.isDone  )){

      let correct = this.state.input === words[this.state.base][this.state.langB()]
      //Om ordet är korrekt och det är första försöket.
      if(!this.state.failedAttempt && correct){
        this.state.correctCount += 1;
      }else if(!this.state.failedAttempt){
        this.state.failCount += 1;
        this.state.wrongWords.push( words[this.state.base] )
      }

      this.setState({failedAttempt:!correct})

      if(correct){

        this.setState({input:""})
        if(this.state.base + 1 < words.length){
          this.setState({base:this.state.base + 1})
        }else{
          this.setState({isDone:true})
        }

      }
    }
  }

  ifEnter = (event) => {
    if(event.key === 'Enter'){
      this.handleClick()
    }
  }

  updateInputValue = (evt) => {
    this.setState({
      input: evt.target.value
    });
  }

  retry = () => {
    this.setState({base:0})
    this.setState({isDone:false})
    this.setState({failedAttempt:false})

    words = this.state.wrongWords
    this.state.wrongWords = []
    this.state.correctCount = 0
    this.state.failCount = 0
  }

  restart = () => {
    this.setState({base:0})
    this.setState({isDone:false})
    this.setState({failedAttempt:false})
    words = allWords
    this.state.wrongWords = []
    this.state.correctCount = 0
    this.state.failCount = 0
  }


  switchLang = () => {
    this.setState({langA:1-this.state.langA})
    console.log(this.state.langA)
  }


  render() {
    let array = [];
    this.state.wrongWords.forEach((item, i) => {
      array.push(<li key={i}>{item.join(" - ")}</li>);
    });

    //Visa resultat-rutan?
    let display = "block"
    let correctD = "block"
    let result = "Try again?"
    let showMe = this.state.failCount + this.state.correctCount  >= words.length

    if(this.state.failCount + this.state.correctCount  < words.length){
      display = "none"
    }

    if(this.state.failCount === 0) {
      correctD = "none"
      result = "Nice! You got everything right! :D"
    }

    return (
      <div id="upper">
        <div id="quiz">

          <h1>Translate from {this.state.langA === 1 ? "English":"Swedish"} to {this.state.langA === 0 ? "English":"Swedish"}</h1>
          <LanguageButton click={this.switchLang}/>
          <p>Correct: {this.state.correctCount}, Failed: {this.state.failCount}, Total: {words.length}</p>

           <Correction
              text={words[this.state.base][this.state.langB()]}
              show = {this.state.failedAttempt}
            />


          <label > {words[this.state.base][this.state.langA]} = </label>

          <input value={this.state.input} onChange={this.updateInputValue} onKeyPress={this.ifEnter}/>
          <br/>
          <input type="submit" onClick={this.handleClick} value="Test!"/>
        </div>


        {showMe && <div id="result" >
          <h3>Quiz ended. {this.state.correctCount}/{words.length} - {result} </h3>

          <input type = "button" value="Retry wrong words" style={{display:correctD}} onClick={this.retry}/>
          <input type = "button" value="Restart" onClick={this.restart}/>
          <h4 style={{display:correctD}}>The following words were wrong: </h4>
          <div id="wrongWords" style={{display:correctD}}>{array}</div>

        </div>}

      </div>

    );
  }
}

ReactDOM.render(
  <Checker />,
  document.getElementById('root')
);
