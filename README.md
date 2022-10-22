# TeleTale
Game that you play with your friends to author your own picture book!

## Setup and development

We use [Docker](https://docs.docker.com/get-docker/) to containerize the application and maintain a
consistent development environment across different machines. We use `npm` and `pip` for package
management for the ReactJS frontend and the Django backend, respectively.

To start the application, run `docker-compose start`. To stop the application, run
`docker-compose stop`. The frontend will run at http://localhost:3000 while the backend will run at
http://localhost:8000. Any code changes should auto-reload the application.

For Google OAuth login, you must create a `.env` file in the `backend` directory. It should look
like the following:
```
DJANGO_GOOGLE_OAUTH2_CLIENT_ID=<client_id>
DJANGO_GOOGLE_OAUTH2_CLIENT_SECRET=<client_secret>
```
`<client_id>` and `<client_secret>` should be replaced with their proper values.

## Useful commands

* `$ docker-compose exec backend bash`: Starts a shell in the backend container
    * You can run `python manage.py test [APP_NAME]` to run unit tests
    * You can also manage dependencies using `pip install` and `pip freeze` here
    * Use Ctrl+D to exit
* `$ docker-compose logs -f --tail=50 backend`: Follows the last 50 lines in the backend logs
    * Use Ctrl+C to exit
* `$ docker-compose ps`: Views status of all docker containers

## References

* [Google OAuth tutorial](https://www.hacksoft.io/blog/google-oauth2-with-django-react-part-1)
