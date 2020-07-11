const AWS = require('aws-sdk');
const STS = new AWS.STS({ apiVersion: '2011-06-15' });

const getCredentials = () => {
    
    return STS.assumeRole({
        RoleArn: 'arn:aws:iam::136274050493:role/Lambda',
        RoleSessionName: 'VaughanWasteCollectionSchedule'
    }, (err, res) => {
        if (err) {
            console.log('AssumeRole FAILED: ', err);
            throw new Error('Error while assuming role');
        }
        return res;
    }).promise();
};

const getDB = async () => {

    const credentials = await getCredentials();

    return new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        accessKeyId: credentials.Credentials.AccessKeyId,
        secretAccessKey: credentials.Credentials.SecretAccessKey,
        sessionToken: credentials.Credentials.SessionToken
    });
};

module.exports.getZone = async (userId) => {

    const db = await getDB();

    const params = {
        Key: {
            userId: {
                S: userId
            }
        }, 
        TableName: "VaughanZones"
    };

    return new Promise((resolve, reject) => {

        db.getItem(params, (err, data) => {
            
            if (err)
                return reject(err)

            if (data.Item)
                return resolve(data.Item.zone.S);

            resolve();
        });
    });
};
