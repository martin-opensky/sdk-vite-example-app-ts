import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import {
  HuddleClientProvider,
  getHuddleClient,
  useRootStore,
} from "@huddle01/huddle01-client";
import PeerVideoAudioElem from "./components/PeerVideoAudioElem";
import { HuddleStore } from "@huddle01/huddle01-client/HuddleClient/HuddleClient";

function App() {
  const huddleClient = getHuddleClient("YOUR_API_KEY");
  const stream = useRootStore((state) => state.stream);
  const enableStream = useRootStore((state) => state.enableStream);
  const pauseTracks = useRootStore((state) => state.pauseTracks);
  const isCamPaused = useRootStore((state) => state.isCamPaused);
  const peers = useRootStore((state) => state.peers);
  const peerId = useRootStore((state) => state.peerId);
  const lobbyPeers = useRootStore((state) => state.lobbyPeers);
  const roomState = useRootStore((state) => state.roomState);
  const micPaused = useRootStore((state) => state.isMicPaused);
  const [allowPeersToAutoJoin, setAllowPeersToAutoJoin] = useState(true);

  const joinCall = async () => {
    const roomId = "embrace.community/space-handle/random-id-stored-in-lit";
    try {
      await huddleClient.join(roomId, {
        address: "0x15900c698ee356E6976e5645394F027F0704c8Eb",
        wallet: "",
        ens: "axit.eth",
      });

      console.log("joined");
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    async function startCall() {
      await enableStream();
      await joinCall();
    }

    startCall();
  }, []);

  useEffect(() => {
    if (allowPeersToAutoJoin) {
      huddleClient.allowAllLobbyPeersToJoinRoom();
    }
  }, [lobbyPeers]);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    console.log({ peers: Object.values(peers), peerId, isCamPaused });
  }, [peers, peerId, isCamPaused]);

  return (
    <HuddleClientProvider value={huddleClient}>
      <div className="App">
        <div>
          {/* <button onClick={handleJoin}>Join Room</button>
            <button onClick={() => enableStream()}>Enable Stream</button>
            <button onClick={() => pauseTracks()}>Disable Stream</button> */}
          {/* <button onClick={() => huddleClient.enableWebcam()}>
              Enable Webcam
            </button>
            <button onClick={() => huddleClient.disableWebcam()}>
              Disable Webcam
            </button> */}
          {/* <button onClick={() => huddleClient.allowAllLobbyPeersToJoinRoom()}>
            Allow Peers to join
          </button>
           */}
        </div>
        {!isCamPaused && (
          <video
            style={{ width: "100%" }}
            ref={videoRef}
            autoPlay
            muted
          ></video>
        )}
        <div>
          {!micPaused && (
            <button onClick={() => huddleClient.muteMic()}>Mute Mic</button>
          )}
          {micPaused && (
            <button onClick={() => huddleClient.unmuteMic()}>unmute Mic</button>
          )}
        </div>

        {/* {lobbyPeers[0] && <h2>Lobby Peers</h2>}
        <div>
          {lobbyPeers.map((peer) => (
            <div>{peer.peerId}</div>
          ))}
        </div> */}

        {Object.values(peers)[0] && <h2>Callers</h2>}

        <div className="peers-grid">
          {Object.values(peers).map((peer) => (
            <PeerVideoAudioElem peerIdAtIndex={peer.peerId} />
          ))}
        </div>
      </div>
    </HuddleClientProvider>
  );
}

export default App;
