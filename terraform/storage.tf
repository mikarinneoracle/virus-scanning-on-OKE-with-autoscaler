resource "oci_objectstorage_bucket" "scanning" {
  compartment_id        = var.compartment_id
  name                  = "scanning-ms"
  namespace             = data.oci_objectstorage_namespace.user_namespace.namespace
  object_events_enabled = true
}

resource "oci_objectstorage_bucket" "scanned" {
  compartment_id = var.compartment_id
  name           = "scanned-ms"
  namespace      = data.oci_objectstorage_namespace.user_namespace.namespace
  object_events_enabled = true
}

resource "oci_objectstorage_bucket" "scanning_alert_report" {
  compartment_id = var.compartment_id
  name           = "scanning-ms-alert-report"
  namespace      = data.oci_objectstorage_namespace.user_namespace.namespace
  object_events_enabled = true
}
