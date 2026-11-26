# Cloudflare DNS for the main site.
# Email routing (MX and its TXT records) is managed in the Cloudflare dashboard and is deliberately not touched here.

# Apex points at Static Web Apps.
# Cloudflare flattens CNAME records at the apex automatically.
# It stays DNS only so Azure can validate the domain and issue its certificate.
resource "cloudflare_dns_record" "apex" {
  zone_id = var.cloudflare_zone_id
  name    = var.domain
  type    = "CNAME"
  content = azurerm_static_web_app.site.default_host_name
  proxied = false
  ttl     = 1
  comment = "Azure Static Web Apps (managed by Terraform)"
}

# Proves domain ownership to Azure.
# Azure clears the token once the domain is validated, so later changes to it are ignored.
resource "cloudflare_dns_record" "apex_validation" {
  zone_id = var.cloudflare_zone_id
  name    = var.domain
  type    = "TXT"
  content = "\"${azurerm_static_web_app_custom_domain.apex.validation_token}\""
  ttl     = 1
  comment = "Azure Static Web Apps domain validation (managed by Terraform)"

  lifecycle {
    ignore_changes = [content]
  }
}

# www is proxied so the redirect rule below can answer at Cloudflare's edge.
resource "cloudflare_dns_record" "www" {
  zone_id = var.cloudflare_zone_id
  name    = "www.${var.domain}"
  type    = "CNAME"
  content = var.domain
  proxied = true
  ttl     = 1
  comment = "Redirects to the apex (managed by Terraform)"
}

# A zone has one ruleset per phase, so this owns every single redirect rule on the zone.
resource "cloudflare_ruleset" "redirects" {
  zone_id     = var.cloudflare_zone_id
  name        = "Redirects"
  description = "Single redirects for ${var.domain} (managed by Terraform)"
  kind        = "zone"
  phase       = "http_request_dynamic_redirect"

  rules = [
    {
      description = "www to apex"
      expression  = "(http.host eq \"www.${var.domain}\")"
      action      = "redirect"
      enabled     = true
      action_parameters = {
        from_value = {
          status_code           = 301
          preserve_query_string = true
          target_url = {
            expression = "concat(\"https://${var.domain}\", http.request.uri.path)"
          }
        }
      }
    }
  ]
}
