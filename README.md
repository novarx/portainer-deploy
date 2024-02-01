oclif-hello-world
=================

oclif example Hello World CLI

[![Latest Release](https://gitlab.com/nvax/portainer-deployer/-/badges/release.svg)](https://gitlab.com/nvax/portainer-deployer/-/releases)
[![pipeline status](https://gitlab.com/nvax/portainer-deployer/badges/master/pipeline.svg)](https://gitlab.com/nvax/portainer-deployer/-/commits/master)
[![coverage report](https://gitlab.com/nvax/portainer-deployer/badges/master/coverage.svg)](https://gitlab.com/nvax/portainer-deployer/-/commits/master)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @nvax/portainer-deploy
$ portainer-deploy COMMAND
running command...
$ portainer-deploy (--version)
@nvax/portainer-deploy/1.1.0 linux-x64 node-v20.11.0
$ portainer-deploy --help [COMMAND]
USAGE
  $ portainer-deploy COMMAND
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
* [`portainer-deploy help [COMMANDS]`](#portainer-deploy-help-commands)
* [`portainer-deploy stack [FILE]`](#portainer-deploy-stack-file)

## `portainer-deploy help [COMMANDS]`

Display help for portainer-deploy.

```
USAGE
  $ portainer-deploy help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for portainer-deploy.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.8/src/commands/help.ts)_

## `portainer-deploy stack [FILE]`

Deploys Docker Compose Files to Portainer

```
USAGE
  $ portainer-deploy stack [FILE] --endpoint <value> --password <value> --stack <value> --url <value>
    --username <value> [--env_link <value> | --envs <value>]

ARGUMENTS
  FILE  [default: docker-compose.yml] docker-compose file to deploy

FLAGS
  --endpoint=<value>  (required) portainer endpoint id
  --env_link=<value>  local variables to be sent to portainer stack, i.e.: "MY_ENV_VAR, MY_OTHER_ENV_VAR
  --envs=<value>      portainer env variables as json-array
  --password=<value>  (required) portainer password
  --stack=<value>     (required) portainer stack id
  --url=<value>       (required) portainer base url i.e.: https://portainer.example.com
  --username=<value>  (required) portainer username

DESCRIPTION
  Deploys Docker Compose Files to Portainer
```

_See code: [src/commands/stack/index.ts](https://gitlab.com/nvax/portainer-deployer/blob/v1.1.0/src/commands/stack/index.ts)_
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
