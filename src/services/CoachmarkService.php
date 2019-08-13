<?php
/**
 * Coacher plugin for Craft CMS 3.x
 *
 * Coachmarks plugin for CraftCMS.
 *
 * @link      https://github.com/fvaldes33
 * @copyright Copyright (c) 2019 Franco Valdes
 */

namespace unionco\coachmarks\services;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\elements\db\ElementQueryInterface;
use craft\elements\Entry;
use craft\elements\MatrixBlock;
use craft\helpers\DateTimeHelper;
use craft\helpers\Db;
use craft\helpers\Json;
use unionco\coachmarks\elements\Coachmark as CoachmarkElement;

/**
 * @author    Franco Valdes
 * @package   Coacher
 * @since     1.0.0
 */
class CoachmarkService extends Component
{

    /**
     * 
     */
    public function getPageCoachmarks(): array
    {
        $request = Craft::$app->getRequest();
        $page = $request->getParam('p');

        if (strpos($page, 'dashboard') >= -1) {
            return CoachmarkElement::find()
                ->context('global')
                ->all();
        }

        if (strpos($page, 'entries') >= -1) {
            return CoachmarkElement::find()
                ->context('entries')
                ->all();
        }

        return [];
    }
}