'use strict'
// devices
var videoplay = document.querySelector('video#player');
var audioSource = document.querySelector("select#audioSource");
var audioOutput = document.querySelector("select#audioOutput");
var videoSource = document.querySelector("select#videoSource");

// filter
var filtersSelect = document.querySelector('select#filter');

// picture
var snapshot = document.querySelector('button#snapshot');
var picture = document.querySelector('canvas#picture');
picture.width = 320;
picture.height = 240;

function start() {
	if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
		console.log('getUserMedia is not supported!');
	} else {
		var deviceId = videoSource.value;
		var constrants = {
			video: {
				width: {
					min: 300,
					max: 1000
				},
				height: 480,
				frameRate: 60,
				deviceId: deviceId ? deviceId : undefined,

			},
			audio: false
		}
		navigator.mediaDevices.getUserMedia(constrants)
			.then(gotMediaStream)
			.then(gotDevices)
			.catch(handleError);
	}
}

function gotMediaStream(stream) {
	videoplay.srcObject = stream;
	return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
	deviceInfos.forEach(function (deviceInfo) {
		console.log(deviceInfo.kind + ": label = " +
			deviceInfo.label + ": id = " +
			deviceInfo.deviceId + ": groupId = " +
			deviceInfo.groupId);
		var option = document.createElement('option');
		option.text = deviceInfo.label;
		option.value = deviceInfo.deviceId;
		if (deviceInfo.kind === 'audioinput') {
			audioSource.appendChild(option);
		} else if (deviceInfo.kind === 'audiooutput') {
			audioOutput.appendChild(option);
		} else if (deviceInfo.kind === 'videoinput') {
			videoSource.appendChild(option);
		}
	});

}

function handleError(err) {
	console.log("getUserMedia: " + err);
}

start();

videoSource.onchange = start;

filtersSelect.onchange = function () {
	videoplay.className = filtersSelect.value;
}

snapshot.onclick = function () {
	picture.className = filtersSelect.value;
	picture.getContext('2d').drawImage(videoplay, 0, 0, picture.width, picture.height);
}