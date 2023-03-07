const fs = require('fs');
const http = require("http");
const express = require('express');
const app = express();
const path = require('path');
const queue = require("oci-queue");
const core = require("oci-core");
const common = require("oci-common");

const queueId = 'ocid1.queue.oc1.eu-amsterdam-1.amaaaaaauevftmqa4er5filmkshxfpad2leyurhw7t7ilg4txundaly6g7ba';
const endpoint = 'https://cell-1.queue.messaging.eu-amsterdam-1.oci.oraclecloud.com';

var provider;
var qClient;

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

async function init() {
  try {
    provider = await new common.InstancePrincipalsAuthenticationDetailsProviderBuilder().build();
    qClient = new queue.QueueClient({
      authenticationDetailsProvider: provider
    });
    qClient.endpoint = endpoint;
  } catch (err) {
    console.error('Queue init() error: ' + err.message);
  }
}

init();
app.listen(3000);
