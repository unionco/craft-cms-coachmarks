<?php
/**
 * Coacher plugin for Craft CMS 3.x
 *
 * Coachmarks plugin for CraftCMS.
 *
 * @link      https://github.com/fvaldes33
 * @copyright Copyright (c) 2019 Franco Valdes
 */

namespace unionco\coachmarks\elements;

use unionco\coachmarks\Coacher;
use unionco\coachmarks\elements\db\CoachmarkQuery;

use Craft;
use craft\base\Element;
use craft\elements\db\ElementQuery;
use craft\elements\db\ElementQueryInterface;
use craft\validators\SiteIdValidator;
use craft\helpers\Json;
use craft\elements\actions\Delete;
use craft\elements\actions\Edit;
use craft\elements\actions\Restore;

/**
 * Coachmark Element
 *
 * Element is the base class for classes representing elements in terms of objects.
 *
 * @property FieldLayout|null      $fieldLayout           The field layout used by this element
 * @property array                 $htmlAttributes        Any attributes that should be included in the element’s DOM representation in the Control Panel
 * @property int[]                 $supportedSiteIds      The site IDs this element is available in
 * @property string|null           $uriFormat             The URI format used to generate this element’s URL
 * @property string|null           $url                   The element’s full URL
 * @property \Twig_Markup|null     $link                  An anchor pre-filled with this element’s URL and title
 * @property string|null           $ref                   The reference string to this element
 * @property string                $indexHtml             The element index HTML
 * @property bool                  $isEditable            Whether the current user can edit the element
 * @property string|null           $cpEditUrl             The element’s CP edit URL
 * @property string|null           $thumbUrl              The URL to the element’s thumbnail, if there is one
 * @property string|null           $iconUrl               The URL to the element’s icon image, if there is one
 * @property string|null           $status                The element’s status
 * @property Element               $next                  The next element relative to this one, from a given set of criteria
 * @property Element               $prev                  The previous element relative to this one, from a given set of criteria
 * @property Element               $parent                The element’s parent
 * @property mixed                 $route                 The route that should be used when the element’s URI is requested
 * @property int|null              $structureId           The ID of the structure that the element is associated with, if any
 * @property ElementQueryInterface $ancestors             The element’s ancestors
 * @property ElementQueryInterface $descendants           The element’s descendants
 * @property ElementQueryInterface $children              The element’s children
 * @property ElementQueryInterface $siblings              All of the element’s siblings
 * @property Element               $prevSibling           The element’s previous sibling
 * @property Element               $nextSibling           The element’s next sibling
 * @property bool                  $hasDescendants        Whether the element has descendants
 * @property int                   $totalDescendants      The total number of descendants that the element has
 * @property string                $title                 The element’s title
 * @property string|null           $serializedFieldValues Array of the element’s serialized custom field values, indexed by their handles
 * @property array                 $fieldParamNamespace   The namespace used by custom field params on the request
 * @property string                $contentTable          The name of the table this element’s content is stored in
 * @property string                $fieldColumnPrefix     The field column prefix this element’s content uses
 * @property string                $fieldContext          The field context this element’s content uses
 *
 * http://pixelandtonic.com/blog/craft-element-types
 *
 * @author    Franco Valdes
 * @package   Coacher
 * @since     1.0.0
 */
class Coachmark extends Element
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
    // public $steps;


    // Static Methods
    // =========================================================================

    /**
     * Returns the display name of this class.
     *
     * @return string The display name of this class.
     */
    public static function displayName(): string
    {
        return Craft::t('coachmarks', 'Coachmark');
    }

    /**
     * Returns whether elements of this type will be storing any data in the `content`
     * table (tiles or custom fields).
     *
     * @return bool Whether elements of this type will be storing any data in the `content` table.
     */
    public static function hasContent(): bool
    {
        return false;
    }

    /**
     * Returns whether elements of this type have traditional titles.
     *
     * @return bool Whether elements of this type have traditional titles.
     */
    public static function hasTitles(): bool
    {
        return false;
    }

    /**
     * Returns whether elements of this type have statuses.
     *
     * If this returns `true`, the element index template will show a Status menu
     * by default, and your elements will get status indicator icons next to them.
     *
     * Use [[statuses()]] to customize which statuses the elements might have.
     *
     * @return bool Whether elements of this type have statuses.
     * @see statuses()
     */
    public static function isLocalized(): bool
    {
        return true;
    }

    /**
     * Creates an [[ElementQueryInterface]] instance for query purpose.
     *
     * The returned [[ElementQueryInterface]] instance can be further customized by calling
     * methods defined in [[ElementQueryInterface]] before `one()` or `all()` is called to return
     * populated [[ElementInterface]] instances. For example,
     *
     * ```php
     * // Find the entry whose ID is 5
     * $entry = Entry::find()->id(5)->one();
     *
     * // Find all assets and order them by their filename:
     * $assets = Asset::find()
     *     ->orderBy('filename')
     *     ->all();
     * ```
     *
     * If you want to define custom criteria parameters for your elements, you can do so by overriding
     * this method and returning a custom query class. For example,
     *
     * ```php
     * class Product extends Element
     * {
     *     public static function find()
     *     {
     *         // use ProductQuery instead of the default ElementQuery
     *         return new ProductQuery(get_called_class());
     *     }
     * }
     * ```
     *
     * You can also set default criteria parameters on the ElementQuery if you don’t have a need for
     * a custom query class. For example,
     *
     * ```php
     * class Customer extends ActiveRecord
     * {
     *     public static function find()
     *     {
     *         return parent::find()->limit(50);
     *     }
     * }
     * ```
     *
     * @return ElementQueryInterface The newly created [[ElementQueryInterface]] instance.
     */
    public static function find(): ElementQueryInterface
    {
        return new CoachmarkQuery(static::class);
    }

    /**
     * Defines the sources that elements of this type may belong to.
     *
     * @param string|null $context The context ('index' or 'modal').
     *
     * @return array The sources.
     * @see sources()
     */
    protected static function defineSources(string $context = null): array
    {
        $sources = [
            [
                'key' => '*',
                'label' => 'All Coachmarks',
                'criteria' => [],
            ],
            [
                'key' => 'global',
                'label' => 'Global Coachmarks',
                'criteria' => [
                    'context' => 'global'
                ],
            ],
            [
                'key' => 'entries',
                'label' => 'Entry Coachmarks',
                'criteria' => [
                    'context' => 'entries'
                ],
            ]
        ];

        return $sources;
    }

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
        $rules = parent::rules();
        $rules[] = ['title', 'string'];
        $rules[] = ['context', 'string'];
        // $rules[] = ['steps', 'string'];
        $rules[] = ['siteId', SiteIdValidator::class];
        $rules[] = [['title', 'context', 'siteId'], 'required'];

        return $rules;
    }

    /**
     * Returns whether the current user can edit the element.
     *
     * @return bool
     */
    public function getIsEditable(): bool
    {
        return true;
    }

    /**
     * 
     */
    public function getCpEditUrl()
    {
        return 'coachmarks/edit/'.$this->id;
    }

    // Table and Fields
    // -------------------------------------------------------------------------
    /**
     * @inheritdoc
     */
    protected static function defineActions(string $source = null): array
    {
        $actions = [];
        $elementsService = Craft::$app->getElements();

        $actions[] = $elementsService->createAction([
            'type' => Delete::class,
            'confirmationMessage' => Craft::t('coachmarks', 'Are you sure you want to delete the selected entries?'),
            'successMessage' => Craft::t('coachmarks', 'Entries deleted.'),
        ]);

        // Restore
        $actions[] = $elementsService->createAction([
            'type' => Restore::class,
            'successMessage' => Craft::t('coachmarks', 'Entries restored.'),
            'partialSuccessMessage' => Craft::t('coachmarks', 'Some entries restored.'),
            'failMessage' => Craft::t('coachmarks', 'Entries not restored.'),
        ]);

        return $actions;
    }

    /**
     * 
     */
    protected static function defineTableAttributes(): array
    {
        $attributes = [
            'id'          => Craft::t('coachmarks', 'ID'),
            'title'       => Craft::t('coachmarks', 'Title'),
            'context'     => Craft::t('coachmarks', 'Context'),
            'dateCreated' => Craft::t('coachmarks', 'Date Created'),
        ];

        return $attributes;
    }

    protected static function defineDefaultTableAttributes(string $source): array
    {
        return [
            'id',
            'title',
            'context',
            'dateCreated',
        ];
    }

    public function getTableAttributeHtml(string $attribute): string
    {
        return parent::getTableAttributeHtml($attribute); // TODO: Change the autogenerated stub
    }

    protected static function defineSortOptions(): array
    {
        $sortOptions = parent::defineSortOptions();

        unset($sortOptions['dateCreated']);

        return $sortOptions;
    }

    // Events
    // -------------------------------------------------------------------------

    /**
     * Performs actions before an element is saved.
     *
     * @param bool $isNew Whether the element is brand new
     *
     * @return bool Whether the element should be saved
     */
    public function beforeSave(bool $isNew): bool
    {
        return true;
    }

    /**
     * Performs actions after an element is saved.
     *
     * @param bool $isNew Whether the element is brand new
     *
     * @return void
     */
    public function afterSave(bool $isNew)
    {
        if ($isNew) {
            Craft::$app->db->createCommand()
                ->insert('{{%coachmarks_coachmark}}', [
                    'id'        => $this->id,
                    'title'     => $this->title,
                    'context'   => $this->context,
                    // 'steps'     => $this->steps,
                    'siteId'    => Craft::$app->getSites()->getPrimarySite()->id
                ])
                ->execute();
        } else {
            Craft::$app->db->createCommand()
                ->update('{{%coachmarks_coachmark}}', [
                    'title'     => $this->title,
                    'context'   => $this->context,
                    // 'steps'     => $this->steps,
                    'siteId'    => Craft::$app->getSites()->getPrimarySite()->id
                ], ['id' => $this->id])
                ->execute();
        }

        parent::afterSave($isNew);
    }

    /**
     * Performs actions before an element is deleted.
     *
     * @return bool Whether the element should be deleted
     */
    public function beforeDelete(): bool
    {
        return true;
    }

    /**
     * Performs actions after an element is deleted.
     *
     * @return void
     */
    public function afterDelete()
    {
    }
}
