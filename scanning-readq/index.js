const fs = require('fs');
const http = require("http");
const express = require('express');
const app = express();
const path = require('path');
const queue = require("oci-queue");
const core = require("oci-core");
const identity = require("oci-identity");
const common = require("oci-common");
const os = require("oci-objectstorage");
const { exec } = require("child_process");

const queueId = 'ocid1.queue.oc1.eu-amsterdam-1.amaaaaaauevftmqa4er5filmkshxfpad2leyurhw7t7ilg4txundaly6g7ba';
const endpoint = 'https://cell-1.queue.messaging.eu-amsterdam-1.oci.oraclecloud.com';

var provider;
var qClient;
var oClient;
var inExecution = false;

app.get('/stats', (req, res) => {
  getStats() .then((json) => {
     //console.log(json);
     res.send(JSON.stringify(json));
  });
});


async function getStats() {
    try {
        //console.log("Getting Queue stats .. ");
        const statsReq = {
          queueId: queueId
        };
        var statsRes = await qClient.getStats(statsReq).catch(error => {
            console.log(error);
        });
        //console.log(statsRes);
        return statsRes; // .queueStats.queue.visibleMessages;
    } catch (error) {
        console.log("Error: " + error);
    }
}

async function readQ() {
    if(inExecution)
    {
        //console.log("ReadQ scanning in execution .. passing cycle ..")
        return;
    }
    inExecution = true;
    try {
        var getReq = {
          queueId: queueId,
          timeoutInSeconds: 2
        };
        //console.log("ReadQ reading from Q .. ");
        var getRes = await qClient.getMessages(getReq).catch(error => {
            console.log(error);
        });
        if(getRes.getMessages.messages.length) // Expect to be always 1
        {
            getRes.getMessages.messages.forEach(function(msg) {
                if(msg.content.includes("/")) {
                    console.log("Just deleting file " + msg.content);    
                    var delObjReq = {
                      namespaceName: "frsxwtjslf35",
                      bucketName: "scanning-ms",
                      objectName: msg.content
                    };
                    oClient.deleteObject(delObjReq).catch(error => {
                        console.log(error);
                    });
                    var delReq = {
                      queueId: queueId,
                      messageReceipt: msg.receipt
                    };
                    qClient.deleteMessage(delReq);
                } else {
                    console.log("Scanning " + msg.content);
                    exec("./scan.sh " + msg.content, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`error: ${error.message}`);
                        } else if (stderr) {
                            console.log(`stderr: ${stderr}`);
                        } else {
                            //console.log(`stdout: ${stdout}`);
                            console.log("scan completed " + msg.content);
                            // Delete from Q
                            var delReq = {
                              queueId: queueId,
                              messageReceipt: msg.receipt
                            };
                            qClient.deleteMessage(delReq);
                        }
                        inExecution = false;
                    });
                }
            });
        } else {
            inExecution = false;
        }
    } catch (error) {
        console.log("ReadQ error: " + error);
    } finally {
    }
}

async function init() {
  try {
    provider = await new common.InstancePrincipalsAuthenticationDetailsProviderBuilder().build();
    oClient = new os.ObjectStorageClient({
      authenticationDetailsProvider: provider
    });
    qClient = new queue.QueueClient({
      authenticationDetailsProvider: provider
    });
    qClient.endpoint = endpoint;
    setInterval(readQ,5000);
  } catch (err) {
    console.error('Queue init() error: ' + err.message);
  }
}

init();
app.listen(3000);
