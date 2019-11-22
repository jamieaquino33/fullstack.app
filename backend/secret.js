const secrets = {
    //The URL that we use to connect to the MongoDB Atlas Cluster
    dbUri: 'mongodb+srv://jamieaquino33:<Password>@cluster0-kgo4d.mongodb.net/test?retryWrites=true&w=majority'  
};

const getSecret = key => secrets[key];

module.exports = getSecret;

