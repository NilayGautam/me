output "static_web_app_name" {
  description = "Used by the deploy workflow to fetch a deployment token."
  value       = azurerm_static_web_app.site.name
}

output "static_web_app_resource_group" {
  description = "Used by the deploy workflow to fetch a deployment token."
  value       = azurerm_resource_group.site.name
}

output "static_web_app_default_hostname" {
  description = "The azurestaticapps.net hostname, useful before DNS is live."
  value       = azurerm_static_web_app.site.default_host_name
}
