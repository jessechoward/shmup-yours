/**
 * ESLint Configuration for shmup-yours monorepo
 * 
 * Modern flat config format with workspace-specific rules.
 * Aligned with project standards from .copilot-instructions.md
 */

import js from '@eslint/js';

export default [
    // Base configuration for all JavaScript files
    {
        ...js.configs.recommended,
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            globals: {
                // Node.js globals for backend
                process: 'readonly',
                Buffer: 'readonly',
                console: 'readonly',
                // Browser globals for frontend  
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                HTMLCanvasElement: 'readonly',
                CanvasRenderingContext2D: 'readonly'
            }
        },
        rules: {
            // Align with project standards from existing code
            'indent': ['error', 4],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            
            // Modern JavaScript practices
            'no-var': 'error',
            'prefer-const': 'error',
            'no-unused-vars': 'error',
            'no-console': 'warn',
            
            // Code quality rules  
            'no-undef': 'error',
            'no-unreachable': 'error',
            'no-duplicate-imports': 'error',
            
            // Async/await best practices (relaxed for development)
            'require-await': 'warn',
            'no-return-await': 'error',
            
            // JSDoc documentation encouraged but not enforced
            // Note: valid-jsdoc rule removed in ESLint v9, using alternatives
            'require-jsdoc': 'off'
        }
    },
    
    // Frontend-specific configuration
    {
        files: ['frontend/src/**/*.js'],
        languageOptions: {
            globals: {
                // Browser-only globals
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                HTMLCanvasElement: 'readonly',
                CanvasRenderingContext2D: 'readonly',
                requestAnimationFrame: 'readonly',
                cancelAnimationFrame: 'readonly',
                // Performance API
                performance: 'readonly',
                // Image constructor
                Image: 'readonly'
            }
        },
        rules: {
            // Stricter console rules for frontend
            'no-console': 'warn',
            // Canvas API patterns
            'no-global-assign': 'error',
            // Relax unused vars for development
            'no-unused-vars': ['warn', { 
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }]
        }
    },
    
    // Backend-specific configuration  
    {
        files: ['backend/src/**/*.js'],
        languageOptions: {
            globals: {
                // Node.js globals
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                global: 'readonly'
            }
        },
        rules: {
            // Allow console in backend
            'no-console': 'off',
            // Node.js specific patterns
            'no-process-exit': 'error'
        }
    },
    
    // Test files configuration
    {
        files: ['test/**/*.js', '**/*.test.js', '**/test_*.js'],
        languageOptions: {
            globals: {
                // Common test globals
                describe: 'readonly',
                it: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                // Node.js globals for test runners
                global: 'readonly'
            }
        },
        rules: {
            // Relaxed rules for tests
            'no-console': 'off',
            'no-unused-vars': 'warn',
            'require-await': 'off'
        }
    },
    
    // Ignore patterns for performance and avoiding false positives
    {
        ignores: [
            'node_modules/',
            'dist/',
            'build/',
            '*.min.js',
            'coverage/',
            '.husky/',
            '.git/',
            '.eslintcache',
            // Example/demo files mentioned in documentation
            '**/demo.js',
            '**/example*.js',
            'docs/architecture/example-implementation.js'
        ]
    }
];