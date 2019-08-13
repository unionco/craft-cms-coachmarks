<?php
/**
 * Coacher plugin for Craft CMS 3.x
 *
 * Coachmarks plugin for CraftCMS.
 *
 * @link      https://github.com/fvaldes33
 * @copyright Copyright (c) 2019 Franco Valdes
 */

namespace unionco\coachmarks\elements\db;

use unionco\coachmarks\Coacher;

use craft\elements\db\ElementQuery;
use craft\helpers\Db;

class CoachmarkQuery extends ElementQuery
{
     /**
     * @var string
     */
    public $title;

    /**
     * @var string
     */
    public $context;

    /**
     * 
     */
    public function title($value)
    {
        $this->title = $value;

        return $this;
    }

    public function context($value)
    {
        $this->context = $value;

        return $this;
    }

    protected function beforePrepare(): bool
    {
        // join in the products table
        $this->joinElementTable('coachmarks_coachmark');

        // select the columns
        $this->query->select([
            'coachmarks_coachmark.title',
            'coachmarks_coachmark.context',
            'coachmarks_coachmark.steps'
        ]);

        if ($this->title) {
            $this->subQuery->andWhere(Db::parseParam('coachmarks_coachmark.title', $this->title));
        }

        if ($this->context) {
            $this->subQuery->andWhere(Db::parseParam('coachmarks_coachmark.context', $this->context));
        }

        return parent::beforePrepare();
    }
}