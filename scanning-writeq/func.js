const fdk = require('@fnproject/fdk');
const core = require("oci-core");
const queue = require("oci-queue");

fdk.handle(async function(event) {
    
    var res = "";
    const queueId = 'ocid1.queue.oc1.eu-amsterdam-1.amaaaaaauevftmqa4er5filmkshxfpad2leyurhw7t7ilg4txundaly6g7ba';
    const endpoint = 'https://cell-1.queue.messaging.eu-amsterdam-1.oci.oraclecloud.com';    

    console.log(event);
    
    /*
    try { 
        const provider = await common.ResourcePrincipalAuthenticationDetailsProvider.builder();
        const qClient = new queue.QueueClient({ authenticationDetailsProvider: provider });
        qClient.endpoint = endpoint;

        console.log("Writing event to Queue .. ");
        const putReq = {
          queueId: queueId,
          putMessagesDetails: { messages : [ { content: content } ] }
        };
        
        const putRes = await client.putMessages(putReq);
        console.log(putRes);    
        
    } catch (error) {
        console.log("Error: " + error);
        res = "error " + error + ", queue:" + queueId;
    } finally {
        return res;
    }
    */
    
    return "ok";
})
