# Virus scanning on OKE (Kubernetes) with object storage Events, KEDA Job scaler and OKE autoscaler

<img src="OKE-scanning.png" width="800" />

## Clone the repo to localhost

<pre>
git clone https://github.com/mikarinneoracle/virus-scanning-on-OKE-with-autoscaler.git
</pre>

## Dynamic Groups and Policies

### Create Dynamic Groups for Policies

- For the function:

<pre>
ALL {resource.type = 'fnfunc', resource.compartment.id = 'ocid1.compartment.oc1..'}
</pre>

- For OKE and other:

<pre>
ANY {instance.compartment.id = 'ocid1.compartment.oc1..'}
</pre>


### Create Policies

- For example:

<pre>
Allow dynamic-group &lt;YOUR FUNCTION DYNAMIC GROUP&gt; to manage all-resources in compartment &lt;YOUR COMPARTMENT&gt;
Allow dynamic-group &lt;YOUR OTHER DYNAMIC GROUP&gt; to manage all-resources in compartment &lt;YOUR COMPARTMENT&gt;
</pre>

## Function

### Create OCIR for Function

- In Cloud UI create Container registry <code>scanning-writeq</code> for the Function created in the next step

### Create Function

- In Cloud UI create Application <code>scanning</code>

<b>In Cloud Shell and Code Editor</b>:
    
- Follow the instructions in the Cloud UI  "Getting started" for the application <code>scanning</code>

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
fn -v deploy --app scanning
</pre>
This will create and push the OCIR image and deploy the Function <code>scanning-writeq</code> to the application <code>scanning</code>


