#!/bin/bash

# Post-create script for development container
# This runs after the container is created and features are installed

set -e

echo "🚀 Running post-create setup..."

# Update package lists (features should have done most of the heavy lifting)
sudo apt-get update -y

# Install additional development tools that aren't available as features
sudo apt-get install -y \
    jq \
    htop \
    tree \
    wget \
    unzip \
    build-essential \
    curl \
    vim \
    nano \
    zip \
    ca-certificates \
    gnupg \
    lsb-release

# Install yq for YAML processing
echo "📦 Installing yq for YAML processing..."
sudo wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64
sudo chmod +x /usr/local/bin/yq

# Install kubectl (latest stable version)
echo "☸️ Installing kubectl..."
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install kubectl /usr/local/bin/
rm kubectl

# Install Helm
echo "⛵ Installing Helm..."
curl -fsSL https://get.helm.sh/helm-v3.13.0-linux-amd64.tar.gz | tar -xz
sudo mv linux-amd64/helm /usr/local/bin/
rm -rf linux-amd64

# Install Terraform
echo "🏗️ Installing Terraform..."
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt-get update && sudo apt-get install -y terraform

# Configure git with enhanced settings
echo "🔧 Configuring git..."
git config --global init.defaultBranch main
git config --global pull.rebase false
git config --global core.autocrlf input
git config --global core.editor "code --wait"

# Set git user details (update these with your information)
if [ ! "$(git config --global user.name)" ]; then
    git config --global user.name "Vinodkrishnan"
    git config --global user.email "vinodkrishnanv@users.noreply.github.com"
    echo "✅ Git configured with user details"
else
    echo "ℹ️ Git already configured with user: $(git config --global user.name)"
fi

# Set up docker group permissions for the vscode user
sudo usermod -aG docker vscode

# Ensure Docker daemon is accessible
sudo chmod 666 /var/run/docker-host.sock 2>/dev/null || true

# Clean up
sudo apt-get autoremove -y
sudo apt-get autoclean

# Verify installations
echo ""
echo "🔍 Verifying installations..."
echo "Docker: $(docker --version 2>/dev/null || echo 'Not available')"
echo "Node.js: $(node --version 2>/dev/null || echo 'Not available')"
echo "Python: $(python3 --version 2>/dev/null || echo 'Not available')"
echo "Git: $(git --version 2>/dev/null || echo 'Not available')"
echo "GitHub CLI: $(gh --version 2>/dev/null | head -1 || echo 'Not available')"
echo "kubectl: $(kubectl version --client --short 2>/dev/null || echo 'Not available')"
echo "Helm: $(helm version --short 2>/dev/null || echo 'Not available')"
echo "Terraform: $(terraform --version 2>/dev/null | head -1 || echo 'Not available')"
echo "yq: $(yq --version 2>/dev/null || echo 'Not available')"

echo ""
echo "✅ Post-create setup completed!"
echo "🐳 Docker-in-Docker is available"
echo "🔧 Development tools are ready"
echo "☸️ Kubernetes tools installed"
echo "🏗️ Infrastructure tools available"
echo "🚀 Happy coding!"
