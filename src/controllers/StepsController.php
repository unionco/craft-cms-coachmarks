<?php

namespace unionco\coachmarks\controllers;

use Craft;
use craft\helpers\Json;
use craft\web\Controller;
use unionco\coachmarks\records\Step;

class StepsController extends Controller
{
    protected $allowAnonymous = true;

    public function actionNew()
    {
        $this->requirePostRequest();

        $json = Craft::$app->getRequest()->getRawBody();
        $data = Json::decode($json, false);
        $input = $data->step;

        try {
            $result = null;
            $s = null;
            
            if (isset($input->id) && $input->id > 0) {
                $s = Step::findOne($input->id);
                if (!$cm) {
                    throw new \Exception('Step not found: ' . $input->id);
                }
            } else {
                $s = new Step();
            }

            $s->coachmarkId = $input->coachmarkId;
            $s->label = $input->label;
            $s->tooltipPosition = $input->tooltipPosition;
            $s->selectorNode = $input->selectedNode;
            $s->title = '';
            $s->description = '';
            $s->url = '';
            $s->order = 5;
            $result = $s->save();


            return $this->asJson([
                'success' => $result,
                'id' => $s->id,
            ]);
        } catch (\Throwable $e) {
            return $this->asJson($e);
        }
    }
}
