<?php

/**
 * Coacher plugin for Craft CMS 3.x
 *
 * Coachmarks plugin for CraftCMS.
 *
 * @link      https://github.com/fvaldes33
 * @copyright Copyright (c) 2019 Franco Valdes
 */

namespace unionco\coachmarks\records;

use Craft;
use craft\db\ActiveRecord;
use unionco\coachmarks\models\ApiTransformable;


class Step extends ActiveRecord implements ApiTransformable
{
    /**
     * @return string the table name
     */
    public static function tableName()
    {
        return '{{%coachmarks_steps}}';
    }

    public function getCoachmark()
    {
        return $this->hasOne(Coachmark::className(), ['id' => 'coachmarkId']);
    }

    /**
     * @param Step[] $data
     * @return array
     */
    public static function apiTransform($data): array
    {
        return array_map(
            /**
             * @param Step $step
             * @return array
             **/
            function (Step $step) {
                return [
                    'id' => $step->id,
                    'coachmarkId' => $step->coachmarkId,
                    'title' => $step->title,
                    'description' => $step->description,
                    'label' => $step->label,
                    'tooltipPosition' => $step->tooltipPosition,
                    'url' => $step->url,
                    'order' => $step->order,
                    'selectorNode' => $step->selectorNode,
                ];
            },
            $data
        );
    }
}
