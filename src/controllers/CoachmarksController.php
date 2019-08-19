<?php

namespace unionco\coachmarks\controllers;

use Craft;
use craft\web\Controller;
use unionco\coachmarks\records\Coachmark;

class CoachmarksController extends Controller
{
    protected $allowAnonymous = true;
    public function actionCoachmarks()
    {
        $user = Craft::$app->getUser()->getIdentity();

        $coachmarks = Coachmark::find()
            ->userId($user->id)
            ->with(['steps'])
            ->all();
        $coachmarksData = array_map(
            function ($coachmark) {
                return [
                    'id' => $coachmark->id,
                    'title' => $coachmark->title,
                    'steps' => $coachmark->steps,
                ];
            },
            $coachmarks
        );
        return $this->asJson([
            'coachmarks' => $coachmarksData,
        ]);
    }
}
