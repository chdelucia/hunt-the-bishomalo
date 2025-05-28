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

resource "github_repository_pages" "pages" {
  repository = var.repo_name
  source {
    branch = "gh-pages"
    path   = "/"
  }

  build_type = "workflow"
}
