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
        $this->driver = Craft::$app->getConfig()->getDb()->driver;
        if ($this->createTables()) {
            // $this->addForeignKeys();
            // Refresh the db schema caches
            Craft::$app->db->schema->refresh();
            $this->insertDefaultData();
        }

        return true;
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
        $this->driver = Craft::$app->getConfig()->getDb()->driver;
        $this->removeTables();

        return true;
    }

    // Protected Methods
    // =========================================================================

    /**
     * Creates the tables needed for the Records used by the plugin
     *
     * @return bool
     */
    protected function createTables()
    {
        $tablesCreated = false;

        // coachmarks_coachmark table
        $tableSchema = Craft::$app->db->schema->getTableSchema(Table::COACHMARKS);
        if ($tableSchema === null) {
            $tablesCreated = true;
            $this->createTable(
                Table::COACHMARKS,
                [
                    'id' => $this->primaryKey(),
                    'title' => $this->string(255)->notNull(),
                    'read_only' => $this->boolean(),
                    'dateCreated' => $this->dateTime()->notNull(),
                    'dateUpdated' => $this->dateTime()->notNull(),
                    'uid' => $this->uid(),
                ]
            );
        }

        return $tablesCreated;
    }

    /**
     * Creates the foreign keys needed for the Records used by the plugin
     *
     * @return void
     */
    protected function addForeignKeys()
    {
        // coachmarks_coachmark table
        // $this->addForeignKey(
        //     $this->db->getForeignKeyName('{{%coachmarks_coachmark}}', 'siteId'),
        //     '{{%coachmarks_coachmark}}',
        //     'siteId',
        //     '{{%sites}}',
        //     'id',
        //     'CASCADE',
        //     'CASCADE'
        // );

        // $this->addForeignKey(
        //     $this->db->getForeignKeyName('{{%coachmarks_coachmark}}', 'id'),
        //     '{{%coachmarks_coachmark}}',
        //     'id',
        //     '{{%elements}}',
        //     'id',
        //     'CASCADE',
        //     'CASCADE'
        // );
    }

    /**
     * Populates the DB with the default data.
     *
     * @return void
     */
    protected function insertDefaultData()
    {
    }

    /**
     * Removes the tables needed for the Records used by the plugin
     *
     * @return void
     */
    protected function removeTables()
    {
        // coachmarks_coachmark table
        $this->dropTableIfExists('{{%coachmarks_coachmark}}');
    }
}
