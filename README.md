PosterBot
=========

Автоматизация отправки новостей в грыппы телеграма и вконтакте.

Installation & Start
--------------------

```
  $ npm install
  $ npm start
```

Docker
------

```
  $ docker build -t posterbot .
  $ docker run -d posterbot
```

Configure
---------
Сервер работает через Firebase. Для подключения к firebase укажите настройки в файле
`./settings/local_settings/firebase.json`:

```
{
"settings": {
    "apiKey": "<API_KEY>",
    "authDomain": "<PROJECT_ID>.firebaseapp.com",
    "databaseURL": "https://<DATABASE_NAME>.firebaseio.com",
    "storageBucket": "<BUCKET>.appspot.com",
    "messagingSenderId": "<SENDER_ID>",
  },
  "auth": {
    "email":"<EMAIL>",
    "password":"<PASSWORD>"
  }
}
```
