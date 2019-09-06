<?php

namespace unionco\coachmarks\records\db;

use yii\db\ActiveQuery;

class CoachmarkQuery extends ActiveQuery
{
    public function init()
    {
        //
        parent::init();
    }

    public function id($id)
    {
        return $this->andOnCondition("id = :id", ['id' => $id]);
    }

    public function userId($id)
    {
        return $this->andOnCondition("permissions like '%userId\":\"" . $id . "\"%'");
    }
}
