# Using PostgreSQL in Heroku

## Create database

## Pull database from Heroku to local

```sh
heroku pg:pull DATABASE_URL YOUR_LOCAL_DATABASE_NAME --app APP_NAME
```

With:

- `DATABASE_URL`: default value for your database
- `YOUR_LOCAL_DATABASE_NAME`: name databse on your local machine
- `APP_NAME`: name application on heroku

## Push database from local to Heroku

```sh
heroku pg:push YOUR_LOCAL_DATABASE_NAME DATABASE_URL --app APP_NAME
```

With:

- `DATABASE_URL`: default value for your database
- `YOUR_LOCAL_DATABASE_NAME`: name databse on your local machine
- `APP_NAME`: name application on heroku
