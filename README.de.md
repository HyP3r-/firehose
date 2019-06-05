# Firehose
Projekt zur Verwaltung von Feuerwehrschläuchen. Dieses Projekt basiert auf einer webbasierten Oberfläche, die mit Python und Django realisiert wurde.

## Installation
Diese Installation wurde unter Debian 9 (stretch) getestet, sollte aber in allen Umgebungen funktionieren, die eine aktuelle Version von Python haben. Ich habe mich für den Webserver Apache mit mod_wsgi und Datenbank MariaDB entschieden, es können aber auch andere Systeme wie Ngnix und PostgreSQL verwendet werden.

### Repository klonen und Pakete installieren
Die ersten Schritte sind das Herunterladen des Git-Repository und die Installation der notwendigen Systemprogramme.

1. Wechseln Sie in das Verzeichnis, in dem Sie dieses Projekt installieren möchten.: `cd /opt`
2. Installieren Sie verschiedene Systempakete: `apt-get install apache2 libapache2-mod-wsgi-py3 libmariadbclient-dev mariadb-server python3-pip python3-venv`
3. Dieses Repository klonen: `git clone https://github.com/HyP3r-/firehose.git`
4. In dieses Verzeichnis wechseln: `cd firehose`
5. Erstelle eine Virtualle Python Umgebung: `python3 -m venv venv`
6. Aktivieren Sie diese Umgebung `source venv/bin/activate`
7. Installieren Sie die Python Pakete: `pip install -U -r requirements.txt`

### Projekt konfigurieren und Datenbank erstellen
Der zweite Schritt ist die Konfiguration der Datenbank. Stellen Sie sicher, dass Sie die virtuelle Python-Umgebung noch aktiviert haben.

1. Fügen Sie diese Konfigurationsfelder der Datenbankkonfiguration hinzu (`/etc/mysql/mariadb.conf.d/50-server.cnf`), dies aktiviert das neue Barracuda-Dateiformat:
    ```
    innodb_default_row_format = dynamic
    innodb_file_format = Barracuda
    innodb_file_per_table = ON
    innodb_large_prefix = ON
    ```
2. Erstellen Sie einen Datenbankbenutzer und eine neue Datenbank, zu der eine Verbindung hergestellt werden kann (ändern Sie den Benutzernamen, den Namen der Datenbank und das Passwort, wenn Sie möchten):
    ```
    root@example:/opt/firehose# mysql
    mysql> CREATE DATABASE `firehose`;
    mysql> CREATE USER 'firehose'@'localhost' IDENTIFIED BY 'password';
    mysql> GRANT ALL privileges ON `firehose`.* TO 'firehose'@localhost;
    mysql> FLUSH PRIVILEGES;
    ```
3. Aktualisieren dementsprechend die Konfiguration der Datenbankverbindung in `config/my.cnf` (Benutzername, Passwort und Datenbankname)
4. Erstellen von Datenbanktabellen: `python manage.py migrate`
5. Ersten Benutzer anlegen: `python manage.py createsuperuser`

### Anpassungen am Webserver vornehmen
Der letzte Schritt ist die Konfiguration des Webservers. 

1. Aktivieren Sie das erforderliche Modul: `a2enmod wsgi` 
2. Fügen Sie die folgenden Zeilen zu Ihrer Web-Konfiguration hinzu:
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
3. Starten Sie den den apache Dienst neu: `service apache2 restart`
4. Jetzt können Sie sich mit dem Benutzerkonto auf der Weboberfläche anmelden

## Benutzung

### Administration
Das System kann generell unter der URL `/admin` verwaltet werden. Auf dieser Seite können Benutzer angelegt und andere Tabellen in der Datenbank angepasst werden.

### Benutzeranmeldung und Benutzung
Das eigentliche Projekt kann unter der URL / abgerufen werden. 
