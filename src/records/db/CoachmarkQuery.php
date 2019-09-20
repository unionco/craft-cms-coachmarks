<?php

namespace unionco\coachmarks\records\db;

use yii\db\ActiveQuery;

class CoachmarkQuery extends ActiveQuery
{
    public function id($id)
    {
        return $this->andOnCondition("id = :id", ['id' => $id]);
    }

    public function userId($id)
    {
        return $this
            ->addSelect('co.id')
            ->from('{{%coachmarks_coachmarks}} co')
            ->leftJoin('{{%coachmarks_ro_permissions}} ro', 'ro.coachmarkId = co.id')
            ->leftJoin('{{%coachmarks_rw_permissions}} rw', 'rw.coachmarkId = co.id')
            ->andWhere(['=', 'ro.userId', $id])
            ->orWhere(['=', 'rw.userid', $id]);
    }
}
