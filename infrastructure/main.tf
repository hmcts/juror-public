provider "azurerm" {
  features {}
}

locals {
  resourceName = "${var.product}-${var.env}-rg"
  vaultName    = "${var.product}-${var.env}"
}

module "juror-public-redis" {
  source                        = "git@github.com:hmcts/cnp-module-redis?ref=master"
  product                       = "${var.product}-${var.component}-redis-cache"
  location                      = var.location
  env                           = var.env
  common_tags                   = var.common_tags
  private_endpoint_enabled      = true
  redis_version                 = "6"
  business_area                 = "sds"
  public_network_access_enabled = false
  sku_name                      = var.sku_name
  family                        = var.family
  capacity                      = var.capacity
}

data "azurerm_key_vault" "juror" {
  name                = local.vaultName
  resource_group_name = local.resourceName
}

resource "azurerm_key_vault_secret" "redis_connection_string" {
  name         = "${var.component}-redisConnection"
  value        = "rediss://:${urlencode(module.juror-public-redis.access_key)}@${module.juror-public-redis.host_name}:${module.juror-public-redis.redis_port}"
  key_vault_id = data.azurerm_key_vault.juror.id
}

resource "azurerm_monitor_diagnostic_setting" "redis-ds" {
  name                       = "${var.product}-${var.component}-redis-cache"
  target_resource_id         = module.juror-public-redis.id
  log_analytics_workspace_id = module.log_analytics_workspace.workspace_id

  enabled_log {
    category = "AuditEvent"
  }

  lifecycle {
    ignore_changes = [
      metric,
    ]
  }
}

module "log_analytics_workspace" {
  source      = "git@github.com:hmcts/terraform-module-log-analytics-workspace-id.git?ref=master"
  environment = var.env
}
