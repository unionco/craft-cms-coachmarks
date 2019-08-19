<?php

namespace unionco\coachmarks\controllers;

use craft\web\Controller;

class StepsController extends Controller
{
    protected $allowAnonymous = true;

    public function actionNew()
    {
        $this->requirePostRequest();

        return $this->asJson(['success' => true]);
    }
}
