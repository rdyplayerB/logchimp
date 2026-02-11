#!/bin/bash
set -e

# LogChimp Oracle Cloud Setup Script
# Run this on a fresh Ubuntu 22.04 ARM instance

echo "=== LogChimp Setup for Oracle Cloud Always Free ==="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}Please run as a regular user, not root${NC}"
    exit 1
fi

# Get domain/IP for configuration
read -p "Enter your domain name (or IP address if no domain): " DOMAIN
read -p "Enter email for SSL certificate (or press enter to skip SSL): " SSL_EMAIL
read -sp "Enter a password for PostgreSQL database: " DB_PASSWORD
echo ""

echo -e "${GREEN}Starting installation...${NC}"

# Update system
echo -e "${YELLOW}Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
sudo apt install -y curl git nginx postgresql postgresql-contrib ufw

# Install Node.js 18 (required by pnpm)
echo -e "${YELLOW}Installing Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
echo -e "${YELLOW}Installing pnpm...${NC}"
sudo npm install -g pnpm

# Configure PostgreSQL
echo -e "${YELLOW}Configuring PostgreSQL...${NC}"
sudo -u postgres psql -c "CREATE USER logchimp WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE logchimp OWNER logchimp;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE logchimp TO logchimp;"

# Clone LogChimp
echo -e "${YELLOW}Cloning LogChimp...${NC}"
cd ~
if [ -d "logchimp" ]; then
    cd logchimp && git pull
else
    git clone https://github.com/rdyplayerB/logchimp.git
    cd logchimp
fi

# Install dependencies
echo -e "${YELLOW}Installing LogChimp dependencies...${NC}"
pnpm install

# Create environment file
echo -e "${YELLOW}Creating configuration...${NC}"
cat > ~/logchimp/packages/server/.env << EOF
NODE_ENV=production
PORT=3000
SECRET_KEY=$(openssl rand -hex 32)

# Database
DB_HOST=localhost
DB_USER=logchimp
DB_PASSWORD=$DB_PASSWORD
DB_DATABASE=logchimp
DB_PORT=5432
DB_SSL=false

# Server URL (used for emails, etc)
SERVER_URL=http://$DOMAIN
EOF

# Build the theme
echo -e "${YELLOW}Building frontend...${NC}"
cd ~/logchimp
pnpm build:theme

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
cd ~/logchimp/packages/server
pnpm db:migrate

# Create systemd service
echo -e "${YELLOW}Creating systemd service...${NC}"
sudo tee /etc/systemd/system/logchimp.service > /dev/null << EOF
[Unit]
Description=LogChimp Feedback Portal
After=network.target postgresql.service

[Service]
Type=simple
User=$USER
WorkingDirectory=/home/$USER/logchimp/packages/server
ExecStart=/usr/bin/node index.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable logchimp
sudo systemctl start logchimp

# Configure Nginx
echo -e "${YELLOW}Configuring Nginx...${NC}"
sudo tee /etc/nginx/sites-available/logchimp > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Frontend (Vue app)
    location / {
        root /home/$USER/logchimp/packages/theme/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Static uploads
    location /uploads {
        alias /home/$USER/logchimp/packages/server/uploads;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/logchimp /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Configure firewall
echo -e "${YELLOW}Configuring firewall...${NC}"
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# SSL with Let's Encrypt (if email provided)
if [ -n "$SSL_EMAIL" ]; then
    echo -e "${YELLOW}Setting up SSL...${NC}"
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d $DOMAIN --email $SSL_EMAIL --agree-tos --non-interactive
fi

echo ""
echo -e "${GREEN}=== Setup Complete! ===${NC}"
echo ""
echo "LogChimp is now running at: http://$DOMAIN"
echo ""
echo "Next steps:"
echo "1. Visit your site and create an admin account"
echo "2. Configure your site settings in the dashboard"
echo ""
echo "Useful commands:"
echo "  sudo systemctl status logchimp  - Check status"
echo "  sudo systemctl restart logchimp - Restart server"
echo "  sudo journalctl -u logchimp -f  - View logs"
