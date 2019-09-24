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
use craft\helpers\Json;
use craft\db\ActiveRecord;
use unionco\coachmarks\records\db\CoachmarkQuery;
use unionco\coachmarks\records\Step;
use craft\records\User;
use unionco\coachmarks\models\ApiTransformable;
use unionco\coachmarks\models\UserRecord;

class Coachmark extends ActiveRecord implements ApiTransformable
{
    public static function tableName()
    {
        return '{{%coachmarks_coachmarks}}';
    }

    public function getReadOnlyUsers()
    {
        return $this->hasMany(User::className(), [
            'id' => 'userId',
        ])
            ->viaTable('{{%coachmarks_ro_permissions}}', [
                'coachmarkId' => 'id',
            ]);
    }

    public function getReadWriteUsers()
    {
        return $this->hasMany(User::className(), [
            'id' => 'userId',
        ])
            ->viaTable('{{%coachmarks_rw_permissions}}', [
                'coachmarkId' => 'id',
            ]);
    }

    public static function find(): CoachmarkQuery
    {
        return new CoachmarkQuery(get_called_class());
    }

    public function getUsers()
    {
        $data = Json::decode($this->permissions);

        $mapped = array_map(
            function ($permission) {
                return $permission->userId;
            },
            $data
        );
        return $mapped;
    }

    /**
     * @param Coachmark[] $data
     * @return array
     */
    public static function apiTransform($data): array
    {
        $userIdTransform = function (array $users) {
            return array_map(
                /**
                 * @param \craft\records\User $user
                 * @return int
                 */
                function ($user) {
                    return $user->id;
                },
                $users
            );
        };

        return array_map(
            /**
             * @param Coachmark $coachmark
             * @return array
             */
            function (Coachmark $coachmark) use ($userIdTransform) {
                return [
                    'id' => $coachmark->id,
                    'title' => $coachmark->title,
                    'steps' => Step::apiTransform($coachmark->steps),
                    'readOnlyUsers' => $userIdTransform($coachmark->readOnlyUsers),
                    //UserRecord::apiTransform($coachmark->readOnlyUsers),
                    'readWriteUsers' => $userIdTransform($coachmark->readWriteUsers),
                    //UserRecord::apiTransform($coachmark->readWriteUsers),
                ];
            },
            $data
        );
    }

    public function getSteps()
    {
        return $this->hasMany(Step::className(), ['coachmarkId' => 'id'])->orderBy('order asc');
    }
}
