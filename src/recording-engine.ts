import { MAX_RECORDING_SECONDS } from "./constants";
import { makeTimeoutPromise } from "./helpers";
import MonoRecording from "./mono-recording";
import audioContextInstance from "./audio-context/index";
import {
  connectRecordingNodes,
  disconnectRecordingNodes,
} from "./recording-nodes";

let stopRecordingResolver: Function;

const makePromiseWithExternalHandlers = (): Promise<MonoRecording> => {
  return new Promise(resolve => {
    stopRecordingResolver = resolve;
  });
};

export function startRecording(
  maxLengthSeconds = MAX_RECORDING_SECONDS,
): Promise<MonoRecording> {
  audioContextInstance.resume();
  return connectRecordingNodes().then(() => {
    return Promise.race([
      makePromiseWithExternalHandlers(),
      makeTimeoutPromise(maxLengthSeconds * 1000),
    ]).then(() => {
      const audioData = disconnectRecordingNodes();
      return new MonoRecording(audioData);
    });
  });
}

export function stopRecording(): void {
  if (stopRecordingResolver) {
    stopRecordingResolver();
  }
}
