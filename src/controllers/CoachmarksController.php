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

        // var_dump($user); die;
        $coachmarks = Coachmark::find()
            // ->joinWith([
            //     // 'elements' => function ($query) {
            //     //     $query->from(['element' => '{{%elements}}']);
            //     // },
            //     'readOnlyUsers' => function ($query) {
            //         $query->from(['ro' => '{{%coachmarks_coachmarks_ro_users}}']);
            //     },
            //     'readWriteUsers' => function ($query) {
            //         $query->from(['rw' => '{{%coachmarks_coachmarks_rw_users}}']);
            //     }
            // ])
            // // ->innerJoin('{{%users}}', 'users.id = ro.userId')
            // ->where(['=', 'ro.userId', $user->id])
            // ->orWhere(['=', 'rw.userId', $user->id])
            ->userId($user->id)
            ->with(['steps'])
            // ->asArray()
            ->all();
        $coachmarksData = array_map(
            function ($coachmark) {
                return [
                    'id' => $coachmark->id,
                    // 'readOnlyUsers' => $coachmark->readOnlyUsers,
                    // 'readWriteUsers' => $coachmark->readWriteUsers,
                    'steps' => $coachmark->steps,
                ];
            },
            $coachmarks
        );
        return $this->asJson($coachmarksData);
    }
}
