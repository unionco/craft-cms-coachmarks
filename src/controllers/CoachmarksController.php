<?php

namespace unionco\coachmarks\controllers;

use Craft;
use yii\db\Expression;
use craft\helpers\Json;
use craft\records\User;
use craft\web\Controller;
use unionco\coachmarks\records\Step;
use unionco\coachmarks\models\UserRecord;
use unionco\coachmarks\records\Coachmark;

class CoachmarksController extends Controller
{
    protected $allowAnonymous = true;

    public function actionIndex()
    {
        // During development, allow user id to be passed in
        $userId = Craft::$app->getRequest()->getQueryParam('userId');
        if (!$userId) {
            $user = Craft::$app->getUser()->getIdentity();
            $userId = $user->id;
        }
        $all = Coachmark::find()->all();
        $coachmarks = Coachmark::find()
            ->userId($userId)
            ->with([
                'steps',
                'readOnlyUsers',
                'readWriteUsers',
            ])->all();
        // $coachmarksQuery = $coachmarks->createCommand()->getRawSql();
        
        // $coachmarksData = array_map(
        //     /**
        //      * @param Coachmark $coachmark
        //      * @return array
        //      */
        //     function ($coachmark) {
        //         return [
        //             'steps' => Step::apiTransform($coachmark->steps),
        //             'readOnlyUsers' => UserRecord::apiTransform($coachmark->readOnlyUsers),
        //             'readWriteUsers'=> UserRecord::apiTransform($coachmark->readWriteUsers),
        //         ];
        //     },
        //     $coachmarks
        // );
        
        return $this->asJson(Coachmark::apiTransform($coachmarks));
        // ;$this->asJson([
        //     'all' => $all,
        //     'coachmarks' => $coachmarksData,
        // ]);
    }

    public function actionOne($id)
    {
        $user = Craft::$app->getUser()->getIdentity();

        $coachmark = Coachmark::find()
            ->with('steps')
            ->id($id)
            ->userId($user->id)
            ->one();

        return $this->asJson([
            'coachmark' => $coachmark,
        ]);
    }

    public function actionEdit()
    {
        $this->requirePostRequest();

        $json = Craft::$app->getRequest()->getRawBody();
        $data = Json::decode($json, false);
        $input = $data->coachmark;

        try {
            /** @var null|bool */
            $result = null;
            /** @var Coachmark|null */
            $cm = null;

            if (isset($input->id) && $input->id > 0) {
                $cm = Coachmark::findOne($input->id);
                if (!$cm) {
                    throw new \Exception('Coachmark not found: ' . $input->id);
                }
            } else {
                $cm = new Coachmark();
            }
            $cm->title = $input->title;
            // $cm->setReadOnlyUsers($input->readOnlyUsers);
            // $cm->setReadWriteUsers($input->readWriteUsers);
            $result = $cm->save();
            foreach ($input->readOnlyUsers as $roUserId) {
                if ($roUserId instanceof \stdClass) {
                    $roUserId = $roUserId->id;
                }
                $user = User::find()
                    ->where(['=', 'element.id', new Expression($roUserId)])
                    ->one();
                if ($user) {
                    $cm->link('readOnlyUsers', $user);
                }
            }
            foreach ($input->readWriteUsers as $rwUserId) {
                if ($rwUserId instanceof \stdClass) {
                    $rwUserId = $rwUserId->id;
                }
                $user = User::find()
                    ->where(['=', 'element.id', new Expression($rwUserId)])
                    ->one();
                if ($user) {
                    $cm->link('readWriteUsers', $user);
                }
            }

            return $this->asJson([
                'success' => $result,
                'id' => $cm->id,
            ]);
        } catch (\Throwable $e) {
            return $this->asErrorJson($e);
        }
    }
}
