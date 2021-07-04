'use strict'

var start = document.querySelector('button#start');
var restart = document.querySelector('button#restart');

var pc1 = new RTCPeerConnection();
var pc2 = new RTCPeerConnection();

function getMediaStream(stream) {
    stream.getTracks().forEach((track) => {
        pc1.addTrack(track);
    });

    var options = {
        offerToReceiveAudio: 0,
        offerToReceiveVideo: 1,
        iceRestart: false,
    }

    pc1.createOffer(options)
        .then(getOffer)
        .catch(handleOfferError);
}

function getOffer(desc){
    console.log('offer',desc.sdp);

    pc1.setLocalDescription(desc);
    pc2.setRemoteDescription(desc);

    pc2.createAnswer().then(getAnswer).catch(handleAnswerError);
}

function getAnswer(desc){
    console.log('answer',desc.sdp);

    pc2.setLocalDescription(desc);
    pc1.setRemoteDescription(desc);
}

function handleAnswerError(err) {
    console.error('Failed to create answer', err);
}

function handleOfferError(err) {
    console.error('Failed to create offer', err);
}

function handleError(err){
    console.error('Failed to get Media Stream:',err);
}

function getStream() {
    var constraints = {
        audio:false,
        video:true
    }

    navigator.mediaDevices.getUserMedia(constraints).then(getMediaStream).catch(handleError);
}

function test(){
    start.onclick = getStream;
}