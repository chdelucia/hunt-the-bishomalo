locals {
  mfe_remotes_dev = {
    achievements = "http://localhost:4201/remoteEntry.js"
  }

  mfe_remotes_prod = {
    achievements = "/remotes/achievements-remote/browser/remoteEntry.js"
  }
}