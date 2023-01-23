# api-doutor-consulta-pet

### remember to config your .env!

<br>

useful links:

- https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-typescript
- https://github.com/microsoft/vscode-azure-account/wiki/Troubleshooting#unable-to-list-subscriptions

For error:

```
 [error] Worker b8062a76-d6c8-487a-816f-d3c8ec67e047 uncaught exception (learn more: https://go.microsoft.com/fwlink/?linkid=2097909 ): Error: Access denied for user 'root'@'172.17.0.1' to database 'db_dogtor'     at Packet.asError (/Users/kcalixto/go/src/api-doutor-consulta-pet/node_modules/mysql2/lib/packets/packet.js:728:17)
```

use:

```
CREATE USER 'root'@'172.17.0.1' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'172.17.0.1' WITH GRANT OPTION;
flush privileges;
```
