import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Tutorial',
  description: 'Programming Tutorials',
  base: '/doc01/',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/doc01/favicon.svg' }],
  ],

  themeConfig: {
    search: {
      provider: 'local'
    }
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        logo: '/favicon.svg',
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/guide/' },
          {
            text: 'Frontend',
            items: [
              { text: 'HTML', link: '/guide/html/' },
              { text: 'CSS', link: '/guide/css/' },
              { text: 'JavaScript', link: '/guide/javascript/' },
              { text: 'TypeScript', link: '/guide/typescript/' },
              { text: 'React', link: '/guide/react/' },
              { text: 'Vue.js', link: '/guide/vue/' }
            ]
          },
          {
            text: 'Backend',
            items: [
              { text: 'Node.js', link: '/guide/nodejs/' },
              { text: 'Express', link: '/guide/express/' },
              { text: 'NestJS', link: '/guide/nestjs/' },
              { text: 'Hono', link: '/guide/hono/' },
              { text: 'Python', link: '/guide/python/' },
              { text: 'C#', link: '/guide/csharp/' },
              { text: '.NET', link: '/guide/dotnet/' }
            ]
          },
          {
            text: 'DevOps',
            items: [
              { text: 'Docker', link: '/guide/docker/' }
            ]
          },
          { text: 'AI', link: '/guide/ai/' },
          { text: 'Author', link: '/creator' }
        ],
        sidebar: {
          '/guide/': [
            {
              text: 'Fundamentals',
              items: [
                { text: 'Introduction', link: '/guide/' },
                { text: 'What is a Website?', link: '/guide/fundamentals/what-is-website' },
                { text: 'How the Web Works', link: '/guide/fundamentals/how-web-works' },
                { text: 'Web Development Overview', link: '/guide/fundamentals/web-development-overview' },
                { text: 'Getting Started', link: '/guide/fundamentals/getting-started' }
              ]
            },
            {
              text: 'Development Environment',
              items: [
                { text: 'Command Line Basics', link: '/guide/environment/command-line' },
                { text: 'Code Editors', link: '/guide/environment/code-editors' },
                { text: 'Package Managers', link: '/guide/environment/package-managers' }
              ]
            },
            {
              text: 'Essential Skills',
              items: [
                { text: 'Developer Tools', link: '/guide/skills/developer-tools' },
                { text: 'Version Control (Git)', link: '/guide/skills/version-control' },
                { text: 'Debugging Basics', link: '/guide/skills/debugging' },
                { text: 'APIs & Data Fetching', link: '/guide/skills/apis-data-fetching' },
                { text: 'Working with Forms', link: '/guide/skills/forms' },
                { text: 'JSON & Data Formats', link: '/guide/skills/json-data' },
                { text: 'Regular Expressions', link: '/guide/skills/regex' },
                { text: 'Web Storage', link: '/guide/skills/web-storage' }
              ]
            },
            {
              text: 'Best Practices',
              items: [
                { text: 'Responsive Design', link: '/guide/best-practices/responsive-design' },
                { text: 'Web Accessibility', link: '/guide/best-practices/web-accessibility' },
                { text: 'Web Performance', link: '/guide/best-practices/web-performance' },
                { text: 'Web Security', link: '/guide/best-practices/web-security' },
                { text: 'Browser Compatibility', link: '/guide/best-practices/browser-compatibility' },
                { text: 'SEO Basics', link: '/guide/best-practices/seo-basics' }
              ]
            },
            {
              text: 'Deployment',
              items: [
                { text: 'Web Hosting & Deployment', link: '/guide/deployment/web-hosting' }
              ]
            },
            {
              text: 'Tutorials',
              items: [
                { text: 'HTML', link: '/guide/html/' },
                { text: 'CSS', link: '/guide/css/' },
                { text: 'JavaScript', link: '/guide/javascript/' },
                { text: 'TypeScript', link: '/guide/typescript/' },
                { text: 'React', link: '/guide/react/' },
                { text: 'Node.js', link: '/guide/nodejs/' },
                { text: 'Express', link: '/guide/express/' },
                { text: 'NestJS', link: '/guide/nestjs/' },
                { text: 'Hono', link: '/guide/hono/' },
                { text: 'Python', link: '/guide/python/' },
                { text: 'C#', link: '/guide/csharp/' },
                { text: '.NET', link: '/guide/dotnet/' },
                { text: 'Docker', link: '/guide/docker/' },
                { text: 'AI & Machine Learning', link: '/guide/ai/' },
                { text: 'Vue.js', link: '/guide/vue/' }
              ]
            }
          ],
          '/guide/vue/': [
            {
              text: 'Vue.js Tutorial',
              items: [
                { text: 'Introduction', link: '/guide/vue/' },
                {
                  text: 'Beginner',
                  collapsed: false,
                  items: [
                    { text: 'Getting Started', link: '/guide/vue/01-introduction' },
                    { text: 'Template Syntax', link: '/guide/vue/02-template-syntax' },
                    { text: 'Components & Props', link: '/guide/vue/03-components' }
                  ]
                },
                {
                  text: 'Intermediate',
                  collapsed: false,
                  items: [
                    { text: 'Reactivity & State', link: '/guide/vue/04-reactivity' },
                    { text: 'Event Handling', link: '/guide/vue/05-events' },
                    { text: 'Computed & Watchers', link: '/guide/vue/06-computed-watchers' }
                  ]
                },
                {
                  text: 'Advanced',
                  collapsed: false,
                  items: [
                    { text: 'Form Handling', link: '/guide/vue/07-forms' },
                    { text: 'Lifecycle Hooks', link: '/guide/vue/08-lifecycle' },
                    { text: 'Composables', link: '/guide/vue/09-composables' },
                    { text: 'Vue Router', link: '/guide/vue/10-routing' }
                  ]
                }
              ]
            }
          ],
          '/guide/html/': [
            {
              text: 'HTML Tutorial',
              items: [
                { text: 'Introduction', link: '/guide/html/' },
                {
                  text: 'Beginner',
                  collapsed: false,
                  items: [
                    { text: 'Basics', link: '/guide/html/01-basics' },
                    { text: 'Text & Typography', link: '/guide/html/02-text' },
                    { text: 'Links & Images', link: '/guide/html/03-links-images' }
                  ]
                },
                {
                  text: 'Intermediate',
                  collapsed: false,
                  items: [
                    { text: 'Lists & Tables', link: '/guide/html/04-lists-tables' },
                    { text: 'Forms', link: '/guide/html/05-forms' },
                    { text: 'Semantic HTML', link: '/guide/html/06-semantic' }
                  ]
                },
                {
                  text: 'Advanced',
                  collapsed: false,
                  items: [
                    { text: 'Media', link: '/guide/html/07-media' },
                    { text: 'Advanced Features', link: '/guide/html/08-advanced' }
                  ]
                }
              ]
            }
          ],
          '/guide/css/': [
            {
              text: 'CSS Tutorial',
              items: [
                { text: 'Introduction', link: '/guide/css/' },
                { text: 'Tips', link: '/guide/css/tip' },
                {
                  text: 'Beginner',
                  collapsed: false,
                  items: [
                    { text: 'Basics', link: '/guide/css/01-basics' },
                    { text: 'Colors & Backgrounds', link: '/guide/css/02-colors' },
                    { text: 'Typography', link: '/guide/css/03-typography' }
                  ]
                },
                {
                  text: 'Intermediate',
                  collapsed: false,
                  items: [
                    { text: 'Box Model', link: '/guide/css/04-box-model' },
                    { text: 'Layout', link: '/guide/css/05-layout' },
                    { text: 'Flexbox', link: '/guide/css/06-flexbox' }
                  ]
                },
                {
                  text: 'Advanced',
                  collapsed: false,
                  items: [
                    { text: 'Grid', link: '/guide/css/07-grid' },
                    { text: 'Responsive Design', link: '/guide/css/08-responsive' },
                    { text: 'Animations', link: '/guide/css/09-animations' },
                    { text: 'Advanced Techniques', link: '/guide/css/10-advanced' }
                  ]
                }
              ]
            }
          ],
          '/guide/javascript/': [
            {
              text: 'JavaScript Tutorial',
              items: [
                { text: 'Introduction', link: '/guide/javascript/' },
                { text: 'Tips', link: '/guide/javascript/tip' },
                {
                  text: 'Beginner',
                  collapsed: false,
                  items: [
                    { text: 'Basics', link: '/guide/javascript/01-basics' },
                    { text: 'Control Flow', link: '/guide/javascript/02-control-flow' },
                    { text: 'Functions', link: '/guide/javascript/03-functions' }
                  ]
                },
                {
                  text: 'Intermediate',
                  collapsed: false,
                  items: [
                    { text: 'Arrays', link: '/guide/javascript/04-arrays' },
                    { text: 'Objects', link: '/guide/javascript/05-objects' },
                    { text: 'DOM Manipulation', link: '/guide/javascript/06-dom' }
                  ]
                },
                {
                  text: 'Advanced',
                  collapsed: false,
                  items: [
                    { text: 'Async Programming', link: '/guide/javascript/07-async' },
                    { text: 'ES6+ Features', link: '/guide/javascript/08-es6' },
                    { text: 'OOP', link: '/guide/javascript/09-oop' },
                    { text: 'Advanced Patterns', link: '/guide/javascript/10-advanced' }
                  ]
                }
              ]
            }
          ],
          '/guide/typescript/': [
            {
              text: 'TypeScript Tutorial',
              items: [
                { text: 'Introduction', link: '/guide/typescript/' },
                {
                  text: 'Beginner',
                  collapsed: false,
                  items: [
                    { text: 'Basics', link: '/guide/typescript/01-basics' },
                    { text: 'Functions', link: '/guide/typescript/02-functions' },
                    { text: 'Objects & Interfaces', link: '/guide/typescript/03-interfaces' }
                  ]
                },
                {
                  text: 'Intermediate',
                  collapsed: false,
                  items: [
                    { text: 'Classes', link: '/guide/typescript/04-classes' },
                    { text: 'Generics', link: '/guide/typescript/05-generics' },
                    { text: 'Type Manipulation', link: '/guide/typescript/06-type-manipulation' }
                  ]
                },
                {
                  text: 'Advanced',
                  collapsed: false,
                  items: [
                    { text: 'Modules', link: '/guide/typescript/07-modules' },
                    { text: 'Decorators', link: '/guide/typescript/08-decorators' },
                    { text: 'Declaration Files', link: '/guide/typescript/09-declarations' },
                    { text: 'Advanced Patterns', link: '/guide/typescript/10-advanced' }
                  ]
                }
              ]
            }
          ],
          '/guide/nestjs/': [
            {
              text: 'NestJS Tutorial',
              items: [
                { text: 'Introduction', link: '/guide/nestjs/' },
                {
                  text: 'Beginner',
                  collapsed: false,
                  items: [
                    { text: 'Getting Started', link: '/guide/nestjs/01-introduction' },
                    { text: 'Controllers', link: '/guide/nestjs/02-controllers' },
                    { text: 'Providers & Services', link: '/guide/nestjs/03-providers' }
                  ]
                },
                {
                  text: 'Intermediate',
                  collapsed: false,
                  items: [
                    { text: 'Modules', link: '/guide/nestjs/04-modules' },
                    { text: 'Middleware & Guards', link: '/guide/nestjs/05-middleware' },
                    { text: 'Pipes & Validation', link: '/guide/nestjs/06-pipes' }
                  ]
                },
                {
                  text: 'Advanced',
                  collapsed: false,
                  items: [
                    { text: 'Database Integration', link: '/guide/nestjs/07-database' },
                    { text: 'Authentication', link: '/guide/nestjs/08-authentication' },
                    { text: 'Testing', link: '/guide/nestjs/09-testing' },
                    { text: 'Advanced Topics', link: '/guide/nestjs/10-advanced' }
                  ]
                }
              ]
            }
          ],
          '/guide/hono/': [
            {
              text: 'Hono Tutorial',
              items: [
                { text: 'Introduction', link: '/guide/hono/' },
                {
                  text: 'Beginner',
                  collapsed: false,
                  items: [
                    { text: 'Getting Started', link: '/guide/hono/01-introduction' },
                    { text: 'Routing', link: '/guide/hono/02-routing' }
                  ]
                },
                {
                  text: 'Intermediate',
                  collapsed: false,
                  items: [
                    { text: 'Middleware', link: '/guide/hono/03-middleware' },
                    { text: 'Context API', link: '/guide/hono/04-context' },
                    { text: 'Validation', link: '/guide/hono/05-validation' }
                  ]
                },
                {
                  text: 'Advanced',
                  collapsed: false,
                  items: [
                    { text: 'Testing', link: '/guide/hono/06-testing' },
                    { text: 'Deployment', link: '/guide/hono/07-deployment' },
                    { text: 'Advanced Topics', link: '/guide/hono/08-advanced' }
                  ]
                }
              ]
            }
          ],
          '/guide/react/': [
            {
              text: 'React Tutorial',
              items: [
                { text: 'Introduction', link: '/guide/react/' },
                {
                  text: 'Beginner',
                  collapsed: false,
                  items: [
                    { text: 'Getting Started', link: '/guide/react/01-introduction' },
                    { text: 'JSX', link: '/guide/react/02-jsx' },
                    { text: 'Components & Props', link: '/guide/react/03-components' }
                  ]
                },
                {
                  text: 'Intermediate',
                  collapsed: false,
                  items: [
                    { text: 'State & useState', link: '/guide/react/04-state' },
                    { text: 'Event Handling', link: '/guide/react/05-events' },
                    { text: 'React Hooks', link: '/guide/react/06-hooks' }
                  ]
                },
                {
                  text: 'Advanced',
                  collapsed: false,
                  items: [
                    { text: 'Form Handling', link: '/guide/react/07-forms' },
                    { text: 'React Router', link: '/guide/react/08-routing' },
                    { text: 'Data Fetching', link: '/guide/react/09-api' },
                    { text: 'Advanced Patterns', link: '/guide/react/10-advanced' }
                  ]
                }
              ]
            }
          ],
          '/guide/nodejs/': [
            {
              text: 'Node.js Tutorial',
              items: [
                { text: 'Introduction', link: '/guide/nodejs/' },
                {
                  text: 'Beginner',
                  collapsed: false,
                  items: [
                    { text: 'Getting Started', link: '/guide/nodejs/01-introduction' },
                    { text: 'Modules', link: '/guide/nodejs/02-modules' },
                    { text: 'File System', link: '/guide/nodejs/03-file-system' }
                  ]
                },
                {
                  text: 'Intermediate',
                  collapsed: false,
                  items: [
                    { text: 'Async Programming', link: '/guide/nodejs/04-async' },
                    { text: 'Events', link: '/guide/nodejs/05-events' },
                    { text: 'Streams', link: '/guide/nodejs/06-streams' }
                  ]
                },
                {
                  text: 'Advanced',
                  collapsed: false,
                  items: [
                    { text: 'HTTP Module', link: '/guide/nodejs/07-http' },
                    { text: 'NPM & Packages', link: '/guide/nodejs/08-npm' },
                    { text: 'Debugging', link: '/guide/nodejs/09-debugging' },
                    { text: 'Advanced Topics', link: '/guide/nodejs/10-advanced' }
                  ]
                }
              ]
            }
          ],
          '/guide/express/': [
            {
              text: 'Express.js Tutorial',
              items: [
                { text: 'Introduction', link: '/guide/express/' },
                {
                  text: 'Beginner',
                  collapsed: false,
                  items: [
                    { text: 'Getting Started', link: '/guide/express/01-introduction' },
                    { text: 'Routing', link: '/guide/express/02-routing' },
                    { text: 'Middleware', link: '/guide/express/03-middleware' }
                  ]
                },
                {
                  text: 'Intermediate',
                  collapsed: false,
                  items: [
                    { text: 'Request & Response', link: '/guide/express/04-request-response' },
                    { text: 'Template Engines', link: '/guide/express/05-templates' },
                    { text: 'Static Files', link: '/guide/express/06-static-files' }
                  ]
                },
                {
                  text: 'Advanced',
                  collapsed: false,
                  items: [
                    { text: 'Error Handling', link: '/guide/express/07-error-handling' },
                    { text: 'Authentication', link: '/guide/express/08-authentication' },
                    { text: 'Database Integration', link: '/guide/express/09-database' },
                    { text: 'Deployment', link: '/guide/express/10-deployment' }
                  ]
                }
              ]
            }
          ],
          '/guide/python/': [
            {
              text: 'Python Tutorial',
              items: [
                { text: 'Introduction', link: '/guide/python/' },
                {
                  text: 'Beginner',
                  collapsed: false,
                  items: [
                    { text: 'Basics', link: '/guide/python/01-basics' },
                    { text: 'Control Flow', link: '/guide/python/02-control-flow' },
                    { text: 'Functions', link: '/guide/python/03-functions' }
                  ]
                },
                {
                  text: 'Intermediate',
                  collapsed: false,
                  items: [
                    { text: 'Data Structures', link: '/guide/python/04-data-structures' },
                    { text: 'Strings', link: '/guide/python/05-strings' },
                    { text: 'File I/O', link: '/guide/python/06-file-io' }
                  ]
                },
                {
                  text: 'Advanced',
                  collapsed: false,
                  items: [
                    { text: 'Modules', link: '/guide/python/07-modules' },
                    { text: 'OOP', link: '/guide/python/08-oop' },
                    { text: 'Exceptions', link: '/guide/python/09-exceptions' },
                    { text: 'Advanced Topics', link: '/guide/python/10-advanced' }
                  ]
                }
              ]
            }
          ],
          '/guide/ai/': [
            {
              text: 'AI & Machine Learning',
              items: [
                { text: 'Introduction', link: '/guide/ai/' },
                {
                  text: 'Beginner',
                  collapsed: false,
                  items: [
                    { text: 'What is AI?', link: '/guide/ai/01-introduction' },
                    { text: 'ML Basics', link: '/guide/ai/02-ml-basics' },
                    { text: 'Python for AI', link: '/guide/ai/03-python-for-ai' },
                    { text: 'Your First Model', link: '/guide/ai/04-first-model' }
                  ]
                },
                {
                  text: 'Intermediate',
                  collapsed: false,
                  items: [
                    { text: 'Neural Networks', link: '/guide/ai/05-neural-networks' },
                    { text: 'Deep Learning', link: '/guide/ai/06-deep-learning' },
                    { text: 'Working with LLMs', link: '/guide/ai/07-llms' }
                  ]
                },
                {
                  text: 'Advanced',
                  collapsed: false,
                  items: [
                    { text: 'Fine-tuning Models', link: '/guide/ai/08-fine-tuning' },
                    { text: 'AI Agents', link: '/guide/ai/09-agents' },
                    { text: 'Production AI', link: '/guide/ai/10-production' }
                  ]
                }
              ]
            }
          ],
          '/guide/csharp/': [
            {
              text: 'C# Tutorial',
              items: [
                { text: 'Introduction', link: '/guide/csharp/' },
                {
                  text: 'Beginner',
                  collapsed: false,
                  items: [
                    { text: 'Getting Started', link: '/guide/csharp/01-introduction' },
                    { text: 'Variables & Types', link: '/guide/csharp/02-variables' },
                    { text: 'Control Flow', link: '/guide/csharp/03-control-flow' }
                  ]
                },
                {
                  text: 'Intermediate',
                  collapsed: false,
                  items: [
                    { text: 'Methods', link: '/guide/csharp/04-methods' },
                    { text: 'Classes & Objects', link: '/guide/csharp/05-classes' },
                    { text: 'Inheritance', link: '/guide/csharp/06-inheritance' }
                  ]
                },
                {
                  text: 'Advanced',
                  collapsed: false,
                  items: [
                    { text: 'Interfaces', link: '/guide/csharp/07-interfaces' },
                    { text: 'Generics', link: '/guide/csharp/08-generics' },
                    { text: 'LINQ', link: '/guide/csharp/09-linq' },
                    { text: 'Async Programming', link: '/guide/csharp/10-async' }
                  ]
                }
              ]
            }
          ],
          '/guide/dotnet/': [
            {
              text: '.NET Tutorial',
              items: [
                { text: 'Introduction', link: '/guide/dotnet/' },
                {
                  text: 'Beginner',
                  collapsed: false,
                  items: [
                    { text: 'Getting Started', link: '/guide/dotnet/01-introduction' },
                    { text: 'Project Structure', link: '/guide/dotnet/02-project-structure' },
                    { text: 'CLI Tools', link: '/guide/dotnet/03-cli' }
                  ]
                },
                {
                  text: 'Intermediate',
                  collapsed: false,
                  items: [
                    { text: 'Dependency Injection', link: '/guide/dotnet/04-dependency-injection' },
                    { text: 'Configuration', link: '/guide/dotnet/05-configuration' },
                    { text: 'Logging', link: '/guide/dotnet/06-logging' }
                  ]
                },
                {
                  text: 'Advanced',
                  collapsed: false,
                  items: [
                    { text: 'Middleware', link: '/guide/dotnet/07-middleware' },
                    { text: 'Entity Framework', link: '/guide/dotnet/08-entity-framework' },
                    { text: 'Testing', link: '/guide/dotnet/09-testing' },
                    { text: 'Deployment', link: '/guide/dotnet/10-deployment' }
                  ]
                }
              ]
            }
          ],
          '/guide/docker/': [
            {
              text: 'Docker Tutorial',
              items: [
                { text: 'Introduction', link: '/guide/docker/' },
                {
                  text: 'Beginner',
                  collapsed: false,
                  items: [
                    { text: 'Introduction to Docker', link: '/guide/docker/01-introduction' },
                    { text: 'Docker Images', link: '/guide/docker/02-images' },
                    { text: 'Docker Containers', link: '/guide/docker/03-containers' },
                    { text: 'Dockerfile Basics', link: '/guide/docker/04-dockerfile' },
                    { text: 'Docker Volumes', link: '/guide/docker/05-volumes' }
                  ]
                },
                {
                  text: 'Intermediate',
                  collapsed: false,
                  items: [
                    { text: 'Docker Networking', link: '/guide/docker/06-networking' },
                    { text: 'Docker Compose', link: '/guide/docker/07-compose' },
                    { text: 'Docker Registry', link: '/guide/docker/08-registry' }
                  ]
                },
                {
                  text: 'Advanced',
                  collapsed: false,
                  items: [
                    { text: 'Docker in Production', link: '/guide/docker/09-production' },
                    { text: 'Docker Orchestration', link: '/guide/docker/10-orchestration' }
                  ]
                }
              ]
            }
          ]
        }
      }
    },
    km: {
      label: 'ភាសាខ្មែរ',
      lang: 'km',
      themeConfig: {
        logo: '/favicon.svg',
        nav: [
          { text: 'ទំព័រដើម', link: '/km/' },
          { text: 'មគ្គុទេសក៍', link: '/km/guide/' },
          {
            text: 'Frontend',
            items: [
              { text: 'HTML', link: '/km/guide/html/' },
              { text: 'CSS', link: '/km/guide/css/' },
              { text: 'JavaScript', link: '/km/guide/javascript/' },
              { text: 'TypeScript', link: '/km/guide/typescript/' },
              { text: 'React', link: '/km/guide/react/' },
              { text: 'Vue.js', link: '/km/guide/vue/' }
            ]
          },
          {
            text: 'Backend',
            items: [
              { text: 'Node.js', link: '/km/guide/nodejs/' },
              { text: 'Express', link: '/km/guide/express/' },
              { text: 'NestJS', link: '/km/guide/nestjs/' },
              { text: 'Hono', link: '/km/guide/hono/' },
              { text: 'Python', link: '/km/guide/python/' },
              { text: 'C#', link: '/km/guide/csharp/' },
              { text: '.NET', link: '/km/guide/dotnet/' }
            ]
          },
          { text: 'AI', link: '/km/guide/ai/' },
          { text: 'អ្នកនិពន្ធ', link: '/km/creator' }
        ],
        sidebar: {
          '/km/guide/': [
            {
              text: 'មូលដ្ឋាន',
              items: [
                { text: 'សេចក្តីផ្តើម', link: '/km/guide/' },
                { text: 'តើគេហទំព័រជាអ្វី?', link: '/km/guide/fundamentals/what-is-website' },
                { text: 'របៀបដែលវេបសាइតដំណើរការ', link: '/km/guide/fundamentals/how-web-works' },
                { text: 'ឧបករណ៍អភិវឌ្ឍន៍វេប', link: '/km/guide/fundamentals/web-development-overview' },
                { text: 'ការចាប់ផ្តើម', link: '/km/guide/fundamentals/getting-started' }
              ]
            },
            {
              text: 'បរិស្ថាននៃការអភិវឌ្ឍន៍',
              items: [
                { text: 'មូលដ្ឋាននៃបន្ទាត់ពាក្យបញ្ជា', link: '/km/guide/environment/command-line' },
                { text: 'កម្មវិធីកែសម្រួលលេខកូដ', link: '/km/guide/environment/code-editors' },
                { text: 'អ្នកគ្រប់គ្រងកញ្ចប់', link: '/km/guide/environment/package-managers' }
              ]
            },
            {
              text: 'ជំនាញសំខាន់ៗ',
              items: [
                { text: 'ឧបករណ៍អ្នកអភិវឌ្ឍន៍', link: '/km/guide/skills/developer-tools' },
                { text: 'ការគ្រប់គ្រងកំណែ (Git)', link: '/km/guide/skills/version-control' },
                { text: 'មូលដ្ឋាននៃការឆ្លុះបញ្ហា', link: '/km/guide/skills/debugging' },
                { text: 'API និងការទទួលបានទិន្នន័យ', link: '/km/guide/skills/apis-data-fetching' },
                { text: 'ការងារជាមួយទម្រង់', link: '/km/guide/skills/forms' },
                { text: 'JSON និងទម្រង់ទិន្នន័យ', link: '/km/guide/skills/json-data' },
                { text: 'កន្សោមទៀងទាត់', link: '/km/guide/skills/regex' },
                { text: 'ផ្ទុកលើតាមទ្រូង', link: '/km/guide/skills/web-storage' }
              ]
            },
            {
              text: 'ការអនុវត្តល្អបំផុត',
              items: [
                { text: 'ការរចនាឆ្លើយតប', link: '/km/guide/best-practices/responsive-design' },
                { text: 'ភាពងាយលាभ់បក្សីតាមលេខកូដ', link: '/km/guide/best-practices/web-accessibility' },
                { text: 'ដំណើរការលេចឡើង', link: '/km/guide/best-practices/web-performance' },
                { text: 'សន្តិសុខលើតាមទ្រូង', link: '/km/guide/best-practices/web-security' },
                { text: 'ភាពឆបគ្នារបស់ឧបករណ៍ស្វាគមន៍', link: '/km/guide/best-practices/browser-compatibility' },
                { text: 'មូលដ្ឋាននៃ SEO', link: '/km/guide/best-practices/seo-basics' }
              ]
            },
            {
              text: 'ការដាក់ពង្រាយ',
              items: [
                { text: 'ផ្ទុកវេបនិងការដាក់ពង្រាយ', link: '/km/guide/deployment/web-hosting' }
              ]
            },
            {
              text: 'មេរៀនបង្រៀន',
              items: [
                { text: 'HTML', link: '/km/guide/html/' },
                { text: 'CSS', link: '/km/guide/css/' },
                { text: 'JavaScript', link: '/km/guide/javascript/' },
                { text: 'TypeScript', link: '/km/guide/typescript/' },
                { text: 'React', link: '/km/guide/react/' },
                { text: 'Node.js', link: '/km/guide/nodejs/' },
                { text: 'Express', link: '/km/guide/express/' },
                { text: 'NestJS', link: '/km/guide/nestjs/' },
                { text: 'Hono', link: '/km/guide/hono/' },
                { text: 'Python', link: '/km/guide/python/' },
                { text: 'C#', link: '/km/guide/csharp/' },
                { text: '.NET', link: '/km/guide/dotnet/' },
                { text: 'AI & ការរៀនម៉ាស៊ីន', link: '/km/guide/ai/' },
                { text: 'Vue.js', link: '/km/guide/vue/' }
              ]
            }
          ]
        }
      }
    }
  }
})
