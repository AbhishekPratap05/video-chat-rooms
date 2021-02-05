const socket = io('/');
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');
const msg = document.getElementById('chat_message');
const msgList = document.getElementById('mesasge_list');


myVideo.muted = true; //muting ourselves so that we wont get out own voice playback

//need to connect new peer connection
const myPeer = new Peer()

let myVideoStream;

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id); //emitting this to server to catch 'join-room' 
})

//get user video and audio
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);
    myVideoStream = stream;
    myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        video.id = call.peer;
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })
    //when new user get connected
    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream); //passing new user id to connect
    })

    socket.on('createMessage', message => {
        let li = document.createElement('li');
        li.textContent = message;
        li.className = "message";
        msgList.appendChild(li);
        scrollBottom();
    })

    msg.addEventListener('keydown', (e) => {
        let text = msg.value;
        let key = e.key, keyCode = e.keyCode;
        if ((key && 'Enter' === key || keyCode && 13 === keyCode) && text.trim() !== "") {
            socket.emit('message', text);
            msg.value = '';
        }
    })
    socket.on('user-disconnected', userId => {
        removeUserFromChat(userId)
    })
    socket.on('user-left', userId => {
        leaveChat(userId, stream)
    })

})


const connectToNewUser = (userId, stream) => {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    video.id = userId;
    call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    })

}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();   //after load of video play that
    })
    //add video in grid
    videoGrid.append(video);
}

const leaveChat = (userId, stream) => {
    removeUserFromChat(userId)
}
const removeUserFromChat = (userId) => {
    for (var value of videoGrid.childNodes.keys()) {
        videoGrid.childNodes[value].id == userId ? videoGrid.removeChild(videoGrid.childNodes[value]) : null
    }
}

const scrollBottom = () => {
    const scrollToHeight = document.getElementsByClassName("main__chat_window")[0].scrollHeight
    document.getElementsByClassName("main__chat_window")[0].scrollTo(0, scrollToHeight);
}

const muteToggle = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    enabled ? [myVideoStream.getAudioTracks()[0].enabled = false, setUnmuteButton()] : [myVideoStream.getAudioTracks()[0].enabled = true, setMuteButton()];
}
const setMuteButton = () => {
    const html = `<i class="fas fa-microphone"></i><span>Mute</span>`
    document.querySelector('.main__mute_button').innerHTML = html;
}
const setUnmuteButton = () => {
    const html = `<i class="unmute fas fa-microphone-slash"></i><span>Unmute</span>`
    document.querySelector('.main__mute_button').innerHTML = html;
}

const videoStreamToggle = () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    enabled ? [myVideoStream.getVideoTracks()[0].enabled = false, setVideoDisable()] : [myVideoStream.getVideoTracks()[0].enabled = true, seVideoEnable()];
}
const seVideoEnable = () => {
    const html = `<i class="fas fa-video"></i><span>Stop Video</span>`
    document.querySelector('.main__video_button').innerHTML = html;
}
const setVideoDisable = () => {
    const html = `<i class="unmute fas fa-video-slash"></i><span>Play Video</span>`
    document.querySelector('.main__video_button').innerHTML = html;
}
const quitRoom = () => {
    socket.emit('leave-room');
    myPeer.destroy();

}