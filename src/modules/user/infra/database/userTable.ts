export const userTable = `
        CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT NOT NULL,
        pid VARCHAR(191) NOT NULL,
        email varchar(191) NOT NULL,
        password varchar(191) NOT NULL,
        name varchar(191) NOT NULL,
        createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY (pid),
        UNIQUE KEY (email)
    );
`