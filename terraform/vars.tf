variable "region" {
  type        = string
  description = "Your region"
}

variable "compartment_id" {
  type        = string
  description = "Your compartment OCID"
}

variable "function_id" {
  type        = string
  description = "Your scanning-writeq function OCID"
}

variable "event_condition" {
  type        = string
  description = "Replace OCID with your Compartment OCID"
  default     = "{\"eventType\":[\"com.oraclecloud.objectstorage.updateobject\",\"com.oraclecloud.objectstorage.createobject\"],\"data\":{\"compartmentId\":[\"OCID\"],\"additionalDetails\":{\"bucketName\":[\"scanning-ms\"]}}}"
}

variable "tags" {
  type    = string
  default = "created by Terraform"
}
