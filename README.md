# Firehose
Project to manage fire hoses. This project is based on a web-based interface which was realized with Python and Django.

![Screenshot](https://raw.githubusercontent.com/HyP3r-/firehose/master/screenshot.png)

## Installation
This installation was tested on Debian 9 (stretch) but should work on all environments which a current version of python. I decided to use the Apache webserver with mod_wsgi and database MariaDB, but other systems like Ngnix and PostgreSQL can also be used.

### Clone repository and install packages
The first steps are to download the git repository and install the necessary system programs.

1. Go to the directory where you want to install this project: `cd /opt`
2. Install different system packages: `apt-get install apache2 libapache2-mod-wsgi-py3 libmariadbclient-dev mariadb-server python3-pip python3-venv `
3. Clone this repository: `git clone https://github.com/HyP3r-/firehose.git`
4. Change to this directory: `cd firehose`
5. Create a virtual environment: `python3 -m venv venv`
6. Activate this environment `source venv/bin/activate`
7. Install python requirements: `pip install -U -r requirements.txt`

### Configure project and create database
The second step is to configure the database. Make sure you still have the python virtual environment activated.

1. Add those configuration fields to the database configuration (`/etc/mysql/mariadb.conf.d/50-server.cnf`), this activate the new Barracuda file format:
    ```
    innodb_default_row_format = dynamic
    innodb_file_format = Barracuda
    innodb_file_per_table = ON
    innodb_large_prefix = ON
    ```
2. Create a database user and a new database to connect to (change the user name, database name, and password if you want):
    ```
    root@example:/opt/firehose# mysql
    mysql> CREATE DATABASE `firehose`;
    mysql> CREATE USER 'firehose'@'localhost' IDENTIFIED BY 'password';
    mysql> GRANT ALL privileges ON `firehose`.* TO 'firehose'@localhost;
    mysql> FLUSH PRIVILEGES;
    ```
3. Update database connection configuration in `config/my.cnf` (username, password and database name)
4. Create database tables: `python manage.py migrate`
5. Create first user: `python manage.py createsuperuser`

### Make adjustments to the web server
The last step is to configure the web interface, i.e. apache. 

1. Activate the necessary module: `a2enmod wsgi` 
2. Add the following lines to your web configuration:
    ```
    WSGIDaemonProcess example.com python-home=/opt/firehose/venv python-path=/opt/firehose/web
    WSGIProcessGroup example.com
    WSGIScriptAlias / /opt/firehose/web/firehose/wsgi.py process-group=example.com
    
    Alias /favicon.ico /opt/firehose/web/static/hose/img/firefighter.ico
    
    Alias /static/ /opt/firehose/web/static/
    
    <Directory /opt/firehose/web/static>
        Require all granted
    </Directory>
    
    <Directory /opt/firehose/web/firehose>
        <Files wsgi.py>
            Require all granted
        </Files>
    </Directory>
    ```
3. Restart the apache service: `service apache2 restart`
4. Now you can login to the web interface with the user account

## Usage

### Administration
The system can generally be managed under the URL `/admin`. On this page users can be created and other tables in the database can be adapted.

### User registration and operation 
The actual project can be retrieved under the URL `/`. 
