# Virus scanning on OKE (Kubernetes) with object storage Events, KEDA Job scaler and OKE autoscaler

<img src="OKE-scanning.png" width="800" />

## Clone the repo to localhost

<pre>
git clone https://github.com/mikarinneoracle/virus-scanning-on-OKE-with-autoscaler.git
</pre>

## Dynamic Groups and Policies

### Create Dynamic Groups for Policies

- In Cloud UI create for the function (<i>resource principal</i>):

<pre>
ALL {resource.type = 'fnfunc', resource.compartment.id = 'ocid1.compartment.oc1..'}
</pre>

- For OKE and other (<i>instance principal</i>):

<pre>
ANY {instance.compartment.id = 'ocid1.compartment.oc1..'}
</pre>


### Create Policies

- In Cloud UI create for example:

<pre>
Allow dynamic-group &lt;YOUR FUNCTION DYNAMIC GROUP&gt; to manage all-resources in compartment &lt;YOUR COMPARTMENT&gt;
Allow dynamic-group &lt;YOUR OTHER DYNAMIC GROUP&gt; to manage all-resources in compartment &lt;YOUR COMPARTMENT&gt;
</pre>

## Function

### Create OCIR for Function

- In Cloud UI create Container registry <code>scanning-writeq</code> for the function created in the next step

### Create Function for Object Storage emitted Events

This function <code>scanning-writeq</code> will ingest the events emitted by the object storage bucket <code>scanning-ms</code> when file(s) are uploaded to the bucket and then the function will write the file to OCI Queue <code>scanning</code> for OKE jobs to process with virus scanning.

- In Cloud UI create Application <code>scanning-ms</code>

- In Cloud Shell and Code Editor:
    
- Follow the instructions in the Cloud UI  "Getting started" for the application <code>scanning-ms</code>

- Run:

<pre>
<b>fn init --runtime node scanning-writeq</b>
Creating function at: ./scanning-writeq
Function boilerplate generated.
func.yaml created.
</pre>

- Copy/paste <code>func.js</code> and <code>package.json</code> from localhost <code>virus-scanning-on-OKE-with-autoscaler/scanning-writeq/</code>

- Run:
<pre>
fn -v deploy --app scanning-ms
</pre>
This will create and push the OCIR image and deploy the Function <code>scanning-writeq</code> to the application <code>scanning</code>

## Create OKE Cluster

- In Cloud UI create OKE cluster using the "Quick create" option

- Use default settings for the cluster creation

- Add a second Node Pool <code>pool2</code> with <code>pool size 0</code> with defaults for the rest of the settings

- Create cluster access from <code>localhost</code> to the OKE cluster. Click the <code>Access Cluster</code> button for details for the <code>Local Access</code> option.

## Create other resources with Terraform

- In Cloud UI create Resource Manager Stack

- Drag&drop <code>terraform</code> directory from <code>localhost</code> to Stack Configuration

- Use default settings and click continue

- In the Configure variables (Step 2 for the Stack creation) fill in the <code>compartment_id</code> of your compartment OCID, <code>function_id</code> of your <code>scanning-writeq</code> function OCID and replace the <code>OCID</code> of the <code>event_condition</code> with your compartment OCID.

- Click continue and create the Stack. Create the resources by clicking <code>Apply</code> button.

This will create 3 Object Storage buckets, an Event rule and an OCI Queue for the virus scanning to operate on OKE.

## Configure function

- In Cloud UI add <code>scanning-writeq</code> function configuration

- Add configuration key <code>QUEUE</code> with value of the OCID of the <code>scanning-ms</code> queue and key <code>ENDPOINT</code> with value of the <code>endpoint</code> of the <code>scanning-ms</code> queue.








