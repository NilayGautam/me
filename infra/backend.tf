# Remote state created by infra/bootstrap.
# If bootstrap used a different storage account name, change it here too.
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-nilaygautam-tfstate"
    storage_account_name = "nilaygautamtfstate"
    container_name       = "tfstate"
    key                  = "site.tfstate"
    use_azuread_auth     = true
  }
}
