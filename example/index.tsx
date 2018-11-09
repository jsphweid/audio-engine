import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as RecordingAudioEngine from '../src'

interface ExampleState {
  recordings: RecordingAudioEngine.MonoRecording[]
  maxRecordingTime: number
}

class Example extends React.Component<any, ExampleState> {
  constructor(props: any) {
    super(props)
    this.state = {
      recordings: [],
      maxRecordingTime: 5
    }
  }

  private handleStartRecording = () => {
    const { recordings, maxRecordingTime } = this.state
    RecordingAudioEngine.Recording.startRecording(maxRecordingTime).then(
      recording => {
        this.setState({
          recordings: [...recordings, recording]
        })
      }
    )
  }

  private renderStartStop() {
    return (
      <div>
        <button onClick={this.handleStartRecording}>start recording</button>
        <button onClick={RecordingAudioEngine.Recording.stopRecording}>
          stop recording
        </button>
      </div>
    )
  }

  private renderRecordings() {
    if (!this.state.recordings) return null
    const lis = this.state.recordings.map((recording, i) => (
      <li
        key={i}
        onClick={() => RecordingAudioEngine.Playing.playRecording(recording)}
      >
        Recording {i + 1} made on {`${recording.createDate}`}
      </li>
    ))
    return <ul>{lis}</ul>
  }

  private renderMaxTimeout() {
    return (
      <div>
        Max Recording Length (seconds):
        <input
          onChange={e =>
            this.setState({ maxRecordingTime: parseInt(e.target.value, 10) })
          }
          min={1}
          type="number"
          value={this.state.maxRecordingTime}
        />
      </div>
    )
  }

  public render() {
    return (
      <div>
        {this.renderMaxTimeout()}
        {this.renderStartStop()}
        {this.renderRecordings()}
      </div>
    )
  }
}

ReactDOM.render(<Example />, document.getElementById('example'))
