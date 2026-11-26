output "AZURE_CLIENT_ID" {
  description = "Set as the GitHub repository variable AZURE_CLIENT_ID."
  value       = azuread_application.github.client_id
}

output "AZURE_TENANT_ID" {
  description = "Set as the GitHub repository variable AZURE_TENANT_ID."
  value       = data.azurerm_client_config.current.tenant_id
}

output "AZURE_SUBSCRIPTION_ID" {
  description = "Set as the GitHub repository variable AZURE_SUBSCRIPTION_ID."
  value       = data.azurerm_subscription.current.subscription_id
}

output "state_backend" {
  description = "Values for the main stack backend in infra/backend.tf."
  value = {
    resource_group_name  = azurerm_resource_group.state.name
    storage_account_name = azurerm_storage_account.state.name
    container_name       = azurerm_storage_container.state.name
  }
}
