const dotenv = require('dotenv').config()
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": process.env.accessKeyId, "secretAccessKey":process.env.secretAccessKey
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let fetchOneByKey = function () {
    console.log("dotenv" + process.env.LASTNAME);
    var params = {
        TableName: "users",
        Key: {
            "email_id": "jeevan@gmail.com"
        }
    };
    docClient.get(params, function (err, data) {
        if (err) {
            console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
        }
        else {
            console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
            getInput();
        }
    })
}

let modify = function () {
    var params = {
        TableName: "users",
        Key: { "email_id": "jeevan@gmail.com" },
        UpdateExpression: "set f_name = :byUser",
        ExpressionAttributeValues: {
            ":byUser": "Pappu"
        },
        ReturnValues: "UPDATED_NEW"
    };
    docClient.update(params, function (err, data) {
        if (err) {
            console.log("users::update::error - " + JSON.stringify(err, null, 2));
        } else {
            console.log("users::update::success "+JSON.stringify(data) );
        }
    });
}

let save = function () {
    var input = {
        "email_id": "example-1@gmail.com", "created_by": "clientUser", "created_on": new Date().toString(),
        "updated_by": "clientUser", "updated_on": new Date().toString(), "is_deleted": false
    };
    var params = {
        TableName: "users",
        Item:  input
    };
    docClient.put(params, function (err, data) {
        if (err) {
            console.log("users::save::error - " + JSON.stringify(err, null, 2));                      
        } else {
            console.log("users::save::success" );                      
        }
    });
}

let remove = function () {
    var params = {
        TableName: "users",
        Key: {
            "email_id": "example@gmail.com"
        }
    };
    docClient.delete(params, function (err, data) {
        if (err) {
            console.log("users::delete::error - " + JSON.stringify(err, null, 2));
        } else {
            console.log("users::delete::success");
        }
    });
}

rl.on("close", function() {
    console.log("\nBYE BYE !!!");
    process.exit(0);
});

let getInput = function(){
    rl.question("Which operation you want to perform on dynamo DB? \n1: Read \n2: Write \n3: Put\
     \n4: Delete \n5: Exit\n=>", function(choice) {
        switch (choice) {
            default:
            text = "Looking forward to the Weekend";
            break;
            case '1':
                console.log("called")
                fetchOneByKey();
            break;
            case '2':
                save();
            break;
            case '3':
                modify();
            break;
            case '4':
                remove();
            break;
            case '5':
                rl.close();
            break;
        }
    });
}
getInput();