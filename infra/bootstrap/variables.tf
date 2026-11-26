variable "subscription_id" {
  description = "Azure for Students subscription ID."
  type        = string
}

variable "location" {
  description = "Azure region for the Terraform state resources."
  type        = string
  default     = "centralus"
}

variable "state_storage_account_name" {
  description = "Globally unique name for the Terraform state storage account (3-24 lowercase letters and digits)."
  type        = string
  default     = "nilaygautamtfstate"
}

variable "github_repository" {
  description = "GitHub repository allowed to deploy, as owner/name."
  type        = string
  default     = "NilayGautam/me"
}
