# Deploy: first-time setup

You run this once.
After it is done, merging to `main` deploys the site and applies infrastructure changes automatically.

## What gets created

- `infra/bootstrap/` creates the Terraform state storage and the identity GitHub Actions uses to sign in to Azure (OIDC, no stored passwords).
  Its state stays on your machine.
- `infra/` creates the Static Web App, the `nilaygautam.com` custom domain, the monthly budget alerts, and the Cloudflare DNS records and www redirect.
  Its state lives in Azure Storage.

## 1. Azure for Students

1. Activate Azure for Students at https://azure.microsoft.com/free/students with your school email.
2. If it says you are not eligible, use Microsoft's education support at https://aka.ms/azsuportedu.

## 2. Local tools

```sh
brew install azure-cli hashicorp/tap/terraform gh
az login
az account show --query id --output tsv   # your subscription ID
```

## 3. Bootstrap

```sh
cd infra/bootstrap
cp terraform.tfvars.example terraform.tfvars   # put your subscription ID in it
terraform init
terraform apply
```

The storage account name must be unique across all of Azure.
If `nilaygautamtfstate` is taken, set `state_storage_account_name` in `terraform.tfvars` and change `storage_account_name` in `infra/backend.tf` to match.
Keep `infra/bootstrap/terraform.tfstate` somewhere safe, for example a password manager, since it is not stored anywhere else.

## 4. Cloudflare

1. Copy the Zone ID from the `nilaygautam.com` overview page in the Cloudflare dashboard.
2. Create an API token under My Profile > API Tokens > Create Custom Token with only these permissions:
   - Zone > DNS > Edit
   - Zone > Single Redirect > Edit
3. Under Zone Resources, pick Include > Specific zone > `nilaygautam.com`.
4. In DNS, delete any existing `A`, `AAAA`, or `CNAME` records for `nilaygautam.com` and `www`, because Terraform creates them.
   Leave the `MX` and `TXT` records that Email Routing uses alone.
5. In Rules > Redirect Rules, delete any existing redirect rules, because Terraform owns that list.

## 5. GitHub settings

Run these from the repo root, using the values bootstrap printed:

```sh
gh variable set AZURE_CLIENT_ID --body "<AZURE_CLIENT_ID>"
gh variable set AZURE_TENANT_ID --body "<AZURE_TENANT_ID>"
gh variable set AZURE_SUBSCRIPTION_ID --body "<AZURE_SUBSCRIPTION_ID>"
gh variable set CLOUDFLARE_ZONE_ID --body "<zone id>"
gh secret set CLOUDFLARE_API_TOKEN   # paste the token when asked
```

The `production` environment is created the first time a workflow uses it.
You can add protection rules to it later under Settings > Environments.

## 6. First apply and deploy

Once the code is on `main` on GitHub:

```sh
gh workflow run infra.yml
gh workflow run deploy-site.yml
```

Run the second one after the first finishes.
From then on both run automatically on merges to `main`.

## 7. Verify

1. In the Azure portal, open the Static Web App > Custom domains and wait for `nilaygautam.com` to show as Ready.
   Validation and the certificate can take up to an hour.
2. Check the site and the redirect:

```sh
curl -I https://nilaygautam.com                  # 200
curl -I https://www.nilaygautam.com/about        # 301 to https://nilaygautam.com/about
```

3. Send a test email to hello@nilaygautam.com to confirm Email Routing still works.
4. Check Cost Management > Budgets shows `budget-nilaygautam-monthly`.

## Troubleshooting

- **Custom domain stuck validating:** make sure the apex `CNAME` is DNS only (grey cloud) and the `TXT` record has the token from Azure.
- **Ruleset already exists:** a redirect rule was left in the dashboard.
  Delete it, or import it with `terraform import cloudflare_ruleset.redirects zones/<zone id>/<ruleset id>`.
- **Budget creation fails:** some subscription offers do not support budgets.
  Remove `azurerm_consumption_budget_subscription` from `infra/main.tf` and set an alert in the portal instead.
