<?php
/**
 * Coacher plugin for Craft CMS 3.x
 *
 * Coachmarks plugin for CraftCMS.
 *
 * @link      https://github.com/fvaldes33
 * @copyright Copyright (c) 2019 Franco Valdes
 */

namespace unionco\coachmarks\controllers;

use unionco\coachmarks\Coacher;

use Craft;
use craft\helpers\Json;
use craft\web\Controller;
use unionco\coachmarks\elements\Coachmark as CoachmarkElement;
use unionco\coachmarks\records\Coachmark as CoachmarkRecord;
use unionco\coachmarks\models\Coachmark as CoachmarkModel;

/**
 * SearchController Controller
 *
 * Generally speaking, controllers are the middlemen between the front end of
 * the CP/website and your plugin’s services. They contain action methods which
 * handle individual tasks.
 *
 * A common pattern used throughout Craft involves a controller action gathering
 * post data, saving it on a model, passing the model off to a service, and then
 * responding to the request appropriately depending on the service method’s response.
 *
 * Action methods begin with the prefix “action”, followed by a description of what
 * the method does (for example, actionSaveIngredient()).
 *
 * https://craftcms.com/docs/plugins/controllers
 *
 * @author    Franco Valdes
 * @package   Coacher
 * @since     1.0.0
 */
class CpController extends Controller
{

    // Protected Properties
    // =========================================================================

    /**
     * @var    bool|array Allows anonymous access to this controller's actions.
     *         The actions must be in 'kebab-case'
     * @access protected
     */
    // protected $allowAnonymous = ['index', 'do-something'];

    // Public Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public function init()
    {
        // All section actions require an admin
        $this->requireAdmin();
    }

    /**
     * Handle a request going to our plugin's index action URL,
     *
     * @return mixed
     */
    public function actionIndex()
    {
        $variables = [];

        return $this->renderTemplate('coachmarks/_index', $variables);
    }

    /**
     * Handle a request going to our plugin's index action URL,
     *
     * @return mixed
     */
    public function actionNew()
    {
        $coachmark = new CoachmarkElement();

        $variables = [
            'coachmark' => $coachmark
        ];

        return $this->renderTemplate('coachmarks/_edit', $variables);
    }

    /**
     * Handle a request going to our plugin's index action URL,
     *
     * @return mixed
     */
    public function actionEdit(int $id)
    {
        $coachmark = CoachmarkElement::find()
            ->id($id)
            ->one();
        $coachmark->steps = Json::decode($coachmark->steps);

        $variables = [
            'coachmark' => $coachmark
        ];

        return $this->renderTemplate('coachmarks/_edit', $variables);
    }

    /**
     * Handle a request going to our plugin's index action URL,
     *
     * @return mixed
     */
    public function actionSave()
    {
        $this->requirePostRequest();

        $coachmark = $this->_getCoachmarkModel();
        $request = Craft::$app->getRequest();

        // Populate the category with post data
        $this->_populateCoachmarkModel($coachmark);

        if (!Craft::$app->getElements()->saveElement($coachmark)) {
            if ($request->getAcceptsJson()) {
                return $this->asJson([
                    'success' => false,
                    'errors' => $coachmark->getErrors(),
                ]);
            }

            Craft::$app->getSession()->setError(Craft::t('app', 'Couldn’t save coachmark.'));

            // Send the coachmark back to the template
            Craft::$app->getUrlManager()->setRouteParams([
                'coachmark' => $coachmark
            ]);

            return null;
        }

        if ($request->getAcceptsJson()) {
            return $this->asJson([
                'success' => true,
                'id' => $coachmark->id,
                'title' => $coachmark->title,
                'context' => $coachmark->context,
                'status' => $coachmark->getStatus(),
                'cpEditUrl' => $coachmark->getCpEditUrl()
            ]);
        }

        Craft::$app->getSession()->setNotice(Craft::t('app', 'coachmark saved.'));

        return $this->redirectToPostedUrl($coachmark);
    }

    /**
     * 
     */
    private function _getCoachmarkModel(): CoachmarkElement
    {
        $request = Craft::$app->getRequest();

        $coachmarkId = $request->getBodyParam('coachmarkId');
        $siteId = $request->getBodyParam('siteId');

        if ($coachmarkId) {
            $coachmark = CoachmarkElement::find($coachmarkId)->one();

            if (!$coachmark) {
                throw new NotFoundHttpException('Coachmark not found');
            }
        } else {
            $coachmark = new CoachmarkElement();
            $coachmark->siteId = $siteId;
        }

        return $coachmark;
    }

    /**
     * 
     */
    private function _populateCoachmarkModel(CoachmarkElement $coachmark)
    {
        $request = Craft::$app->getRequest();

        $coachmark->title = $request->getBodyParam('title', $coachmark->title);
        $coachmark->context = $request->getBodyParam('context', $coachmark->context);
        
        if ($steps = $request->getBodyParam('steps')) {
            $coachmark->steps = Json::encode($steps);
        }
    }
}
