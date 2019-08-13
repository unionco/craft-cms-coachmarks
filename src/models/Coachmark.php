<?php
/**
 * Coacher plugin for Craft CMS 3.x
 *
 * Coachmarks plugin for CraftCMS.
 *
 * @link      https://github.com/fvaldes33
 * @copyright Copyright (c) 2019 Franco Valdes
 */

namespace unionco\coachmarks\models;

use unionco\coachmarks\Coacher;

use Craft;
use craft\base\Model;
use craft\validators\SiteIdValidator;

/**
 * Coachmark Model
 *
 * Models are containers for data. Just about every time information is passed
 * between services, controllers, and templates in Craft, it’s passed via a model.
 *
 * https://craftcms.com/docs/plugins/models
 *
 * @author    Franco Valdes
 * @package   Coacher
 * @since     1.0.0
 */
class Coachmark extends Model
{
    // Public Properties
    // =========================================================================

    /**
     * @var string
     */
    public $siteId;

    /**
     * @var string
     */
    public $title;

    /**
     * @var string
     */
    public $context;

    /**
     * @var string
     */
    public $steps;

    // Public Methods
    // =========================================================================

    /**
     * Returns the validation rules for attributes.
     *
     * Validation rules are used by [[validate()]] to check if attribute values are valid.
     * Child classes may override this method to declare different validation rules.
     *
     * More info: http://www.yiiframework.com/doc-2.0/guide-input-validation.html
     *
     * @return array
     */
    public function rules()
    {
        return [
            ['title', 'string'],
            ['context', 'string'],
            ['steps', 'array'],
            ['siteId', SiteIdValidator::class],
            [['title', 'context', 'steps', 'siteId'], 'required'],
        ];
    }
}
