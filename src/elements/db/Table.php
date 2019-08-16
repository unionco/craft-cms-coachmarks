<?php
/**
 * Ticketmaster plugin for Craft CMS 3.x
 *
 * Ticket master ticket feed for venues.
 *
 * @link      https://github.com/unionco
 * @copyright Copyright (c) 2019 Union
 */

namespace unionco\coachmarks\elements\db;

/**
 * This class provides constants for defining plugins database table names.
 *
 * @author    Union
 * @package   Ticketmaster
 * @since     1.0.0
 */
abstract class Table
{
    const COACHMARKS = '{{%coachmarks_coachmark}}';
    const STEPS = '{{%coachmarks_step}}';
}
