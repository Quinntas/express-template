# Core

#### All the core functions of the library are listed here.

**Base Domain**

- Use this interface to create a domain object.

**Base Mapper**

- Use this class to create a mapper object.

**Base Repo**

- Use this class to create a repository object.

**Errors**

- Use this class to create or throw an error object.
- The InternalError class is used to throw an internal error. It always has a status code of 500 and logs back the error
  to the console. If the NODE_ENV is set to development, it will also send the error message back to the client.
- The HttpError class is used to throw an http error.
- The GuardError class is used to throw a guard error. It always has a status code of 422.

**Guard**

- Use this collection of functions to guard your useCases.

**Handle Request**

- Contains logic and the handler function that is used to handle requests.
- Use method functions to handle requests [POST, GET, PUT...].

**Middleware**

- A collection of middleware util functions that the handler uses.

**Responses**

- Contains the response functions that are used to send responses back to the client.
- Use the objectResponse if you want to send an object in the useCase.
