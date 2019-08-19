<?php

namespace unionco\coachmarks\controllers;

use Craft;
use craft\web\Controller;
use craft\elements\User;

class UsersController extends Controller
{
    protected $allowAnonymous = true;
    public function actionUsers()
    {
        $users = User::find()->all();
        $data = array_map(
            function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                ];
            },
            $users
        );

        return $this->asJson([
            'users' => $data,
        ]);
    }
}
