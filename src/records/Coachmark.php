<?php

/**
 * Coacher plugin for Craft CMS 3.x
 *
 * Coachmarks plugin for CraftCMS.
 *
 * @link      https://github.com/fvaldes33
 * @copyright Copyright (c) 2019 Franco Valdes
 */

namespace unionco\coachmarks\records;

use Craft;

use craft\db\ActiveRecord;
use unionco\coachmarks\Coacher;
use unionco\coachmarks\records\Step;

/**
 * Coachmark Record
 *
 * ActiveRecord is the base class for classes representing relational data in terms of objects.
 *
 * Active Record implements the [Active Record design pattern](http://en.wikipedia.org/wiki/Active_record).
 * The premise behind Active Record is that an individual [[ActiveRecord]] object is associated with a specific
 * row in a database table. The object's attributes are mapped to the columns of the corresponding table.
 * Referencing an Active Record attribute is equivalent to accessing the corresponding table column for that record.
 *
 * http://www.yiiframework.com/doc-2.0/guide-db-active-record.html
 *
 * @author    Franco Valdes
 * @package   Coacher
 * @since     1.0.0
 */
class Coachmark extends ActiveRecord
{
    public static function tableName()
    {
        return '{{%coachmarks_coachmarks}}';
    }

    public function getReadOnlyUsers()
    {
        return $this->hasMany(\craft\records\User::className(), ['id' => 'userId'])
            ->viaTable('{{%coachmarks_coachmarks_ro_users}}', ['coachmarkId' => 'id']);
    }

    public function getReadWriteUsers()
    {
        return $this->hasMany(\craft\records\User::className(), ['id' => 'userId'])
            ->viaTable('{{%coachmarks_coachmarks_rw_users}}', ['coachmarkId' => 'id']);
    }

    public function getSteps()
    {
        return $this->hasMany(Step::className(), ['coachmarkId' => 'id']);
    }
}
