#!/bin/bash
# Auto-setup script for git worktree
# Copies .env.example and updates PORT and DATABASE_URL automatically
#
# Usage (by Copilot Agent after creating worktree):
#   ./scripts/setup-worktree.sh

set -e

echo "🚀 Auto-configuring worktree environment..."

# Auto-detect branch name
BRANCH_NAME=$(git branch --show-current)
if [ -z "$BRANCH_NAME" ]; then
    echo "❌ Error: Could not detect branch name"
    exit 1
fi

echo "📌 Branch: $BRANCH_NAME"

# Generate schema name (sanitize branch name for PostgreSQL)
SCHEMA_NAME=$(echo "$BRANCH_NAME" | sed 's/[^a-zA-Z0-9_]/_/g' | tr '[:upper:]' '[:lower:]')
echo "📊 Schema: $SCHEMA_NAME"

# Find available app port (3000-3099)
find_available_port() {
    local start_port=$1
    local end_port=$2
    
    for port in $(seq $start_port $end_port); do
        if ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo $port
            return 0
        fi
    done
    echo $start_port
}

APP_PORT=$(find_available_port 3000 3099)
echo "🌐 App Port: $APP_PORT"

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "❌ Error: .env.example not found"
    exit 1
fi

# Copy .env.example to .env
cp .env.example .env
echo "✅ Copied .env.example to .env"

# Update PORT in .env
sed -i.bak "s/^PORT=.*/PORT=$APP_PORT/" .env && rm .env.bak

# Check if shared PostgreSQL is running
if docker ps --format '{{.Names}}' | grep -q "^express-postgres$"; then
    echo "🐘 Using shared PostgreSQL"
    
    # Update DATABASE_URL to use isolated schema
    sed -i.bak "s|schema=public|schema=$SCHEMA_NAME|" .env && rm .env.bak
    echo "   Schema: $SCHEMA_NAME (isolated)"
else
    echo "⚠️  Shared PostgreSQL not running. Setting up isolated mode."
    DB_PORT=$(find_available_port 5433 5499)
    
    # Update DATABASE_URL to use different port
    sed -i.bak "s|localhost:5432|localhost:$DB_PORT|" .env && rm .env.bak
    
    # Create docker-compose override for isolated DB
    cat > docker-compose.override.yml << EOF
# Auto-generated for isolated PostgreSQL
version: '3.8'

services:
  postgres:
    container_name: postgres-$SCHEMA_NAME
    ports:
      - "$DB_PORT:5432"

volumes:
  postgres_data:
    name: postgres_data_$SCHEMA_NAME
EOF
    
    echo "📝 Created docker-compose.override.yml"
    echo "   PostgreSQL Port: $DB_PORT"
fi

echo ""
echo "✅ Worktree configured!"
echo ""
echo "📋 Next steps:"
echo "   npm install"
echo "   npm run prisma:migrate"
echo "   npm run dev  # http://localhost:$APP_PORT"
