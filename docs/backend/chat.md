# Backend chat API

## Endpoints


| Method | URL                          | Description                            |
| ------ | ---------------------------- | -------------------------------------- |
| GET    | /chat/online                 | Get the list of all online users       |
| GET    | /chat/rooms                  | Get the list of all chat rooms         |
| GET    | /chat/rooms/<id>             | Get the info for a specific chat room  |
| POST   | /chat/rooms                  | Create a new chat room                 |
| GET    | /chat/rooms/<id>/messages    | get messages for a chatroom            |
| POST   | /chat/rooms/<id>/messages    | post new message for a chatroom        |
| POST   | /chat/rooms/<id>/kick/<user> | Kick a user                            |
| POST   | /chat/rooms/<id>/ban/<user>  | Ban a user                             |
| POST   | /chat/rooms/<id>/add/<user>  | Add user to a chatroom                 |
| POST   | /chat/block/<user>           | Block a user                           |
| POST   | /chat/unblock/<user>         | Block a user                           |
| GET    | /chat/<user>                 | get direct messages with some user     |
| POST   | /chat/<user>                 | post a new direct message to some user |



## Questions

* Quand utiliser les fonctions `async` ?
* Que met-on dans un controller / un service ?
* Comment structurer les fichiers ? Un seul controller pour le chat ?
* Comment s'authentifier pour les channels ? (private, msg author, admin rights...)
* Database: where vs select
