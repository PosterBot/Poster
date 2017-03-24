PosterBot-Front
===============

Панель управления ботом рассылки новостей

Installation & Start
--------------------

```
  $ npm install
  $ bower install
  $ gulp serve
```

Configure
---------
Сервер работает через Firebase. Для подключения к firebase укажите настройки в файле
`./src/app/settings/firebase.json`:

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
