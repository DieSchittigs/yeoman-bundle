'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor (args, opts) {
        super(args, opts);

        this.option('namespace');
    }

    async prompting() {
        this.answers = await this.prompt([{
            type    : 'input',
            name    : 'composername',
            message : 'Name for your composer project',
            default : 'example/bundle',
        }, {
            type    : 'input',
            name    : 'description',
            message : 'Would you like to add a description?',
        }, {
            type    : 'input',
            name    : 'namespace',
            message : 'PSR-4 namespace',
            default : 'Example\\Bundle',
        }, {
            type    : 'input',
            name    : 'name',
            message : 'Your name (this will only be used for the composer author field)',
            store   : true,
        }, {
            type    : 'input',
            name    : 'email',
            message : 'Your e-mail address (this will only be used for the composer author field)',
            store   : true,
        }]);

        this.answers.namespace = this.answers.namespace.replace(/\\+$/, ''); // Trim trailing backslashes 
    }

    copy () {
        let context = this.answers;
        context.namespace = context.namespace.replace(/\\/g, '\\\\');
        context.description = context.description ? `\n    "description": "${context.description}",` : '';

        let authors = '';
        if (context.name) authors = `\n            "name": "${context.name}"`;
        if (context.email) authors += (context.name ? ',' : '') + `\n            "email": "${context.email}"`;
        context.authors = authors ? `\n    "authors: [\n        {${authors}\n        }\n    ],` : '';
        
        this.fs.copyTpl(
            this.templatePath('composer.json'),
            this.destinationPath('composer.json'),
            context
        );
    }
};

