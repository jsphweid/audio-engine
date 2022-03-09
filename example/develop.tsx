import * as React from "react";
import * as ReactDOM from "react-dom";

import * as RecordingAudioEngine from "../src";
import Recording from "./recording";

interface ExampleState {
  recordings: RecordingAudioEngine.MonoRecording[];
  maxRecordingTime: number;
}

function Example() {
  const [maxRecordTime, setMaxRecordTime] = React.useState(2);
  const [recordings, setRecordings] = React.useState<
    RecordingAudioEngine.MonoRecording[]
  >([]);

  function handleStartRecording() {
    RecordingAudioEngine.Recording.startRecording(maxRecordTime).then(
      recording => {
        setRecordings([...recordings, recording]);
      },
    );
  }

  function renderStartStop() {
    return (
      <div>
        <button onClick={handleStartRecording}>start recording</button>
        <button onClick={RecordingAudioEngine.Recording.stopRecording}>
          stop recording
        </button>
      </div>
    );
  }

  function renderRecordings() {
    if (!recordings.length) return null;
    const content = recordings.map((recording, i) => (
      <Recording recording={recording} key={`recording${i}`} />
    ));
    return <ul>{content}</ul>;
  }

  function renderMaxTimeout() {
    return (
      <div>
        Max Recording Length (seconds):
        <input
          onChange={e => setMaxRecordTime(parseInt(e.target.value, 10))}
          min={1}
          type="number"
          value={maxRecordTime}
        />
      </div>
    );
  }

  return (
    <div>
      {renderMaxTimeout()}
      {renderStartStop()}
      {renderRecordings()}
    </div>
  );
}

ReactDOM.render(<Example />, document.getElementById("example"));
