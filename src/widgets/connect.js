import React, { useEffect, useState } from 'react'

const ConnectWatcher = () => {
    const [startApp, setStartApp] = useState(false)
    const [auth, setAuth] = useState(true)
    const [MR, setMR] = useState(null);
    const [recording, setRecording] = useState(false)

    useEffect(() => {
        checkConnectWidget()
    }, [])
    const checkConnectWidget = () => {
        if (window.connect) {
            console.log("Connect Widget is Available")
            console.log("Checking Connect app is initialized or not")
            isCCpInitiated()
        }
    }
    const isCCpInitiated = () => {
        let i = 0;
        const PollInterval = setInterval(() => {
            console.log(`Presolved::CCP::Polling to get the login status ${i}`);
            if (window.connect.agent.initialized) {
                clearInterval(PollInterval)
                listenIncomingActivities()
                console.log(`Presolved::CCP::Login success stoppping the poll`);

            }
            if (i > 30) {
                clearInterval(PollInterval)
                console.log(`Presolved::CCP::Login failed stoppping the poll`);
            }
            i++;
        }, 1000);
    }

    const listenIncomingActivities = () => {

        window.connect.contact(function (contact) {
            contact.onConnecting(function (ctx) {
                let contactAttributes = ctx._getData()
                console.log("Presolved::connect::contact::onConnecting::");                        
            })
            contact.onIncoming(function (ctx) {
                let contactAttributes = ctx._getData()
                console.log("Presolved::connect::contact::onIncoming::");
                console.log({ contactAttributes });
            });

            contact.onRefresh(function (ctx) {
                let contactAttributes = ctx._getData()
                console.log("Presolved::connect::contact::onRefresh::");
                console.log({ contactAttributes });

            });

            contact.onAccepted(function (ctx) {
                let contactAttributes = ctx._getData()
                console.log("Presolved::connect::contact::onAccepted::");
            });

            contact.onEnded(function (ctx) {
                try {
                    console.log("Presolved::connect::contact::onEnded::");
                    let contactAttributes = ctx._getData()
                    stopRecording()
                } catch (error) {
                    console.error({
                        error
                    })
                }

            });

            contact.onConnected(function (ctx) {
                console.log("Presolved::connect::contact::onConnected::",);
                startRecording()
            });
            contact.onMissed(function (ctx) {
                console.log("Presolved::connect::contact::onMissed::", ctx);
            })
        });

    }
    const recordScreen = async () => {
        return await navigator.mediaDevices.getDisplayMedia({
            audio: false,
            video: { mediaSource: "screen" }
        });
    }
    const createRecorder = (stream, mimeType) => {
        // the stream data is stored in this array
        let recordedChunks = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function (e) {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }
        }
        mediaRecorder.onstop = function () {
            saveFile(recordedChunks);
            recordedChunks = [];
        }
        mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
        return mediaRecorder;
    }
    const startRecording = async () => {
        let stream = await recordScreen();
        let mimeType = 'video/webm';
        let mediaRecorder = createRecorder(stream, mimeType);
        setMR(mediaRecorder)
        setRecording(true)
    }
    const stopRecording = () => {
        MR.stop();
        setRecording(false)
        setMR(null)
    }
    const saveFile = (recordedChunks) => {
        const blob = new Blob(recordedChunks, {
            type: 'video/webm'
        });
        window.open(URL.createObjectURL(blob));
        //saveFileToS3(recordedChunks)
    }

    return (
        <div>ConnectWatcher</div>
    )
}

export default ConnectWatcher



