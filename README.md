partainer-deploy
=================

A small CLI to deploy a docker-compose file to a [Portainer](https://www.portainer.io/) instance.

[![Latest Release](https://gitlab.com/nvax/portainer-deploy/-/badges/release.svg)](https://www.npmjs.com/package/@nvax/portainer-deploy)
[![codecov](https://codecov.io/gitlab/nvax/portainer-deploy/graph/badge.svg?token=GISRSV96RO)](https://codecov.io/gitlab/nvax/portainer-deploy) 

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
@nvax/portainer-deploy/1.1.0 win32-x64 node-v20.10.0
$ portainer-deploy --help [COMMAND]
USAGE
  $ portainer-deploy COMMAND
...
```
<!-- usagestop -->

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.8/lib/commands/help.ts)_

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

_See code: [dist/commands/stack/index.ts](https://gitlab.com/nvax/portainer-deploy/blob/v1.1.0/dist/commands/stack/index.ts)_
<!-- commandsstop -->
