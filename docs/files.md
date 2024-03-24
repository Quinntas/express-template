# Files

### Folder Structure

`./`

- Contains all the configuration/env/docker files and the `src` folder.

`./src` Application files.

- `./src/core` Application core files.
- `./src/infra` Application infrastructure files.
- `./src/modules` Application modules.
- `./src/services` Application and vendor services.
- `./src/types` Application types.
- `./src/utils` Application utilities.

---

### Creating a New Typescript File

**This rule applies to all typescript files if it needs more files outsite of its responsibility.**

*create a folder with the file name and the original file then place the constants in the folder.

- If a file needs new constants *
- If a file needs new DTO's *
- If a file needs new interfaces *
- If a file needs new types *
- If a file needs new enums *
- If a file needs new classes *
- If a file needs new mocks *

---

### File Naming

- **Folders**: Use `kebab-case` for folders.
- **Files**: Use `camelCase` for any kind of file.
- **Classes**: Use `PascalCase` for classes.
- **Interfaces**: Use `PascalCase` for interfaces.
- **Enums**: Use `PascalCase` for enums.
- **Types**: Use `PascalCase` for types.
- **Functions**: Use `camelCase` for functions.
- **Variables**: Use `camelCase` for variables.
- **Constants**: Use `UPPERCASE` for constants.
- **Tests**: Use `*.test.ts` for test files inside the same folder.
- **Mocks**: Use `*.mock.ts` for mock files inside the same folder.

---

### Modules

Modules are the building blocks of the application. Each module should be self-contained and should not depend on other
modules. Each module should have its own directory in `./src/modules`

The shared code should be placed in the `./src/modules/shared` directory.

- `./src/modules/*/domain` Module domain files.
- `./src/modules/*/domain/valueObjects` Module domain value objects.
- `./src/modules/*/infra` Module infrastructure files.
- `./src/modules/*/infra/http` Module http files ie. Router and DecodedRequest.
- `./src/modules/*/infra/database` Module database files ie. The module drizzle-orm tables.
- `./src/modules/*/infra/middleware` Module middleware files.
- `./src/modules/*/mapper` Module mapper files.
- `./src/modules/*/repo` Module repository files.
- `./src/modules/*/useCases` Module useCases.
- `./src/modules/*/utils` Module utilities.


