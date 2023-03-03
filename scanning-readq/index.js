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
var inExecution = false;

app.get('/stats', (req, res) => {
  getStats() .then((json) => {
     //console.log(json);
     res.send(JSON.stringify(json));
  });
});


async function getStats() {
    try {
        console.log("Getting Queue stats .. ");
        const statsReq = {
          queueId: queueId
        };
        var statsRes = await qClient.getStats(statsReq).catch(error => {
            console.log(error);
        });
        console.log(statsRes);
        return statsRes.queueStats.queue.visibleMessages;
    } catch (error) {
        console.log("Error: " + error);
    }
}

async function readQ() {
    if(inExecution)
    {
        console.log("ReadQ in execution .. passing cycle ..")
        return;
    }
    inExecution = true;
    try {
        var getReq = {
          queueId: queueId,
          timeoutInSeconds: 2
        };
        console.log("ReadQ reading from Q .. ");
        var getRes = await qClient.getMessages(getReq).catch(error => {
            console.log(error);
        });
        if(getRes.getMessages.messages.length)
        {
            getRes.getMessages.messages.forEach(function(msg) {
                console.log(msg.content);
                var delReq = {
                  queueId: queueId,
                  messageReceipt: msg.receipt
                };
                qClient.deleteMessage(delReq);
                // PROCESS the file here
                exec("ls -la", (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });
            });
        }
    } catch (error) {
        console.log("ReadQ error: " + error);
    } finally {
        console.log("ReadQ done");
        inExecution = false;
    }
}

async function init() {
  try {
    //provider = await new common.InstancePrincipalsAuthenticationDetailsProviderBuilder().build();
    // Use this locally:
    const tenancy = "ocid1.tenancy.oc1..aaaaaaaa4wptnxymnypvjjltnejidchjhz6uimlhru7rdi5qb6qlnmrtgu3a";
    const user = "ocid1.user.oc1..aaaaaaaan6v5pipc5vg675p7dc6fbic3ynf2hillsgvzhsvz37vgljmrbt5a";
    const fingerprint = "ef:4d:a7:e1:bd:e5:21:16:7b:28:1d:f9:2c:46:02:23";
    const passphrase = null;
    const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDBOZFJU1eLaUe4
8i5TMP90AzKJF5tyW64kL51bqvzFJH+urOmLjl0TS0RrEDSXcz10jNAQrgjvt5zI
bzaPMOwZYdm+WSan0uSRmmroYBEIQU0HOJbpMmNGNspEBMsaPVpVilQPlvGmZero
WPPZEZ1n1zv2O6T3YSZXQ2FzXMEQ+ky79D/FniSrpqh3/Xy3W8hlcZrlLb1wFBFg
wqKawBxUxJ09zZ1JNHnrynAuW8Wzuw/TXiBdXsH/8NopTEEa7+fhUZNvHopegw0W
gi7Z9D94SNngt8PZgmF5t5Aq407tIQkUmL9Zpb3LMac46dygd+SBZ3rWM1vzQXAa
mdPShKWVAgMBAAECggEADW08pUW/TZaxPy7E/U7oUV1vg4s6aAXq4eTVIGuPSPuy
S6cES4hG+3I9fNsRbHy7hn/KbX5KbK3rnRntRqH1pgXgpZN4Vi0XaO68Aw254UL4
YUoTYnz33QctovBaVKZywoLsOHEatZ9bZW3Y8/p/X5nbNs8KNY5wpZuvB98oI0/C
WMV09kSrORxZHksK7Ix57bKqBv/5uSOiDPddjyRAr8jwoJg/lgY4RThVEN6D78Ia
/7sKeTYMH6DvgZSDBLOCvtYl54OuMbcQZ4YCA3rGOiu2CGGbANQLgYt+7Jjx7Gtj
mlw0/ryWGPDko2SLMyvdcBgei538EZy15TwYhpgwwQKBgQDoYqEpPjs5+rqBom8x
KY63VyVaPsGCv93ec82pXf5pj2jN2HpZBiiAq83GVU8dkS1tm+5Vhmp8FfKUmg3U
3iIt5cHmvTviGIKf89Igc4gd2THigwscnKTDmujMUlA5qs+USFyUvve03yZLnEl1
PApHe/OqHfAvuI7500XCeiHo6QKBgQDU3DPZC7xTfKrRWjZrgbFFGbt1vDvYI1/0
m0EO6FVTp3k+Rs7QyEkeRTy7UbV6ssv9Ljcd6Qai6SWO1YK+6rNzBUrTnTjLRdGJ
bzp7X0uLI4i7jHcPNblIj2ByN7JPFUXf9NUbCTiAArMDOhKZGg2QqAyR4xFicUsq
9FtG0o4rzQKBgA59B7tAjATDYxlt/Sy9gI5huoxz2TDDsZuK8MmceJ4wOMKMuqQO
RDwxefThoLshMAnjbOqcJMtzutoU+MPKzaq65mnyZmdkS9CZLQKk8VmbDwcmUG0K
PyOK5vTGNQZDZgnCsTL87Qiz2Plh1xqeEa3/RmPW1gDDqvZce77ySmbxAoGAH+Dm
pu/aAYrfLkFbexhOSzICYCyTrdgGa+TAhpIHDWM8hjYmjSAhyzXFVax0CG80m7NL
L+CRTN6r8EtLrHoL7ALz5ONb+R14tyOAV6+66ZilxqjPv+hk2lgWsqRiwPNHprXN
IKJt4sYEt0wAMwuy0mJIl6SxGtQq1MEJ1n58KlUCgYBmSXvJ2r4uPgp0UIrZsOeg
tEjGA7VLd/LK8cKfA7+XUIqNqMxhlhIg4VZ8Pg52sP6+HCWoko4zD1VA64TygH9i
28wtHWHJVdQVmM5SPVr/0vn3aU2zKrZ3GPxWR3yL2PmV/V4EyeOU0cx0IO1xqnUz
LQh/jgcr5mXMeWOhnioOxA==
-----END PRIVATE KEY-----`;
    const region = common.Region.EU_AMSTERDAM_1;
    const provider = new common.SimpleAuthenticationDetailsProvider(
      tenancy,
      user,
      fingerprint,
      privateKey,
      passphrase,
      region
    );
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
