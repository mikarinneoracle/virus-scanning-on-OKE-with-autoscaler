variable "region" {
  type    = string
  ### Replace with your Region if not AMS
  default = "eu-amsterdam-1"
}

variable "compartment_id" {
  type    = string
  ### Replace with your Compartment OCID
  default = "ocid1.compartment.oc1..aaaaaaaawccfklp2wj4c5ymigrkjfdhcbcm3u5ripl2whnznhmvgiqdatqgq"
}

variable "function_id" {
  type    = string
  ### Replace with your Scanning function OCID
  default = "ocid1.fnfunc.oc1.eu-amsterdam-1.aaaaaaaah6ix3r7fmz76sz2g2wghqvcm2tkc5jmynqwubsxfwkfxfigihyoa"
}

variable "event_condition" {
  type    = string
  ### Replace with your Compartment OCID
  default = "{\"eventType\":[\"com.oraclecloud.objectstorage.updateobject\",\"com.oraclecloud.objectstorage.createobject\"],\"data\":{\"compartmentId\":[\"ocid1.compartment.oc1..aaaaaaaawccfklp2wj4c5ymigrkjfdhcbcm3u5ripl2whnznhmvgiqdatqgq\"],\"additionalDetails\":{\"bucketName\":[\"scanning-ms\"]}}}"
}

variable "tags" {
  type    = string
  default = "created by Terraform"
}