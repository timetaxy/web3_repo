const path = require('path');
const PROTO_PATH = path.resolve(__dirname, './auth.proto');
// const PROTO_PATH = path.resolve(__dirname, './helloworld.proto')
 
const grpc = require('grpc')
const protoLoader = require("@grpc/proto-loader")

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        arrays: true
    }
)
console.log(grpc.loadPackageDefinition(packageDefinition))
const myClient = grpc.loadPackageDefinition(packageDefinition).gateway.v1

const client = new myClient.AuthService(
    '127.0.0.1:1234',
    grpc.credentials.createInsecure()
)

const metadata = new grpc.Metadata()
metadata.add('authorization', 'secret')
 
// const myClient = new GRPCClient(PROTO_PATH, 'bridge.v1', 'AuthService', '127.0.0.1:1234');
 
const dataToSend = {
    address: '0xxxxxxxxx',
};
 
// myClient.runService('RequestToken', dataToSend, (err, res) => {
//     console.log(err)
//     console.log('Service response ', res);
 
// });

client.RequestToken(dataToSend, metadata, (err, res) => {
    console.log(res)
})