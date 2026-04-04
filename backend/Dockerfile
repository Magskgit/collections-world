FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt "bcrypt==4.0.1"

# Copy application
COPY . .

# Create static directory
RUN mkdir -p static/images

# Expose port
EXPOSE 8000

# Seed DB and start server
CMD ["sh", "-c", "python seed_data.py && uvicorn main:app --host 0.0.0.0 --port 8000"]
