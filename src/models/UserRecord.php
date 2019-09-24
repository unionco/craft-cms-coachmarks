<?php

namespace unionco\coachmarks\models;

use Craft;
use craft\records\User;
use craft\services\UserPermissions;
use unionco\coachmarks\models\ApiTransformable;

class UserRecord extends User implements ApiTransformable
{
    /** @var null|UserPermissions */
    public static $userPermissions;

    /**
     * @param User[] $data array of user records
     * @return array
     */
    public static function apiTransform($data): array
    {
        if (!static::$userPermissions) {
            static::$userPermissions = Craft::$app->getUserPermissions();
        }

        return array_map(
            /**
             * @param User $user
             * @return array
             **/
            function (User $user) {
                return [
                    'id' => $user->id,
                    'firstName' => $user->firstName,
                    'lastName' => $user->lastName,
                    'email' => $user->email,
                    'admin' => $user->admin,
                    'username' => $user->username,
                    'createCoachmarks' => $user->admin ? true : static::$userPermissions
                        ->doesUserHavePermission($user->id, 'createCoachmarks'),
                ];
            },
            $data
        );
    }
}
