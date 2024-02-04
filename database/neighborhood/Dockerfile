# Dockerfile

# Use the official MySQL image as the base
FROM mysql:8.0

# Copy the initialization script to the container
COPY ./db/init.sql /docker-entrypoint-initdb.d/

# Expose port 3306
EXPOSE 3306

# Set the default command to run when starting the container
CMD ["mysqld"]