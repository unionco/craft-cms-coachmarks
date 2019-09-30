# Coacher plugin for Craft CMS 3.x

Coachmarks plugin for CraftCMS.

![Screenshot](resources/img/plugin-logo.png)

## Requirements

This plugin requires Craft CMS 3.0.0-beta.23 or later, PHP 7.x, and Node v10 (if building frontend assets) 

## Installation
To install this plugin on a Craft site, first clone this repository locally.
```bash
$ git clone git@github.com:unionco/craft-cms-coachmarks.git ~/Plugins/craft-cms-coachmarks
```

Next, from your Craft installation, manually update your composer.json to include the repo as an available repository, and then require the plugin.

```json
{
    ...
    "repositories": [
        {
            "type": "path",
            "url": "~/Plugins/craft-cms-coachmarks"
        }
    ]
}
```

```bash
$ composer require unionco/craft-coachmarks:@dev
```

From the Craft project, install the plugin using the CP Settings > Plugins or from the Craft CLI.

### DEV Installation
Run through the steps above, and then edit your Craft installation `.env` file to include the following line:
```ini
COACHMARKS_ENABLE_DEV="true"
```

This configuration tells the plugin to load Assets from localhost:8080, instead of using the production build files.

Once dev mode is enabled, you need to navigate to the plugin directory. Enter the `resources` directory and start serving dev files:
```bash
$ cd ~/Plugins/craft-cms-coachmarks
$ cd resources
$ yarn install
$ yarn serve
```

Note that this plugin uses the Craft `VueAsset` when in production mode, but brings in a development build of Vue.js from a CDN while in dev mode.

## Coachmarks Overview

Plugin overview goes here


## Coacher Roadmap

Some things to do, and ideas for potential features:

* Page Change
  * Pre check if we are on the right page before updating state?
  * Hash URL? Goto new URL and set state from that
* Material Design
  * Tailwind for final product?

Brought to you by [Franco Valdes](https://github.com/fvaldes33)
