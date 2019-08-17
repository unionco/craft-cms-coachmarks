<?php

namespace unionco\coachmarks\console\controllers;

use Craft;
use craft\elements\User;
use craft\records\User as UserRecord;
use craft\console\Controller;
use unionco\coachmarks\records\Coachmark;
use unionco\coachmarks\records\Step;

class DebugController extends Controller
{
    public function actionIndex()
    {
        $coachmark = new Coachmark();
        //$coachmark->readOnlyUsers = [1];

        $coachmark->title = 'Testing';
        // $coachmark->siteId = 1;
        // /** @var User */
        // $user = User::find()->id(1)->one();

        $user = UserRecord::find()->where(['=', '{{%users}}.id', '1'])->one();
        var_dump($coachmark->save());
        $coachmark->link('readOnlyUsers', $user);
        var_dump($coachmark->save());
    }

    public function actionReadWrite()
    {
        $coachmark = Coachmark::find()->where(['=', '{{%coachmarks_coachmarks}}.id', 1])->one();
        echo $coachmark->id;
        $user = UserRecord::find()->where(['=', '{{%users}}.id', 1])->one();
        // var_dump($user);
        $coachmark->unlink('readOnlyUsers', $user, true);
        $coachmark->save();
        $coachmark->link('readWriteUsers', $user);
        $coachmark->save();
    }

    public function actionAddSteps()
    {
        $coachmark = Coachmark::find()->where(['=', '{{%coachmarks_coachmarks}}.id', 1])->one();

        $step = new Step();
        $step->title = 'Test';
        $step->order = 1;
        $step->description = '';
        $step->label = 'Label';
        $step->tooltipPosition = 'right';
        $step->url = '/admin/entries';
        $step->selectorNode = '#global-container';
// ]        $step->coachmark =
            $result = $step->save();
        $coachmark->link('steps', $step);
        var_dump($result);
    }
}
