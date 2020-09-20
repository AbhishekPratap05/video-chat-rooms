const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');
myVideo.muted = true; //muting ourselves so that we wont get out own voice playback


//get user video and audio
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

})

const addVideoStream =(video, stream)=>{
    video.srcObject =  stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();   //after load of video play that
    })
    //add video in grid
    videoGrid.append(video);
}