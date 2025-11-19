#!/bin/bash

# Script to disable MongoDB authentication for development

echo "Disabling MongoDB authentication..."

# Stop MongoDB
sudo systemctl stop mongod

# Backup current config
sudo cp /etc/mongod.conf /etc/mongod.conf.backup

# Disable authentication if it's enabled
sudo sed -i 's/^security:/# security:/' /etc/mongod.conf
sudo sed -i 's/^  authorization: enabled/  # authorization: enabled/' /etc/mongod.conf

# Start MongoDB without authentication
sudo systemctl start mongod

echo "MongoDB restarted without authentication"
echo "Waiting for MongoDB to be ready..."
sleep 3

# Test connection
mongosh --eval "db.adminCommand('ping')" 2>/dev/null || mongo --eval "db.adminCommand('ping')"

echo "Done! MongoDB is now running without authentication."
