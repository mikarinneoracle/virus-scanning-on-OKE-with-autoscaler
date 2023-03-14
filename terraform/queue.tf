resource "oci_queue_queue" "scanning-ms" {
  compartment_id = var.compartment_id
  display_name = "scanning-ms"
  retention_in_seconds = 3600
  visibility_in_seconds = 1800
  freeform_tags = {
    Managed = var.tags
  }
}
