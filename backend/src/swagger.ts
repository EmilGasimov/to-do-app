import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Todo API",
            version: "1.0.0",
            description: "REST API for the Todo List application",
        },

        servers: [
            {
                url: "http://localhost:5001",
                description: "Local development server",
            },
        ],

        components: {
            schemas: {
                Todo: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            example: "68a3f5c9e123456789abcdef",
                        },
                        text: {
                            type: "string",
                            maxLength: 100,
                            example: "Study Angular",
                        },
                        completed: {
                            type: "boolean",
                            example: false,
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },

                CreateTodo: {
                    type: "object",
                    required: ["text"],
                    properties: {
                        text: {
                            type: "string",
                            maxLength: 100,
                            example: "Study Vue.js",
                        },
                    },
                },

                UpdateTodo: {
                    type: "object",
                    properties: {
                        text: {
                            type: "string",
                            maxLength: 100,
                            example: "Study Svelte",
                        },
                        completed: {
                            type: "boolean",
                            example: true,
                        },
                    },
                },
            },
        },
    },

    apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);