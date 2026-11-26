data "azurerm_client_config" "current" {}

data "azurerm_subscription" "current" {}

# Terraform remote state

resource "azurerm_resource_group" "state" {
  name     = "rg-nilaygautam-tfstate"
  location = var.location
}

resource "azurerm_storage_account" "state" {
  name                            = var.state_storage_account_name
  resource_group_name             = azurerm_resource_group.state.name
  location                        = azurerm_resource_group.state.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  min_tls_version                 = "TLS1_2"
  allow_nested_items_to_be_public = false
  shared_access_key_enabled       = false
  default_to_oauth_authentication = true
}

resource "azurerm_storage_container" "state" {
  name                  = "tfstate"
  storage_account_id    = azurerm_storage_account.state.id
  container_access_type = "private"
}

# Lets the person running bootstrap also run the main stack locally.
resource "azurerm_role_assignment" "state_current_user" {
  scope                = azurerm_storage_account.state.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = data.azurerm_client_config.current.object_id
}

# GitHub Actions OIDC identity

resource "azuread_application" "github" {
  display_name = "github-${replace(var.github_repository, "/", "-")}"
  owners       = [data.azurerm_client_config.current.object_id]
}

resource "azuread_service_principal" "github" {
  client_id = azuread_application.github.client_id
  owners    = [data.azurerm_client_config.current.object_id]
}

locals {
  github_oidc_subjects = {
    main         = "repo:${var.github_repository}:ref:refs/heads/main"
    pull-request = "repo:${var.github_repository}:pull_request"
    production   = "repo:${var.github_repository}:environment:production"
  }
}

resource "azuread_application_federated_identity_credential" "github" {
  for_each = local.github_oidc_subjects

  application_id = azuread_application.github.id
  display_name   = "github-${each.key}"
  issuer         = "https://token.actions.githubusercontent.com"
  audiences      = ["api://AzureADTokenExchange"]
  subject        = each.value
}

resource "azurerm_role_assignment" "github_contributor" {
  scope                = data.azurerm_subscription.current.id
  role_definition_name = "Contributor"
  principal_id         = azuread_service_principal.github.object_id
}

resource "azurerm_role_assignment" "github_state" {
  scope                = azurerm_storage_account.state.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azuread_service_principal.github.object_id
}
