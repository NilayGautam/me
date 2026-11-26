variable "subscription_id" {
  description = "Azure for Students subscription ID."
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for the domain."
  type        = string
}

variable "domain" {
  description = "Apex domain served by the site."
  type        = string
  default     = "nilaygautam.com"
}

variable "location" {
  description = "Azure region. Static Web Apps Free is only offered in a few regions (centralus, eastus2, westus2, westeurope, eastasia)."
  type        = string
  default     = "centralus"
}

variable "monthly_budget_usd" {
  description = "Monthly budget in USD, roughly the yearly student credit divided by twelve."
  type        = number
  default     = 8
}

variable "budget_start_date" {
  description = "First day of the month the budget starts, in RFC 3339. Azure does not allow changing it after creation."
  type        = string
  default     = "2026-12-01T00:00:00Z"
}

variable "budget_contact_email" {
  description = "Where budget alerts are sent."
  type        = string
  default     = "hello@nilaygautam.com"
}
