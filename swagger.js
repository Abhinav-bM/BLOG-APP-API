const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'A simple Express Blog API',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Make sure this matches your server URL
      },
    ],
    components: {
      schemas: {
        Blog: {
          type: 'object',
          required: ['title', 'content', 'author'],
          properties: {
            title: {
              type: 'string',
              description: 'The blog title',
            },
            content: {
              type: 'string',
              description: 'The blog content',
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'An array of image URLs',
            },
            author: {
              type: 'string',
              description: 'The user ID of the blog author',
            },
            comments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  user: {
                    type: 'string',
                    description: 'The user ID of the commenter',
                  },
                  text: {
                    type: 'string',
                    description: 'The comment text',
                  },
                },
              },
              description: 'An array of comments',
            },
            reviews: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  user: {
                    type: 'string',
                    description: 'The user ID of the reviewer',
                  },
                  rating: {
                    type: 'number',
                    minimum: 1,
                    maximum: 5,
                    description: 'The review rating',
                  },
                  content: {
                    type: 'string',
                    description: 'The review content',
                  },
                },
              },
              description: 'An array of reviews',
            },
          },
        },
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'The user\'s name',
            },
            email: {
              type: 'string',
              description: 'The user\'s email',
            },
            password: {
              type: 'string',
              description: 'The user\'s password',
            },
            following: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'An array of user IDs this user is following',
            },
            followers: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'An array of user IDs following this user',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
