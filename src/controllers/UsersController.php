<?php

namespace unionco\coachmarks\controllers;

use Craft;
use craft\records\User;
use craft\web\Controller;
use unionco\coachmarks\models\UserRecord;

class UsersController extends Controller
{
    protected $allowAnonymous = true;

    public function actionUsers()
    {
        $users = User::find()->all();

        return $this->asJson([
            'users' => UserRecord::apiTransform($users)
        ]);
    }

    public function actionCurrent()
    {
        $currentUser = Craft::$app->getUser()->getIdentity();
        return $this->asJson([
            'user' => $currentUser->id,
        ]);
    }
}
