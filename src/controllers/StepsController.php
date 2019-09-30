<?php

namespace unionco\coachmarks\controllers;

use Craft;
use craft\web\Request;
use craft\helpers\Json;
use craft\web\Controller;
use unionco\coachmarks\records\Step;

class StepsController extends Controller
{
    protected $allowAnonymous = true;

    protected function getUri()
    {
        /** @var Request */
        $request = Craft::$app->getRequest();
        $url = $request->getReferrer();
        $components = \parse_url($url);
        
        $output = $components['path'];
        if ($components['query'] ?? false) {
            $output .= '?' . $components['query'];
        }
        if ($components['fragment'] ?? false) {
            $output .= '#' . $components['fragment'];
        }
        return $output;
    }

    /**
     * Endpoint for saving new steps (id < 1), or editing existing steps (id >= 1)
     */
    public function actionEdit()
    {
        $this->requirePostRequest();

        /** @var Request */
        $request = Craft::$app->getRequest();
        /** @var string */
        $json = $request->getRawBody();
        /** @var \stdClass */
        $data = Json::decode($json, false);
        /** @var \stdClass */
        $input = $data->step;

        try {
            /** @var null|bool */
            $result = null;
            /** @var Step|null */
            $s = null;

            if (isset($input->id) && $input->id > 0) {
                $s = Step::findOne($input->id);
                if (!$s) {
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
            $s->description = $input->description;
            $s->url = $input->url ?? $this->getUri();
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
