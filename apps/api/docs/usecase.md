# Usecase

By default, usecases are **not** routes, they are just a piece of the domain.

### Typography

- Inherits the typography from the project

### Sub Components

#### Constants

`xxxx.constants.ts`

- If the useCase needs constants, they should be defined in the `constants` folder
    - Example: [User Login](../src/modules/user/useCases/userLogin/userLogin.constants.ts)

#### Errors

`xxxx.errors.ts`

- If the useCase needs custom errors, they should be defined in the `errors` folder
    - Example: [User Login](../src/modules/user/useCases/userLogin/userLogin.errors.ts)

#### DTO

`xxxx.dto.ts`

- UseCase should have a DTO for the data entering and exiting itself, plus any interfaces that are needed
    - Example: [User Login](../src/modules/user/useCases/userLogin/userLogin.dto.ts)

#### Controller

`xxxx.controller.ts`

- If the useCase will be used as a route, it should have a controller, must obey the following type:
    - [Controller](../src/lib/types/controller.ts)
    - Example: [User Login](../src/modules/user/useCases/userLogin/userLogin.controller.ts)

#### Usecase

`xxxx.usecase.ts`

- The useCase itself, must obey the following type:
    - [UseCaseType](../src/lib/types/useCase.ts)
    - Example: [User Login](../src/modules/user/useCases/userLogin/userLogin.usecase.ts)
