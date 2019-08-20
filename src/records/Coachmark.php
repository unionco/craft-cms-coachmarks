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
use craft\helpers\Json;
use craft\db\ActiveRecord;
use unionco\coachmarks\Coacher;
use unionco\coachmarks\records\db\CoachmarkQuery;
use unionco\coachmarks\records\Step;
use craft\records\User;

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

    public static function find(): CoachmarkQuery
    {
        return new CoachmarkQuery(get_called_class());
    }

    public function getUsers()
    {
        $data = Json::decode($this->permissions);

        $mapped = array_map(
            function ($permission) {
                return $permission->userId;
            },
            $data
        );
        return $mapped;
    }

    public function getReadOnlyUsers()
    {
        $data = Json::decode($this->permissions, false) ?? [];
        $filtered = array_filter($data, function ($permission) {
            return $permission->readWrite === false;
        });
        $mapped = array_map(
            function ($permission) {
                return $permission->userId;
            },
            $filtered
        );
        return $mapped;
    }

    public function addReadOnlyUser($id)
    {
        if ($id instanceof User) {
            $id = $id->id;
        }
        $this->removeUserPermission($id);
        $data = Json::decode($this->permissions);
        $data[] = [
            'userId' => $id,
            'readWrite' => false,
        ];
        $this->permissions = Json::encode($data);
    }

    public function removeAllReadOnlyUsers()
    {
        $data = Json::decode($this->permissions, false);
        // Remove all readOnly users
        $data = array_filter(
            $data,
            function ($permission) {
                return $permission->readWrite === true;
            }
        );
        $this->permissions = Json::encode($data);
    }

    public function setReadOnlyUsers($ids)
    {
        $this->removeAllReadOnlyUsers();
        foreach ($ids as $id) {
            $this->addReadOnlyUser($id);
        }
    }

    public function removeUserPermission($id)
    {
        if ($id instanceof User) {
            $id = $id->id;
        }
        $data = Json::decode($this->permissions, false) ?? [];
        $data = array_filter($data, function ($permission) use ($id) {
            $permission->userId !== $id;
        });
        $this->permissions = Json::encode($data);
    }

    public function addReadWriteUser($id)
    {
        if ($id instanceof User) {
            $id = $id->id;
        }
        // Remove from readonly, if user is already on this coachmark
        $this->removeUserPermission($id);
        $data = Json::decode($this->permissions, false) ?? [];
        $data[] = [
            'userId' => $id,
            'readWrite' => true,
        ];
        $this->permissions = Json::encode($data);
    }

    public function getReadWriteUsers()
    {
        $data = Json::decode($this->permissions, false) ?? [];
        $filtered = array_filter($data, function ($permission) {
            return $permission->readWrite === true;
        });
        $mapped = array_map(
            function ($permission) {
                return $permission->userId;
            },
            $filtered
        );
        return $mapped;
    }

    public function removeAllReadWriteUsers()
    {
        $data = Json::decode($this->permissions, false);
        // Remove all read/write users
        $data = array_filter(
            $data,
            function ($permission) {
                return $permission->readWrite === false;
            }
        );
        $this->permissions = Json::encode($data);
    }

    public function setReadWriteUsers($ids)
    {
        $this->removeAllReadWriteUsers();
        foreach ($ids as $id) {
            $this->addReadWriteUser($id);
        }
    }

    public function getSteps()
    {
        return $this->hasMany(Step::className(), ['coachmarkId' => 'id'])->orderBy('order asc');
    }
}
