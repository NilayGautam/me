data "azurerm_subscription" "current" {}

resource "azurerm_resource_group" "site" {
  name     = "rg-nilaygautam-site"
  location = var.location
}

# Main site

resource "azurerm_static_web_app" "site" {
  name                = "swa-nilaygautam"
  resource_group_name = azurerm_resource_group.site.name
  location            = azurerm_resource_group.site.location
  sku_tier            = "Free"
  sku_size            = "Free"

  # Deploys come from GitHub Actions, not from a linked repository.
  lifecycle {
    ignore_changes = [repository_branch, repository_url]
  }
}

resource "azurerm_static_web_app_custom_domain" "apex" {
  static_web_app_id = azurerm_static_web_app.site.id
  domain_name       = var.domain
  validation_type   = "dns-txt-token"
}

# Cost guardrails

resource "azurerm_consumption_budget_subscription" "monthly" {
  name            = "budget-nilaygautam-monthly"
  subscription_id = data.azurerm_subscription.current.id
  amount          = var.monthly_budget_usd
  time_grain      = "Monthly"

  time_period {
    start_date = var.budget_start_date
  }

  dynamic "notification" {
    for_each = [50, 80, 100]

    content {
      enabled        = true
      threshold      = notification.value
      threshold_type = "Actual"
      operator       = "GreaterThanOrEqualTo"
      contact_emails = [var.budget_contact_email]
    }
  }
}
