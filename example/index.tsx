import * as React from "react";
import * as ReactDOM from "react-dom";
import * as RecordingAudioEngine from "../src";
// import Recording from "./recording";

interface ExampleState {
  // recordings: RecordingAudioEngine.MonoRecording[];
  maxRecordingTime: number;
  isRecorderReady: boolean;
  isRecording: boolean;
  simpleRecordings: Blob[];
}

class Example extends React.Component<any, ExampleState> {
  public recorder = new RecordingAudioEngine.Recorder();

  constructor(props: any) {
    super(props);
    this.state = {
      // recordings: [],
      simpleRecordings: [],
      maxRecordingTime: 5,
      isRecorderReady: false,
      isRecording: false,
    };
    this.recorder
      .initialize()
      .then(() => this.setState({ isRecorderReady: true }));
  }

  private handleStartRecording = () => {
    this.recorder.start();

    this.setState({ isRecording: true });

    // RecordingAudioEngine.Recording.startRecording(maxRecordingTime).then(
    //   recording => {
    //     this.setState({
    //       recordings: [...recordings, recording],
    //     });
    //   },
    // );
  };

  private handleStopRecording = () => {
    this.recorder
      .stop()
      .then(() => {
        this.setState({ isRecording: false });
        return this.recorder.exportWAV();
      })
      .then(blob =>
        this.setState({
          simpleRecordings: [...this.state.simpleRecordings, blob],
        }),
      )
      .then(() => this.recorder.clear());
  };

  private renderStartStop = () => (
    <div>
      <button
        onClick={this.handleStartRecording}
        disabled={!this.state.isRecorderReady || this.state.isRecording}
      >
        start recording
      </button>
      <button
        onClick={this.handleStopRecording}
        disabled={!this.state.isRecorderReady || !this.state.isRecording}
      >
        stop recording
      </button>
    </div>
  );

  // private renderRecordings() {
  //   if (!this.state.recordings) return null;
  //   const recordings = this.state.recordings.map((recording, i) => (
  //     <Recording recording={recording} key={`recording${i}`} />
  //   ));
  //   return <ul>{recordings}</ul>;
  // }

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
    );
  }

  private renderSimpleRecordings = () => {
    return this.state.simpleRecordings.length === 0 ? null : (
      <ul>
        {this.state.simpleRecordings.map((blob, i) => (
          <li key={`audio-${i}`}>
            <audio src={URL.createObjectURL(blob)} controls={true} />
          </li>
        ))}
      </ul>
    );
  };

  public render() {
    return (
      <div>
        {this.renderMaxTimeout()}
        {this.renderStartStop()}
        {/* {this.renderRecordings()} */}
        {this.renderSimpleRecordings()}
      </div>
    );
  }
}

ReactDOM.render(<Example />, document.getElementById("example"));
