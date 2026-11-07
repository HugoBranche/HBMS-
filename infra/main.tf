terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  host = "npipe:////.//pipe//dockerDesktopLinuxEngine"
}

resource "docker_image" "nginx" {
  name         = "nginx:latest"
  keep_locally = false
}

resource "docker_container" "staging" {
  name  = "scm-staging"
  image = docker_image.nginx.image_id

  ports {
    internal = 80
    external = 8080
  }
}