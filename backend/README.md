# Setup

We use a virtual environment to manage the backend dependencies and keep development environments synced across
machines. Run the following commands to get started:

```
$ cd backend
$ python3 -m venv .venv                       # create a virtual environment
$ source .venv/bin/activate                   # activate the virtual environment
(.venv)$ pip3 install --upgrade pip3          # update pip to the newest version
(.venv)$ pip3 install -r requirements.txt     # install dependencies
```

You'll have to run `source .venv/bin/activate` whenever you start a new shell and need to activate the virtual
environment.

# Development

This project uses Django 4.1 for the backend. For reference, check out the official
[Django documentation](https://docs.djangoproject.com/en/4.1/), which contains tutorials, reference guides, and more.

If you add/remove/update one of the dependencies, make sure you update the requirements.txt file. You can do so by
running `python3 freeze > requirements.txt`. This updates the list of dependencies. If someone else has updated
`requirements.txt`, make sure to run `pip3 install -r requirements.txt`.

To start the server, run the following from this directory:

```
(.venv)$ python3 manage.py migrate            # apply migrations, if any (updating the database schema)
(.venv)$ python3 manage.py runserver
```

By default, the server runs at http://127.0.0.1:8000/.

To run tests, run the following from this directory:

```
(.venv)$ python3 manage.py test <APP_NAME>
```

