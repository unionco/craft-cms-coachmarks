<?php

/**
 * Coacher plugin for Craft CMS 3.x
 *
 * Coachmarks plugin for CraftCMS.
 * * @link      https://github.com/fvaldes33
 * @copyright Copyright (c) 2019 Franco Valdes
 */

namespace unionco\coachmarks\migrations;

use unionco\coachmarks\Coacher;

use Craft;
use craft\config\DbConfig;
use craft\db\Migration;
use unionco\coachmarks\elements\db\Table;

/**
 * Coacher Install Migration
 *
 * If your plugin needs to create any custom database tables when it gets installed,
 * create a migrations/ folder within your plugin folder, and save an Install.php file
 * within it using the following template:
 *
 * If you need to perform any additional actions on install/uninstall, override the
 * safeUp() and safeDown() methods.
 *
 * @author    Franco Valdes
 * @package   Coacher
 * @since     1.0.0
 */
class Install extends Migration
{
    // Public Properties
    // =========================================================================

    /**
     * @var string The database driver to use
     */
    public $driver;

    // Public Methods
    // =========================================================================

    /**
     * This method contains the logic to be executed when applying this migration.
     * This method differs from [[up()]] in that the DB logic implemented here will
     * be enclosed within a DB transaction.
     * Child classes may implement this method instead of [[up()]] if the DB logic
     * needs to be within a transaction.
     *
     * @return boolean return a false value to indicate the migration fails
     * and should not proceed further. All other return values mean the migration succeeds.
     */
    public function safeUp()
    {
        $this->createTable(
            '{{%coachmarks_coachmarks}}',
            [
                'id' => $this->primaryKey(),
                'title' => $this->string(255)->notNull(),
                // 'read_only' => $this->boolean(),
                // 'readOnlyUsersJson' => $this->text(),
                // 'readWriteUsersJson' => $this->text(),
                'permissions' => $this->text(),
                'dateCreated' => $this->dateTime()->notNull(),
                'dateUpdated' => $this->dateTime()->notNull(),
                'uid' => $this->uid(),
            ]
        );
        $this->createTable(
            '{{%coachmarks_steps}}',
            [
                'id' => $this->primaryKey(),
                'coachmarkId' => $this->integer(),
                'title' => $this->string(255)->notNull(),
                'description' => $this->longText()->notNull(),
                'label' => $this->string(255)->notNull(),
                'tooltipPosition' => $this->string()->notNull(),
                'url' => $this->string(255)->notNull(),
                'order' => $this->integer()->notNull(),
                'selectorNode' => $this->string(255)->notNull(),
                // 'selectorPosition' => $this->string(255)->notNull(),
                'dateCreated' => $this->dateTime()->notNull(),
                'dateUpdated' => $this->dateTime()->notNull(),
                'uid' => $this->uid()
            ]
        );

        // $this->createTable('{{%coachmarks_coachmarks_ro_users}}', [
        //     'id' => $this->primaryKey(),
        //     'coachmarkId' => $this->integer()->notNull(),
        //     'userId' => $this->integer()->notNull(),
        //     'uid' => $this->uid(),
        //     'dateCreated' => $this->dateTime()->notNull(),
        //     'dateUpdated' => $this->dateTime()->notNull(),
        // ]);

        // $this->createTable('{{%coachmarks_coachmarks_users}}', [
        //     'id' => $this->primaryKey(),
        //     'coachmarkId' => $this->integer()->notNull(),
        //     'userId' => $this->integer()->notNull(),
        //     'readOnly' => $this->boolean(),
        //     'uid' => $this->uid(),
        //     'dateCreated' => $this->dateTime()->notNull(),
        //     'dateUpdated' => $this->dateTime()->notNull(),
        // ]);
    }

    /**
     * This method contains the logic to be executed when removing this migration.
     * This method differs from [[down()]] in that the DB logic implemented here will
     * be enclosed within a DB transaction.
     * Child classes may implement this method instead of [[down()]] if the DB logic
     * needs to be within a transaction.
     *
     * @return boolean return a false value to indicate the migration fails
     * and should not proceed further. All other return values mean the migration succeeds.
     */
    public function safeDown()
    {
        $this->dropTableIfExists('{{%coachmarks_coachmarks}}');
        $this->dropTableIfExists('{{%coachmarks_steps}}');
        // $this->dropTableIfExists('{{%coachmarks_coachma«rks_ro_users}}');
        $this->dropTableIfExists('{{%coachmarks_coachmarks_users}}');

        return true;
    }

    // Protected Methods
    // =========================================================================
}
