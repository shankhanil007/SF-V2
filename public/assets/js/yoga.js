const controls = [
  "play-large", // The large play button in the center
  "restart", // Restart playback
  "rewind", // Rewind by the seek time (default 10 seconds)
  "play", // Play/pause playback
  "fast-forward", // Fast forward by the seek time (default 10 seconds)
  "progress", // The progress bar and scrubber for playback and buffering
  "current-time", // The current time of playback
  "duration", // The full duration of the media
  "mute", // Toggle mute
  "volume", // Volume control
  "captions", // Toggle captions
  "settings", // Settings menu
  "pip", // Picture-in-picture (currently Safari only)
  "airplay", // Airplay (currently Safari only)
  "download", // Show a download button with a link to either the current source or a custom URL you specify in your options
  "fullscreen", // Toggle fullscreen
];

const player = new Plyr("#player", { controls });

// Expose
window.player = player;

// Play
function play() {
  player.play();
  var video = document.getElementById("video");
  if (video.paused === true) {
    video.play();
  } else {
    video.pause();
    video.play();
  }
  video.addEventListener("timeupdate", function () {
    if (this.currentTime >= 0.2 * 60) {
      player.pause();
      this.pause();
      var count = 1;
      while (count != 0) {
        $.ajax({
          type: "GET",
          url: "http://localhost:8000/landmarks",
          data: {
            results: JSON.stringify(landmarks.poseLandmarks),
            expected_pose: "cobra",
          },
          contentType: "application/json",
          dataType: "json",
          success: function (data) {
            console.log(data);
          },
        });
        count--;
      }
    }
  });
}

function addVideoURL() {
  player.source = {
    type: "video",
    sources: [
      {
        src: "2HTvZp5rPrg",
        provider: "youtube",
      },
    ],
  };
}

// ----------------------------------------------------------------------------------
const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = canvasElement.getContext("2d");
var landmarks;

function onResults(results) {
  if (!results.poseLandmarks) {
    return;
  }

  landmarks = results;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
    color: "#00FF00",
    lineWidth: 4,
  });

  drawLandmarks(canvasCtx, results.poseLandmarks, {
    color: "#FF0000",
    lineWidth: 2,
  });

  canvasCtx.restore();
}

const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  },
});
pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
pose.onResults(onResults);

function join() {
  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await pose.send({ image: videoElement });
    },
    width: 500,
    height: 450,
  });
  camera.start();
}
// ----------------------------------------------------------------------------------
