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

# Find available app port (3001-3099 for worktrees)
# Port 3000 is reserved for main repository
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

# Worktrees start from 3001 to avoid conflict with main repo (3000)
APP_PORT=$(find_available_port 3001 3099)
echo "🌐 App Port: $APP_PORT (worktree isolated)"

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "❌ Error: .env.example not found"
    exit 1
fi

# Copy .env.example to .env
cp .env.example .env
echo "✅ Copied .env.example to .env"

# Update PORT in .env
if sed -i.bak "s/^PORT=.*/PORT=$APP_PORT/" .env && rm .env.bak; then
    ACTUAL_PORT=$(grep "^PORT=" .env | cut -d= -f2)
    if [ "$ACTUAL_PORT" = "$APP_PORT" ]; then
        echo "✅ Updated PORT to $APP_PORT"
    else
        echo "⚠️  Warning: PORT may not have been updated correctly"
    fi
else
    echo "❌ Error: Failed to update PORT in .env"
    exit 1
fi

# Check if shared PostgreSQL is running
if docker ps --format '{{.Names}}' | grep -q "^express-postgres$"; then
    echo "🐘 Database Mode: SHARED PostgreSQL"
    echo "   ├─ Container: express-postgres (localhost:5432)"
    echo "   └─ Schema: $SCHEMA_NAME (isolated)"
    
    # Update DATABASE_URL to use isolated schema
    if sed -i.bak "s|schema=public|schema=$SCHEMA_NAME|" .env && rm .env.bak; then
        echo "✅ Updated DATABASE_URL with isolated schema"
    else
        echo "❌ Error: Failed to update DATABASE_URL"
        exit 1
    fi
else
    echo "⚠️  Shared PostgreSQL not running"
    echo "🐘 Database Mode: ISOLATED PostgreSQL"
    DB_PORT=$(find_available_port 5433 5499)
    echo "   ├─ Container: postgres-$SCHEMA_NAME"
    echo "   ├─ Port: $DB_PORT"
    echo "   └─ Schema: public"
    
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
    
    echo "✅ Created docker-compose.override.yml"
    echo ""
    echo "⚠️  Next: Start isolated PostgreSQL with 'npm run docker:up'"
fi

echo ""
echo "✅ Worktree configured successfully!"
echo ""
echo "📋 Configuration:"
echo "   ├─ Branch: $BRANCH_NAME"
echo "   ├─ App Port: $APP_PORT"
echo "   └─ DB Schema: $SCHEMA_NAME"
echo ""
echo "📋 Next steps:"
echo "   1. npm install"
echo "   2. npm run prisma:migrate"
echo "   3. npm run dev  # http://localhost:$APP_PORT"
echo ""
echo "💡 Tip: Each worktree runs on a separate port with isolated schema"
