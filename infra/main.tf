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

variable "github_owner" {
  type = string
}

variable "repo_name" {
  type = string
}

resource "github_repository" "repo" {
  name       = var.repo_name
  visibility = "public"
  # otros parámetros que necesites
}
