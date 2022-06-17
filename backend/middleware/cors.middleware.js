//CORS нужен для использования дополнительного источника (предоставление серверу разрешения использования доп источника браузером)

function cors(req, res, next) {
    //Позволить выполнять все операции Origin
    res.header("Access-Control-Allow-Origin", "*");
    //Позволить выполнять методы GET, PUT, PATCH, POST, DELETE (CRUD-методы)
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    //Позволяет получать информацию о типе файла или папки и авторизацию
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
}

module.exports = cors