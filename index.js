const { Expo } = require('expo-server-sdk');
const expo = new Expo();

exports.handler = async (event) => {
    const { expoToken, message } = event;

    if (!Expo.isExpoPushToken(expoToken)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid Expo Push Token' }),
        };
    }

    const pushMessage = {
        to: expoToken,
        sound: 'default',
        body: message,
        // data: { anyData: '' },
    };

    try {
        await expo.sendPushNotificationsAsync([pushMessage]);
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        console.error('Error sending notification:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error sending notification' }),
        };
    }
};
