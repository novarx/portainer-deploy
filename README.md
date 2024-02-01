oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @nvax/portainer-deployer
$ portainer-deployer COMMAND
running command...
$ portainer-deployer (--version)
@nvax/portainer-deployer/1.0.0 linux-x64 node-v20.11.0
$ portainer-deployer --help [COMMAND]
USAGE
  $ portainer-deployer COMMAND
...
```
<!-- usagestop -->
```sh-session
$ npm install -g portainer-deploy
$ portainer-deploy COMMAND
running command...
$ portainer-deploy (--version)
portainer-deploy/0.0.0 win32-x64 node-v20.10.0
$ portainer-deploy --help [COMMAND]
USAGE
  $ portainer-deploy COMMAND
...
```
# Commands
<!-- commands -->
* [`portainer-deployer help [COMMANDS]`](#portainer-deployer-help-commands)
* [`portainer-deployer stack [FILE]`](#portainer-deployer-stack-file)

## `portainer-deployer help [COMMANDS]`

Display help for portainer-deployer.

```
USAGE
  $ portainer-deployer help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for portainer-deployer.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.8/src/commands/help.ts)_

## `portainer-deployer stack [FILE]`

Deploys Docker Compose Files to Portainer

```
USAGE
  $ portainer-deployer stack [FILE] --endpoint <value> --password <value> --stack <value> --url <value>
    --username <value>

ARGUMENTS
  FILE  [default: docker-compose.yml] docker-compose file to deploy

FLAGS
  --endpoint=<value>  (required) portainer endpoint id
  --password=<value>  (required) portainer password
  --stack=<value>     (required) portainer stack id
  --url=<value>       (required) portainer base url i.e.: https://portainer.example.com
  --username=<value>  (required) portainer username

DESCRIPTION
  Deploys Docker Compose Files to Portainer
```

_See code: [src/commands/stack/index.ts](https://gitlab.com/nvax/portainer-deployer/blob/v1.0.0/src/commands/stack/index.ts)_
<!-- commandsstop -->
* [`portainer-deploy hello PERSON`](#portainer-deploy-hello-person)

## `portainer-deploy hello PERSON`

Say hello

```
USAGE
  $ portainer-deploy hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/novarx.ch/portainer-deploy/blob/v0.0.0/dist/commands/hello/index.ts)_
