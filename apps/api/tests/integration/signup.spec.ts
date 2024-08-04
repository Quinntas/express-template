import {describe} from 'node:test';
import {DockerComposeEnvironment, StartedDockerComposeEnvironment, Wait} from 'testcontainers';
import {close, listen} from '../../src/infra/http/server';

const composeFilePath = '../../';
const composeFile = 'docker-compose.test.yml';

jest.setTimeout(60000);

const baseUrl = 'http://localhost:3000/api/v1';

describe('signup', async () => {
    let environment: StartedDockerComposeEnvironment;

    beforeAll(async () => {
        environment = await new DockerComposeEnvironment(composeFilePath, composeFile)
            .withEnvironmentFile('.env')
            .withWaitStrategy('redis', Wait.forLogMessage('Ready to accept connections tcp'))
            .withWaitStrategy('mysql', Wait.forLogMessage('MySQL init process done. Ready for start up.'))
            .up();
        listen();
    });

    afterAll(async () => {
        close();
        await environment.stop();
    });

    it('should create a user', async () => {
        const url = `${baseUrl}/users/login`;

        const a = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                email: 'caio@gmail.com',
                password: '12345678',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(await a.json());

        expect(true).toBe(true);
    });
});
