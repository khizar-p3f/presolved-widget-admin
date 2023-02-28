import React, { useEffect, useState } from 'react'
import { QuestionCircleOutlined, PauseOutlined, AimOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Divider, FloatButton, Modal, Row, Typography } from 'antd';
import AuthFailurePopUp from './widgets/authFailure';
import ConnectWatcher from './widgets/connect';
import ScreenRecording from './widgets/screenRecord';


const CreateEmbedWidget = ({ config }) => {
    let { clientID, clientSecret } = config
    const [startApp, setStartApp] = useState(false)
    const [auth, setAuth] = useState(true)
    const [MR, setMR] = useState(null);
    const [recording, setRecording] = useState(false)
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        if (clientID == 'f3452adfc5' && clientSecret == '#122$a12302054*(sdfas)asd') {
            setStartApp(true)
        } else {
            setAuth(false)
            Modal.error({
                title: 'Inavlid Client ID or Client Secret',
                content: <AuthFailurePopUp />,
            })
        }



    }, [])

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
    }
    const saveFile = (recordedChunks) => {
        const blob = new Blob(recordedChunks, {
            type: 'video/webm'
        });
        window.open(URL.createObjectURL(blob));
        //saveFileToS3(recordedChunks)
    }
    return (
        <div>
            {startApp &&
                <div>
                    <FloatButton type='primary' icon={<QuestionCircleOutlined />}
                        onClick={() => setShowModal(!showModal)}
                        tooltip={<div>Click to load more info</div>}
                    />
                    <ConnectWatcher />
                    <ScreenRecording
                        screen={true}
                        audio={false}
                        video={false}
                        downloadRecordingPath="Screen_Recording_Demo"
                        downloadRecordingType="mp4"
                        emailToSupport="support@xyz.com"
                    ></ScreenRecording>
                </div>
            }
            <Modal centered width={640} title="Presolved Connect" closable open={showModal} onCancel={() => setShowModal(!showModal)} >
                <div style={{ margin: '30px 0' }}>
                    <Row gutter={[16, 16]}>
                        <Col flex={0}>
                            <Button style={{ height: 60, fontSize: 20 }}
                                type='default' icon={<AimOutlined />} onClick={() => startRecording()}>Record Screen</Button>
                        </Col>
                        <Col flex={0}>
                            <Button style={{ height: 60, fontSize: 20 }}
                                type='default' icon={<PauseOutlined />} onClick={() => stopRecording()}>Reload</Button>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </div>
    )
}





export default CreateEmbedWidget




