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
  $ docker run -v <SOME_DIR>:/data -d posterbot/poster
```

Configure
---------
Сервер работает через Firebase. Для подключения к firebase укажите настройки в файле
`/data/firebase.json`:

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
