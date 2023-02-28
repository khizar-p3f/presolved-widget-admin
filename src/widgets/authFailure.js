import React from 'react'
import {Typography } from 'antd';

const AuthFailurePopUp = () => {
    return (
        <div>
            <Typography.Title level={3}>
                <u><em><strong>Presolved Connect</strong></em></u>
            </Typography.Title>
            <Typography.Text>
                Please contact your administrator to get the correct Client ID and Client Secret
            </Typography.Text>
        </div>
    )
}

export default AuthFailurePopUp