#!/bin/sh
set -e

cd /app/backend

echo "Running migrations..."
python manage.py migrate --noinput

echo "Starting gunicorn in background..."
gunicorn khodroban_prj.wsgi:application --bind 127.0.0.1:8000 --workers 2 --daemon

echo "Starting cron..."
crond -b -l 2

echo "Starting nginx..."
exec nginx -g "daemon off;"
