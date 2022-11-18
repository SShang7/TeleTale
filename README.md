# TeleTale [![CI Workflow](https://github.com/SShang7/TeleTale/actions/workflows/ci.yml/badge.svg)](https://github.com/SShang7/TeleTale/actions/workflows/ci.yml)

Game that you play with your friends to author your own picture book!

## Live Deployment

- Frontend: [https://tele-tale.fly.dev](https://tele-tale.fly.dev)
- Backend: [https://tele-tale-api.fly.dev](https://tele-tale.fly.dev)
- API Docs: [https://tele-tale-api.fly.dev/docs](https://tele-tale-api.fly.dev/docs)

## Setup and development

We use [Docker](https://docs.docker.com/get-docker/) to containerize the application and maintain a
consistent development environment across different machines. We use `npm` and `pip` for package
management for the [ReactJS](https://reactjs.org/docs/getting-started.html) frontend and the
[Django](https://docs.djangoproject.com/en/4.1/) backend, respectively.

To start the application, run `docker-compose up -d`. To stop the application, run
`docker-compose down -v`. The frontend will run at http://localhost:3000 while the backend will run at
http://localhost:8000. Any code changes should auto-reload the application.

For Google OAuth login, you must create a `.env` file in the `backend` directory. It should look
like the following:

```
DJANGO_GOOGLE_OAUTH2_CLIENT_ID=<client_id>
DJANGO_GOOGLE_OAUTH2_CLIENT_SECRET=<client_secret>
```

`<client_id>` and `<client_secret>` should be replaced with their proper values.

## Useful commands

- `$ docker-compose exec backend bash`: Starts a shell in the backend container
  - You can run `python manage.py test [APP_NAME]` to run unit tests
  - You can also manage dependencies using `pip install` and `pip freeze` here
  - Use Ctrl+D to exit
- `$ docker-compose logs -f --tail=50 backend`: Follows the last 50 lines in the backend logs
  - Use Ctrl+C to exit
- `$ docker-compose ps`: Views status of all docker containers

## References

- [Official Django documentation](https://docs.djangoproject.com/en/4.1/)
- [Google OAuth tutorial](https://www.hacksoft.io/blog/google-oauth2-with-django-react-part-1)
- [Simple Redux tutorial](https://medium.com/mad-semicolon/fetch-initial-data-on-page-load-in-react-redux-application-16f4d8228543)
- [Official React Router v6 tutorial](https://reactrouter.com/en/dev/start/tutorial)
- [Material UI App Bar reference](https://reactrouter.com/en/dev/start/tutorial)
- [Containerizing a web app tutorial](https://medium.com/@gagansh7171/dockerize-your-django-and-react-app-68a7b73ab6e9)
- [Django REST framework testing](https://www.django-rest-framework.org/api-guide/testing/)
- [Django Channels example](https://github.com/aduranil/django-channels-react-multiplayer)
- [Django Channels JWT authentication](https://stackoverflow.com/questions/65297148/django-channels-jwt-authentication)
- [React Chat UI](https://github.com/chatscope/chat-ui-kit-react)
