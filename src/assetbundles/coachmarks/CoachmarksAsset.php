<?php

namespace unionco\coachmarks\assetbundles\coachmarks;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;
use craft\web\assets\vue\VueAsset;
use unionco\coachmarks\CoachmarksPlugin;
// use unionco\craftsyncdb\SyncDbPlugin;

class CoachmarksAsset extends AssetBundle
{
    public function init()
    {
        $dev = getenv('COACHMARKS_ENABLE_DEV') === 'true';

        $this->sourcePath = CoachmarksPlugin::getInstance()->getBasePath() . '/assetbundles/coachmarks/dist/';
        $this->depends = [
            CpAsset::class,
        ];

        $this->css = [
            "https://fonts.googleapis.com/icon?family=Material+Icons",
        ];

        if ($dev) {
            $this->js = [
                'https://vuejs.org/js/vue.js',
                'http://localhost:8080/app.js',
            ];
        } else {
            $this->depends[] = VueAsset::class;
            $this->css[] = 'css/chunk-vendors.css';
            $this->css[] = 'css/app.css';
            $this->js = ['js/app.js', 'js/chunk-vendors.js'];
        }
        parent::init();
    }
}
