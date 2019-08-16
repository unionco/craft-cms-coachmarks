<?php

namespace unionco\coachmarks\migrations;

use Craft;
use craft\db\Migration;
use unionco\coachmarks\elements\db\Table;

/**
 * m190816_171156_create_steps_table migration.
 */
class m190816_171156_create_steps_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->createTable(Table::STEPS, [
            'id' => $this->primaryKey(),
            'title' => $this->string(255)->notNull(),
            'description' => $this->longText()->notNull(),
            'label' => $this->string(255)->notNull(),
            'url' => $this->string(255)->notNull(),
            'order' => $this->integer()->notNull(),
            'selectorNode' => $this->string(255)->notNull(),
            'selectorPosition' => $this->string(255)->notNull(),
            'dateCreated' => $this->dateTime()->notNull(),
            'dateUpdated' => $this->dateTime()->notNull(),
            'uid' => $this->uid()
        ]);
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        echo "m190816_171156_create_steps_table cannot be reverted.\n";
        return false;
    }
}
