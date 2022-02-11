class TimerLengthControl extends React.Component {
    render() {
        return (
            <div>

            </div>
        )
    }
}

class TimeControl extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id={this.props.generalID}>

                <button id={this.props.incrementID} onClick={this.props.onClick}>+</button>

                <div className="time-adjust" id={this.props.lengthID}>{this.props.displayTime}</div>

                <button id={this.props.decrementID} onClick={this.props.onClick}>-</button>

            </div>
        )
    }
}


class App extends React.Component {
    constructor(props) {
        super(props);

        this.setBreakLength = this.setBreakLength.bind(this);
        this.setSessionLength = this.setSessionLength.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.timerPlayback = this.timerPlayback.bind(this);
        this.toClock = this.toClock.bind(this);
        this.handleReset = this.handleReset.bind(this);
        //this.audioRef = React.createRef();

        this.state = {
            breakLength: 5,
            sessionLength: 25,
            currentTime: 1500,
            status: 'stop',
            timerType: 'Session',
            playSound: false,
            intervalID: 0
        }

    }
    
    setBreakLength(e) {
        this.setLength(
            'breakLength',
            e.target.innerHTML,
            this.state.breakLength,
            'Session'
        )
    }

    setSessionLength(e) {
        this.setLength(
            'sessionLength',
            e.target.innerHTML,
            this.state.sessionLength,
            'Break'
        )
    }

    setLength(stateToChange, sign, currentLength, timerType) {
        if (this.state.timerType === timerType) {
            if (sign === '-' && currentLength > 1) {
                this.setState({[stateToChange]: currentLength - 1})
            } else if (sign === '+' && currentLength < 60) {
                this.setState({[stateToChange]: currentLength + 1})
            }
        } else if (sign === '-' && currentLength > 1) {
            this.setState({
                [stateToChange]: currentLength - 1,
                currentTime: currentLength * 60 - 60
            });
        } else if (sign === '+' && currentLength < 60) {
            this.setState({
                [stateToChange]: currentLength + 1,
                currentTime: currentLength * 60 + 60
            });

        }
    }

    playSound() {
        console.log(this.state.alarmSound)
        this.state.alarmSound.play()
    }

    startTimer() {
        if (this.state.intervalID) {
            console.log('path1')
            console.log(this.state.intervalID)
            clearInterval(this.state.intervalID)
            this.setState({intervalID: 0})
        } else {
            const newIntervalID = setInterval(() => {
                if (this.state.currentTime >  0) {
                    this.setState({
                        intervalID: newIntervalID,
                        currentTime: this.state.currentTime - 1
                    })
                } else if (this.state.currentTime === 0 && this.state.timerType === 'Session') {
                    this.setState({
                        currentTime: this.state.breakLength * 60,
                        timerType: 'Break',
                        //playSound: true
                    })
                    this.refs.audioRef.play()
                } else if (this.state.currentTime === 0 && this.state.timerType === 'Break') {
                    this.setState({
                        currentTime: this.state.sessionLength * 60,
                        timerType: 'Session',
                        //playSound: true
                    })
                    this.refs.audioRef.play()
                }
            }, 1000)
            console.log('path2')
            this.setState({intervalID: newIntervalID})
            console.log(this.state.intervalID)
        }

        
        
        
    }

    timerPlayback() {        
        this.startTimer()
    }

    toClock() {
        let minutes = Math.floor(this.state.currentTime / 60);
        let seconds = this.state.currentTime - minutes * 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return minutes + ':' + seconds; 
    }

    handleReset() {
        if (this.state.intervalID) {
            clearInterval(this.state.intervalID)
        }
        this.setState( {
            intervalID: 0,
            timerType: 'Session',
            breakLength: 5,
            sessionLength: 25,
            currentTime: 1500,
        } )
        this.refs.audioRef.pause();
        this.refs.audioRef.currentTime = 0;
    }
    

    render() {
        return (
            <div id="main-container">
                <audio 
                    ref="audioRef" 
                    id="beep" 
                    preload="auto" 
                    src="https://soundcamp.org/sounds/382/conga_studio_hit_z1h.mp3" 
                    type="audio/mp3" 

                />

                <div id="clock">
    
                    <div className="container adjust">

                        <TimeControl
                            generalID="break-label"
                            incrementID="break-increment"
                            onClick={this.setBreakLength}
                            className="time-adjust"
                            lengthID="break-length"
                            displayTime={this.state.breakLength}
                            decrementID="break-decrement"
                        />

                        <TimeControl
                            generalID="session-label"
                            incrementID="session-increment"
                            onClick={this.setSessionLength}
                            className="time-adjust"
                            lengthID="session-length"
                            displayTime={this.state.sessionLength}
                            decrementID="session-decrement"
                        />

                    </div>
    
    
                    <div id="timer">
                        <div id="timer-label">{this.state.timerType}</div>
                        <div id="time-left">{this.toClock()}</div>

                    </div>

                    <div className="container start-restart">

                    <button id="start_stop" onClick={this.timerPlayback}>

                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                        </svg>

                    </button>

                    <button id="reset" onClick={this.handleReset}>

                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                            <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                        </svg>

                    </button>

                    </div>
    
                    
    
                </div>
    
            
            </div>
        )
    } 
}





ReactDOM.render(<App />, document.getElementById('app'));