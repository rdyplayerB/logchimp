# LogChimp on Oracle Cloud Always Free

## Step 1: Create Oracle Cloud Account (5 min)

1. Go to **https://cloud.oracle.com**
2. Click **Sign Up**
3. Fill in your details (credit card required for verification - won't be charged)
4. Select your **Home Region** (pick one close to you - this can't be changed later)
5. Wait for account activation email

## Step 2: Create Always Free VM (5 min)

1. Log into Oracle Cloud Console
2. Click the hamburger menu (☰) → **Compute** → **Instances**
3. Click **Create Instance**

### Configure the instance:

| Setting | Value |
|---------|-------|
| **Name** | `logchimp` |
| **Placement** | Leave default |
| **Image** | Click **Edit** → **Change Image** → Select **Canonical Ubuntu 22.04** (ARM) |
| **Shape** | Click **Edit** → **Change Shape** → **Ampere** → Select **VM.Standard.A1.Flex** |
| **OCPUs** | 4 (max free) |
| **Memory** | 24 GB (max free) |

### Networking:
- Select your VCN or create a new one
- **Assign a public IPv4 address**: Yes

### SSH Keys:
- **Generate a key pair for me** (download both keys!)
- OR paste your existing public key

4. Click **Create**
5. Wait ~2 minutes for it to launch
6. Copy the **Public IP Address** from the instance details

## Step 3: Open Firewall Ports (2 min)

1. On your instance page, click your **Subnet** link
2. Click your **Security List**
3. Click **Add Ingress Rules**
4. Add these rules:

| Source CIDR | Protocol | Dest Port | Description |
|-------------|----------|-----------|-------------|
| `0.0.0.0/0` | TCP | 80 | HTTP |
| `0.0.0.0/0` | TCP | 443 | HTTPS |

## Step 4: Connect & Run Setup (10 min)

```bash
# Connect to your VM (replace with your IP and key path)
ssh -i ~/path/to/private-key ubuntu@YOUR_VM_IP

# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/rdyplayerB/logchimp/master/deploy/oracle-setup.sh -o setup.sh
chmod +x setup.sh
./setup.sh
```

The script will ask for:
- Your domain name (or just use the IP address)
- Email for SSL certificate (optional)
- Database password (make one up)

## Step 5: Point Your Domain (Optional)

If you have a domain, add an **A record**:
- Host: `@` (or `feedback` for a subdomain)
- Points to: Your VM's IP address
- TTL: 300

Then re-run certbot for SSL:
```bash
sudo certbot --nginx -d yourdomain.com
```

## You're Done!

Visit `http://YOUR_IP` (or your domain) and create your admin account.

---

## Useful Commands

```bash
# Check if LogChimp is running
sudo systemctl status logchimp

# View logs
sudo journalctl -u logchimp -f

# Restart after changes
sudo systemctl restart logchimp

# Update LogChimp
cd ~/logchimp
git pull
pnpm install
pnpm build:theme
cd packages/server && pnpm db:migrate
sudo systemctl restart logchimp
```

## Troubleshooting

**Can't connect to VM?**
- Check Oracle security list has ports 22, 80, 443 open
- Check Ubuntu firewall: `sudo ufw status`

**Site not loading?**
- Check nginx: `sudo nginx -t && sudo systemctl status nginx`
- Check app: `sudo systemctl status logchimp`
- Check logs: `sudo journalctl -u logchimp -f`

**Database issues?**
- Check PostgreSQL: `sudo systemctl status postgresql`
- Test connection: `psql -U logchimp -d logchimp -h localhost`
