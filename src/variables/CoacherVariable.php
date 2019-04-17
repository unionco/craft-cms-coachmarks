<?php
/**
 * Calendarize plugin for Craft CMS 3.x
 *
 * Calendar element types
 *
 * @link      https://union.co
 * @copyright Copyright (c) 2018 Franco Valdes
 */

namespace franco\coacher\variables;

use Craft;
use craft\elements\Entry;
use craft\elements\MatrixBlock;

/**
 * @author    Franco Valdes
 * @package   Calendarize
 * @since     1.0.0
 */
class CoacherVariable
{
    // Public Methods
    // =========================================================================

    /**
     * @return array
     */
    public function stepColumns()
    {
        return [
            'col1' => [
                'heading' => 'Title',
                'handle' => 'title',
                'type' => 'singleline'
            ],
            'col2' => [
                'heading' => 'Description',
                'handle' => 'description',
                'type' => 'multiline'
            ],
            'col3' => [
                'heading' => 'Selector',
                'handle' => 'selector',
                'type' => 'singleline'
            ],
            'col4' => [
                'heading' => 'position',
                'handle' => 'Position',
                'type' => 'select',
                'options' => [
                    ['value' => 'bottom', 'label' => 'Bottom', 'default' => true],
                    ['value' => 'top', 'label' => 'Top'],
                    ['value' => 'left', 'label' => 'Left'],
                    ['value' => 'right', 'label' => 'Right'],
                ]
            ]
        ];
    }

    /**
     * 
     */
    public function contextOptions()
    {
        return [
            ["value" => "global", "label" => "Global"],
            ["value" => "entries", "label" => "Entries"],
            ["value" => "categories", "label" => "Categories"],
            ["value" => "users", "label" => "Users"],
            ["value" => "plugins", "label" => "Plugins"],
        ];
    }
}
