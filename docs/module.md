# Module

#### Module folder structure can be found in the [Folder Structure](./files.md) section.

## Creating a New Module

### You can also create a module using the CLI

```bash
pnpm cli cm [moduleName in camelCase]
```

**This rule applies to all modules.**

- Create a folder with the module name in the `./src/modules` directory.
- Create a `domain` folder inside the module folder.
-
    - Create a ValueObject folder inside the `domain` folder if the module needs value objects.
- Create a `mapper` folder inside the module folder.
-
    - Create a *Mapper file inside the `mapper` folder. It should contain the mapping logic for the module.
- Create a `repo` file inside the module folder.
-
    - Create a *Repo file inside the `repo` folder. It should contain the repository logic for the module.
- Create a `infra` folder inside the module folder.
-
    - Create a Database folder inside the `infra` folder. Inside the Database folder, create a *Table file. It should
      contain the drizzle-orm table for the module.
-
    - Create a Http inside the `infra` folder if the module needs to make HTTP requests.
- Create a `useCases` folder inside the module folder.
