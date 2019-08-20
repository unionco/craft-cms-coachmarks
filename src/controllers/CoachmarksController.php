<?php

namespace unionco\coachmarks\controllers;

use Craft;
use craft\helpers\Json;
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
                    'readOnlyUsers' => $coachmark->readOnlyUsers,
                    'readWriteUsers' => $coachmark->readWriteUsers,
                ];
            },
            $coachmarks
        );
        return $this->asJson([
            'coachmarks' => $coachmarksData,
        ]);
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

    public function actionNew()
    {
        $this->requirePostRequest();

        $json = Craft::$app->getRequest()->getRawBody();
        $data = Json::decode($json, false);
        $input = $data->coachmark;

        try {
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
            $cm->setReadOnlyUsers($input->readOnlyUsers);
            $cm->setReadWriteUsers($input->readWriteUsers);
            $result = $cm->save();

            return $this->asJson([
                'success' => $result,
                'id' => $cm->id,
            ]);
        } catch (\Throwable $e) {
            return $this->asJson($e);
        }
    }
}
