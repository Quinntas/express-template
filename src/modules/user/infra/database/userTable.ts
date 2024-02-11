export const userTable = `
    CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT NOT NULL,
    pid VARCHAR(191) NOT NULL,
        email varchar(191) NOT NULL,
        password varchar(191) NOT NULL,
        updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY (email),
        UNIQUE KEY (pid)
    );
`