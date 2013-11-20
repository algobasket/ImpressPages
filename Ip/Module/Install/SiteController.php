<?php
/**
 * @package   ImpressPages
 */

namespace Ip\Module\Install;



class SiteController extends \Ip\Controller
{
    public function step0()
    {
        $selected_language = (isset($_SESSION['installation_language']) ? $_SESSION['installation_language'] : 'en');

        $languages = array();
        $languages['cs'] = 'Čeština';
        $languages['nl'] = 'Dutch';
        $languages['en'] = 'English';
        $languages['fr'] = 'French';
        $languages['de'] = 'Deutsch';
        $languages['ja'] = '日本語';
        $languages['lt'] = 'Lietuvių';
        $languages['pt'] = 'Portugues';
        $languages['pl'] = 'Polski';
        $languages['ro'] = 'Română';

        $data['selectedLanguage'] = $selected_language;
        $data['languages'] = $languages;

        $content = \Ip\View::create('view/step0.php', $data)->render();

        return $this->applyLayout($content);
    }

    public function step1()
    {
        Model::completeStep(1);

        $content = Model::checkRequirements();


        function get_url()
        {
            $pageURL = 'http';
            if (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == "on") {
                $pageURL .= "s";
            }
            $pageURL .= "://";
            if ($_SERVER["SERVER_PORT"] != "80") {
                $pageURL .= $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $_SERVER["REQUEST_URI"];
            } else {
                $pageURL .= $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
            }

            return $pageURL;
        }

        return $this->applyLayout($content);
    }

    public function step2()
    {
        // TODOX Algimantas: what this is for?
        $license = file_get_contents(ipConfig()->baseFile('ip_license.html'));

        Model::completeStep(2);

        $content = \Ip\View::create('view/step2.php');

        return $this->applyLayout($content);
    }

    public function step3()
    {
        if (!isset($_SESSION['db'])) {
            $_SESSION['db'] = array(
                'hostname' => 'localhost',
                'username' => '',
                'password' => '',
                'database' => '',
                'charset' => 'utf8',
                'tablePrefix' => 'ip_'
            );
        }

        $data = array(
            'db' => $_SESSION['db'],
        );

        $content = \Ip\View::create('view/step3.php', $data)->render();

        $js = array(
            ipConfig()->coreModuleUrl('Install/assets/js/ModuleInstall.js'),
            ipConfig()->coreModuleUrl('Install/assets/js/step3.js')
        );

        return $this->applyLayout($content, array('requiredJs' => $js));
    }

    public function step4()
    {
        $dateTimeObject = new \DateTime();
        $currentTimeZone = $dateTimeObject->getTimezone()->getName();
        $timezoneSelectOptions = '';

        $timezones = \DateTimeZone::listIdentifiers(\DateTimeZone::ALL_WITH_BC);

        $lastGroup = '';
        foreach($timezones as $timezone) {
            $timezoneParts = explode('/', $timezone);
            $curGroup = $timezoneParts[0];
            if ($curGroup != $lastGroup) {
                if ($lastGroup != '') {
                    $timezoneSelectOptions .= '</optgroup>';
                }
                $timezoneSelectOptions .= '<optgroup label="'.addslashes($curGroup).'">';
                $lastGroup = $curGroup;
            }
            if ($timezone == $currentTimeZone) {
                $selected = 'selected';
            } else {
                $selected = '';
            }
            $timezoneSelectOptions .= '<option '.$selected.' value="'.addslashes($timezone).'">'.htmlspecialchars($timezone).'</option>';
        }

        $data = array(
            'timezoneSelectOptions' => $timezoneSelectOptions,
        );

        $content = \Ip\View::create('view/step4.php', $data)->render();

        $js = array(
            ipConfig()->coreModuleUrl('Install/assets/js/ModuleInstall.js'),
            ipConfig()->coreModuleUrl('Install/assets/js/step4.js')
        );

        return $this->applyLayout($content, array('requiredJs' => $js));
    }

    public function step5()
    {
        $SESSION['step'] = 5;
        $content = \Ip\View::create('view/step5.php')->render();
        $html = $this->applyLayout($content)->render();

        unset($_SESSION['step']);

        return $html;
    }

    public function createDatabase()
    {
        $db = ipGetRequest()->getPost('db');

        // TODOX validate $db
        foreach (array('hostname', 'username', 'password', 'database') as $key) {
            if (empty($db[$key])) {
                return \Ip\Response\JsonRpc::error(_s('Please fill in required fields.', 'ipInstall'));
            }
        }

        if (empty($db['tablePrefix'])) {
            $db['tablePrefix'] = '';
        }

        if (strlen($db['tablePrefix']) > strlen('ip_cms_')) {
            return \Ip\Response\JsonRpc::error(_s('Prefix can\'t be longer than 7 symbols.', 'ipInstall'));
        }

        if ($db['tablePrefix'] != '' && !preg_match('/^([A-Za-z_][A-Za-z0-9_]*)$/', $db['tablePrefix'])) {
            return \Ip\Response\JsonRpc::error(_s('Prefix can\'t contain any special characters and should sart with letter.', 'ipInstall'));
        }


        $dbConfig = array(
            'hostname' => $db['hostname'],
            'username' => $db['username'],
            'password' => $db['password'],
            'tablePrefix' => $db['tablePrefix'],
            'database' => '', // if database doesn't exist, we will create it
            'charset' => 'utf8',
        );

        ipConfig()->_setRaw('db', $dbConfig);

        try {
            \Ip\Db::getConnection();
        } catch (\Exception $e) {
            return \Ip\Response\JsonRpc::error(_s('Can\'t connect to database.', 'ipInstall'));
        }

        try {
            Model::createAndUseDatabase($db['database']);
        } catch (\Ip\CoreException $e) {
            return \Ip\Response\JsonRpc::error(_s('Specified database does not exists and cannot be created.', 'ipInstall'));
        }

        $errors = Model::createDatabaseStructure($db['database'], $db['tablePrefix']);

        if (!$errors) {
            $errors = Model::importData($dbConfig['tablePrefix']);
        }

        if ($errors){
            if($_SESSION['step'] < 3) {
                $_SESSION['step'] = 3;
            }
        }

        $dbConfig['database'] = $db['database'];

        $_SESSION['db'] = $dbConfig;

        if ($errors) {
            // TODOX show SQL queries that failed
            return \Ip\Response\JsonRpc::error(_s('There were errors while executing install queries.', 'ipInstall'));
        } else {
            Model::completeStep(3);
            return \Ip\Response\JsonRpc::result(true);
        }
    }

    public function writeConfig()
    {
        if (empty($_SESSION['db'])) {
            return \Ip\Response\JsonRpc::error(_s('Session has expired. Please restart your install.', 'ipInstall'));
        }

        // Validate input:
        $errors = array();

        if (!ipGetRequest()->getPost('site_name')) {
            $errors[] = _s('Please enter website name.', 'ipInstall');
        }

        if (!ipGetRequest()->getPost('site_email') || !filter_var(ipGetRequest()->getPost('site_email'), FILTER_VALIDATE_EMAIL)) {
            $errors[] = _s('Please enter correct website email.', 'ipInstall');
        }

        if (!ipGetRequest()->getPost('install_login') || !ipGetRequest()->getPost('install_pass')) {
            $errors[] = _s('Please enter administrator login and password.', 'ipInstall');
        }

        if (ipGetRequest()->getPost('timezone')) {
            $timezone = ipGetRequest()->getPost('timezone');
        } else {
            $errors[] = _s('Please choose website time zone.', 'ipInstall');
        }

        if (ipGetRequest()->getPost('email') && !filter_var(ipGetRequest()->getPost('email'), FILTER_VALIDATE_EMAIL)) {
            $errors[] = _s('Please enter correct administrator e-mail address.', 'ipInstall');
        }

        if (!empty($errors)) {
            return \Ip\Response\JsonRpc::error(_s('Please correct errors.', 'ipInstall'))->addErrorData('errors', $errors);
        }

        $config = array();
        $config['SESSION_NAME'] = 'ses' . rand();
        $config['BASE_DIR'] = ipConfig()->baseFile('');
        $config['BASE_URL'] = ipConfig()->baseUrl('');
        $config['ERRORS_SEND'] = $_POST['email'];
        $config['timezone'] = $timezone;
        $config['db'] = $_SESSION['db'];

        try {
            Model::writeConfigFile($config, ipConfig()->baseFile('ip_config.php'));
        } catch (\Exception $e) {
            return \Ip\Response\JsonRpc::error(_s('Can\'t write configuration "/ip_config.php"', 'ipInstall'));
        }

        try {
            Model::writeRobotsFile(ipConfig()->baseFile('robots.txt'));
        } catch (\Exception $e) {
            return \Ip\Response\JsonRpc::error(_s('Can\'t write "/robots.txt"', 'ipInstall'));
        }


        try {
            \Ip\Db::disconnect();
            ipConfig()->_setRaw('db', $config['db']);
            \Ip\Db::getConnection();
        } catch (\Exception $e) {
            return \Ip\Response\JsonRpc::error(_s('Can\'t connect to database.', 'ipInstall'));
        }

        try {

            Model::insertAdmin(ipGetRequest()->getPost('install_login'), ipGetRequest()->getPost('install_pass'));
            Model::setSiteName(ipGetRequest()->getPost('site_name'));
            Model::setSiteEmail(ipGetRequest()->getPost('site_email'));

        } catch (\Exception $e) {
            return \Ip\Response\JsonRpc::error(_s('Unknown SQL error.', 'ipInstall')); // ->addErrorData('sql', $sql)->addErrorData('mysqlError', \Ip\Db::getConnection()->errorInfo());
        }

        /*TODOX follow the new structure
         *             $sql = "update `".$_SESSION['db_prefix']."mc_misc_contact_form` set `email_to` = REPLACE(`email_to`, '[[[[site_email]]]]', '".ip_deprecated_mysql_real_escape_string($_POST['site_email'])."') where 1";
         $rs = ip_deprecated_mysql_query($sql);
         if(!$rs){
         $errorMessage = preg_replace("/[\n\r]/","",$sql.' '.ip_deprecated_mysql_error());
         die('{errorCode:"ERROR_QUERY", error:"'.addslashes($errorMessage).'"}');
         }*/

        Model::completeStep(4);

        return \Ip\Response\JsonRpc::result(true);
    }

    protected function applyLayout($content, $data = array())
    {
        $data['content'] = $content;
        $layout = \Ip\View::create('view/layout.php', $data);

        return $layout;
    }
}