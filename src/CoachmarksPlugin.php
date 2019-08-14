<?php
/**
 * CoachmarksPlugin plugin for Craft CMS 3.x
 *
 * Coachmarks plugin for CraftCMS.
 *
 * @link      https://github.com/fvaldes33
 * @copyright Copyright (c) 2019 Franco Valdes
 */

namespace unionco\coachmarks;

use Craft;
use craft\base\Plugin;
use craft\services\Plugins;
use craft\events\PluginEvent;
use craft\web\UrlManager;
use craft\services\Elements;
use craft\events\RegisterComponentTypesEvent;
use craft\events\RegisterUrlRulesEvent;
use unionco\coachmarks\models\Settings;
use unionco\coachmarks\services\CoachmarkService;
use yii\base\Event;
use craft\web\twig\variables\CraftVariable;
use unionco\coachmarks\variables\CoachmarksVariable;
use unionco\coachmarks\elements\Coachmark as CoachmarkElement;
use unionco\coachmarks\assetbundles\coachmarks\CoachmarksAsset;
use craft\helpers\Json;

/**
 * Craft plugins are very much like little applications in and of themselves. We’ve made
 * it as simple as we can, but the training wheels are off. A little prior knowledge is
 * going to be required to write a plugin.
 *
 * For the purposes of the plugin docs, we’re going to assume that you know PHP and SQL,
 * as well as some semi-advanced concepts like object-oriented programming and PHP namespaces.
 *
 * https://craftcms.com/docs/plugins/introduction
 *
 * @author    Franco Valdes
 * @package   CoachmarksPlugin
 * @since     1.0.0
 *
 * @property  Settings $settings
 * @method    Settings getSettings()
 */
class CoachmarksPlugin extends Plugin
{
    // Static Properties
    // =========================================================================

    /**
     * Static property that is an instance of this plugin class so that it can be accessed via
     * CoachmarksPlugin::$plugin
     *
     * @var CoachmarksPlugin
     */
    public static $plugin;

    // Public Properties
    // =========================================================================

    /**
     * To execute your plugin’s migrations, you’ll need to increase its schema version.
     *
     * @var string
     */
    public $schemaVersion = '1.0.0';

    /**
     * The plugin’s changelog URL.
     *
     * The URL should begin with `https://` and point to a plain text Markdown-formatted changelog.
     * Version headers must follow the general format:
     *
     * ```
     * ## X.Y.Z - YYYY-MM-DD
     * ```
     *
     * with the following possible deviations:
     *
     * - other text can come before the version number, like the plugin’s name
     * - a 4th version number is allowed (e.g. `1.2.3.4`)
     * - pre-release versions are allowed (e.g. `1.0.0-alpha.1`)
     * - the version can start with `v` (e.g. `v1.2.3`)
     * - the version can be hyperlinked (e.g. `[1.2.3]`)
     * - dates can use dots as separators, rather than hyphens (e.g. `YYYY.MM.DD`)
     * - a `[CRITICAL]` flag can be appended after the date to indicate a critical release
     *
     * More notes:
     *
     * - Releases should be listed in descending order (newest on top). Craft will stop parsing the changelog as soon as it hits a version that is older than or equal to the installed version.
     * - Any content that does not follow a version header line will be ignored.
     * - For consistency and clarity, release notes should follow [keepachangelog.com](http://keepachangelog.com/), but it’s not enforced.
     * - Release notes can contain notes using the format `> {note} Some note`. `{warning}` and `{tip}` are also supported.
     *
     * @var string|null The plugin’s changelog URL
     */
    public $changelogUrl;

    /**
     * @var bool Whether the plugin has a settings page in the CP
     */
    public $hasCpSettings = true;

    /**
     * @var bool Whether the plugin has its own section in the CP
     */
    public $hasCpSection = true;

    // Public Methods
    // =========================================================================

    /**
     * Set our $plugin static property to this class so that it can be accessed via
     * CoachmarksPlugin::$plugin
     *
     * Called after the plugin class is instantiated; do any one-time initialization
     * here such as hooks and events.
     *
     * If you have a '/vendor/autoload.php' file, it will be loaded for you automatically;
     * you do not need to load it in your init() method.
     *
     */
    public function init()
    {
        parent::init();
        self::$plugin = $this;

        $this->setComponents([
            'coachmarks' => CoachmarkService::class
        ]);

        // Register our elements
        // Event::on(
        //     Elements::class,
        //     Elements::EVENT_REGISTER_ELEMENT_TYPES,
        //     function (RegisterComponentTypesEvent $event) {
        //         $event->types[] = CoachmarkElement::class;
        //     }
        // );

        // Register our CP routes
        Event::on(
            UrlManager::class,
            UrlManager::EVENT_REGISTER_CP_URL_RULES,
            function (RegisterUrlRulesEvent $event) {
                $event->rules['coachmarks'] = 'coachmarks/cp/index';
                $event->rules['coachmarks/new'] = 'coachmarks/cp/new';
                $event->rules['coachmarks/edit/<id:\d+>'] = 'coachmarks/cp/edit';
            }
        );

        // Do something after we're installed
        Event::on(
            Plugins::class,
            Plugins::EVENT_AFTER_INSTALL_PLUGIN,
            function (PluginEvent $event) {
                if ($event->plugin === $this) {
                    // We were just installed
                    // seed && go to settings
                }
            }
        );

        Event::on(
            CraftVariable::class,
            CraftVariable::EVENT_INIT,
            function (Event $event) {
                /** @var CraftVariable $variable */
                $variable = $event->sender;
                $variable->set('coachmarks', CoachmarksVariable::class);
            }
        );

        $this->_startCoachmarksPluginJs();

        Craft::info(
            Craft::t(
                'app',
                '{name} plugin loaded',
                ['name' => $this->name]
            ),
            __METHOD__
        );
    }

    /**
     * @return array|null
     */
    public function getCpNavItem()
    {
        $navItem = parent::getCpNavItem();
        
        $navItem['url'] = "coachmarks";

        return $navItem;
    }

    // Protected Methods
    // =========================================================================

    /**
     * Creates and returns the model used to store the plugin’s settings.
     *
     * @return \craft\base\Model|null
     */
    protected function createSettingsModel()
    {
        return new Settings();
    }

    /**
     * Returns the rendered settings HTML, which will be inserted into the content
     * block on the settings page.
     *
     * @return string The rendered settings HTML
     */
    protected function settingsHtml(): string
    {
        return Craft::$app->view->renderTemplate(
            'coacher/settings',
            [
                'settings' => $this->getSettings()
            ]
        );
    }

    // Private Methods
    // =========================================================================

    /**
     * 
     */
    private function _startCoachmarksPluginJs()
    {
        $settings = $this->getSettings();

        if ($settings->showCoachMarks) {
            $coachmarks = $this->coachmarks->getPageCoachmarks();
            $params = $this->_collection($coachmarks);
            
            $view = Craft::$app->getView();
            $view->registerAssetBundle(CoachmarksAsset::class);
             // $view->registerJs("new CoachmarksPlugin(" . Json::encode($params) . ");");
            // $view->registerJs("new CoachmarksPlugin(" . Json::encode($params) . ");");
        }
    }

    private function _collection($coachmarks)
    {
        return array_map(function ($coachmark) {
            return $this->_item($coachmark);
        }, $coachmarks);
    }

    private function _item($coachmark)
    {
        return [
            "id" => $coachmark->id,
            "title" => $coachmark->title,
            "context" => $coachmark->context,
            "steps" => array_map(function ($step) {
                return [
                    "title" => $step['col1'],
                    "description" => $step['col2'],
                    "selector" => $step['col3'],
                    "position" => $step['col4'],
                ];
            }, Json::decode($coachmark->steps)),
        ];
    }

    public static function getInstance(): CoachmarksPlugin
    {
        return static::$plugin;
    }
}
