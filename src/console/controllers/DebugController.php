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
    // public function actionIndex()
    // {
    //     $coachmark = new Coachmark();

    //     $coachmark->title = 'Testing';
    //     $coachmark->addReadOnlyUser(1);
    //     $coachmark->save();

    //     $step = new Step();
    //     $step->order = 0;
    //     $step->title = 'Get started';
    //     $step->description = '';
    //     $step->label = '';
    //     $step->tooltipPosition = 'bottom';
    //     $step->url = '/admin/';
    //     $step->selectorNode = '';
    //     // $coachmark->siteId = 1;
    //     // /** @var User */
    //     // $user = User::find()->id(1)->one();

    //     // $user = UserRecord::find()->where(['=', '{{%users}}.id', '1'])->one();
    //     // var_dump($coachmark->save());
    //         // $coachmark->link('readOnlyUsers', $user);
    //     var_dump($coachmark->save());
    // }

    public function actionSeed()
    {
        $cm = new Coachmark();
        $cm->title = "Read/Write Test";
        $cm->addReadWriteUser(1);
        $cm->save();

        $step = new Step();
        $step->order = 0;
        $step->title = 'Get started';
        $step->description = 'Lorem ipsem';
        $step->label = 'Tooltip';
        $step->tooltipPosition = 'bottom';
        $step->url = '/admin/dashboard/';
        $step->selectorNode = 'LI[id="nav-settings"] > A > SPAN:nth-child(2)';
        $step->save();
        $cm->link('steps', $step);

        $step = new Step();
        $step->order = 1;
        $step->title = 'Open General Settings';
        $step->label = 'Open General Settings';
        $step->description = '';
        $step->tooltipPosition = 'right';
        $step->url = '/admin/settings';
        $step->selectorNode = 'A[href="http://dev.craft-postgres.com/admin/settings/general"]';
        $step->save();
        $cm->link('steps', $step);

    }

//     public function actionAddSteps()
//     {
//         $coachmark = Coachmark::find()->where(['=', '{{%coachmarks_coachmarks}}.id', 1])->one();

//         $step = new Step();
//         $step->title = 'Test';
//         $step->order = 1;
//         $step->description = '';
//         $step->label = 'Label';
//         $step->tooltipPosition = 'right';
//         $step->url = '/admin/entries';
//         $step->selectorNode = '#global-container';
// // ]        $step->coachmark =
//             $result = $step->save();
//         $coachmark->link('steps', $step);
//         var_dump($result);
//     }
}
