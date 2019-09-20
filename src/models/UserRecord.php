<?php

namespace unionco\coachmarks\models;

use craft\records\User;
use unionco\coachmarks\models\ApiTransformable;

class UserRecord extends User implements ApiTransformable
{
    /**
     * @param User[] $data array of user records
     * @return array
     */
    public static function apiTransform($data): array
    {
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
                ];
            },
            $data
        );
    }
}
