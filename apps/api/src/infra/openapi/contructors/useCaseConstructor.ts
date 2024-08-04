import {OpenAPIV3} from 'openapi-types';

export interface OpenapiUseCaseSchemaConfigResponse {
    code: number;
    description: string;
    schema: {
        [key: string]: OpenAPIV3.NonArraySchemaObject;
    };
}

export type OpenapiUseCaseSchemaConfig = {
    path: string;
    patterns: {
        method: OpenAPIV3.HttpMethods;
        tags: string[];
        description: string;
        summary: string;
        responses: OpenapiUseCaseSchemaConfigResponse[];
        requestBody?: {
            schema: {
                [key: string]: OpenAPIV3.NonArraySchemaObject;
            };
        };
    }[];
};

export function mapToObject<T>(arr: T[], fn: (item: T) => any) {
    return arr.reduce((acc, item) => {
        return {
            ...acc,
            ...fn(item),
        };
    }, {});
}

export function constructOpenapiUseCaseSchema(config: OpenapiUseCaseSchemaConfig) {
    return {
        [config.path]: {
            ...mapToObject(config.patterns, (pattern) => {
                return {
                    [pattern.method]: {
                        tags: pattern.tags,
                        description: pattern.description,
                        summary: pattern.summary,
                        responses: mapToObject(pattern.responses, (response) => {
                            return {
                                [response.code]: {
                                    description: response.description,
                                    content: {
                                        'application/json': {
                                            schema: {
                                                type: 'object',
                                                properties: response.schema,
                                            },
                                        },
                                    },
                                },
                            };
                        }),
                        requestBody: pattern.requestBody
                            ? {
                                  required: true,
                                  content: {
                                      'application/json': {
                                          schema: {
                                              type: 'object',
                                              properties: pattern.requestBody.schema,
                                          },
                                      },
                                  },
                              }
                            : undefined,
                    },
                };
            }),
        },
    };
}
