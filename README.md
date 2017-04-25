# Djose + Django Rest Framework + Jquery demo

A project using `Django Rest Framework` for server backend, `Djsose` for authentication,
`Jquery` for front-end and `Django Anymail` for mail server backend (Using [Mailgun](https://www.mailgun.com/)).

### Projects relate
 - [Django Rest Framework](http://www.django-rest-framework.org/)
 - [Djose](https://github.com/sunscrapers/djoser)
 - [jQuery](https://jquery.com/)
 - [Django Anymail](https://github.com/anymail/django-anymail)


#### Installation

1. Install requirements

 - Install `virtualenv`
 - Install project requirements:
    ```
        $ pip install -r requirements.txt
    ```

2. Create and correct config file from config template

    ```python
        $ cp djose_demo/secret_config.tmpl.py djose_demo/secret_config.py
    ```

3.  Migrate database

    ```python
        $ python manage.py migrate
    ```

4. Runserver

    ```python
        $ python manage.py migrate
    ```