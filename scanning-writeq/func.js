const fdk = require('@fnproject/fdk');
const core = require("oci-core");
const common = require("oci-common");
const queue = require("oci-queue");

fdk.handle(async function(event) {
    
    var res = "";
    var content = "empty";
    const queueId = 'ocid1.queue.oc1.eu-amsterdam-1.amaaaaaauevftmqa4er5filmkshxfpad2leyurhw7t7ilg4txundaly6g7ba';
    const endpoint = 'https://cell-1.queue.messaging.eu-amsterdam-1.oci.oraclecloud.com';    
    
    try {
        if(event.additionalDetails && event.additionalDetails.resourceName)
        {
            console.log(event.bucketName + '/' + event.additionalDetails.resourceName);
            content = event.additionalDetails.resourceName;
        }

        const provider = await common.ResourcePrincipalAuthenticationDetailsProvider.builder();
        const qClient = new queue.QueueClient({ authenticationDetailsProvider: provider });
        qClient.endpoint = endpoint;

        console.log("Writing event to Queue .. ");
        const putReq = {
          queueId: queueId,
          putMessagesDetails: { messages : [ { content: content } ] }
        };
        
        res = await qClient.putMessages(putReq);
        console.log(putRes);    
        
    } catch (error) {
        console.log("Error: " + error);
        res = "error " + error + ", queue:" + queueId;
    } finally {
        return res;
    }
})
