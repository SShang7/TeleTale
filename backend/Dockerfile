# Use python 3.8 image to base container on
FROM python:3.8

# Python output is set straight to the terminal without buffering
ENV PYTHONUNBUFFERED 1

# Set working directory to /api
WORKDIR /api

# Install necessary packages
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copy current directory contents into container at /api
COPY . ./

# Expose port 8000
EXPOSE 8000
