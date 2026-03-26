terraform {
  cloud {
    organization = "cursosfrontend"
    workspaces {
      name = "hunt-the-bishomalo"
    }
  }
  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }
}

provider "github" {
  owner = var.github_owner
}

resource "github_repository" "repo" {
  name       = "var.repo_name"
  visibility = "public"
}

# Genera JSON de remotes dev
resource "local_file" "mfe_dev" {
  content  = jsonencode(local.mfe_remotes_dev)
  filename = "${path.module}/public/mfe-remotes.dev.json"
}

# Genera JSON de remotes prod
resource "local_file" "mfe_prod" {
  content  = jsonencode(local.mfe_remotes_prod)
  filename = "${path.module}/public/mfe-remotes.prod.json"
}