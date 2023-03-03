const fdk = require('@fnproject/fdk');
const core = require("oci-core");
const common = require("oci-common");
const queue = require("oci-queue");

fdk.handle(async function(event) {
    
    var res = "";
    var content = "";
    const queueId = 'ocid1.queue.oc1.eu-amsterdam-1.amaaaaaauevftmqa4er5filmkshxfpad2leyurhw7t7ilg4txundaly6g7ba';
    const endpoint = 'https://cell-1.queue.messaging.eu-amsterdam-1.oci.oraclecloud.com';    
    
    console.log(event);
    content = JSON.stringify(event);
    
    try {
        if(event.data && event.data.resourceName)
        {
            console.log(event.data.resourceName);
            content = event.additionalDetails.resourceName;
        }

        const provider = await common.ResourcePrincipalAuthenticationDetailsProvider.builder();
        const qClient = new queue.QueueClient({ authenticationDetailsProvider: provider });
        qClient.endpoint = endpoint;

        console.log("Writing '" + content + "' to Queue .. ");
        const putReq = {
          queueId: queueId,
          putMessagesDetails: { messages : [ { content: content } ] }
        };
        
        res = await qClient.putMessages(putReq);  
    } catch (error) {
        console.log("Error: " + error);
        res = "error " + error + ", queue:" + queueId;
    } finally {
        return res;
    }
})
