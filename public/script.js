const socket = io('/');
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

socket.emit('join-room',ROOM_ID); //emitting this to server to catch 'join-room'

//when new user get connected
socket.on('user-connected',()=>{
    connectToNewUser();
})

const connectToNewUser =()=>{
    console.log("new user");
}

const addVideoStream =(video, stream)=>{
    video.srcObject =  stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();   //after load of video play that
    })
    //add video in grid
    videoGrid.append(video);
}