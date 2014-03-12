<?php
/**
 * @package ImpressPages
 *
 */

namespace Ip\Form\Validator;


class Unique extends \Ip\Form\Validator
{
    public function __construct($data, $errorMessage = null)
    {
        if (empty($data['table'])) {
            throw \Ip\Exception("Unique validator expect table name");
        }
        parent::__construct($data, $errorMessage);
    }

    public function getError($values, $valueKey, $environment)
    {
        if (empty($values[$valueKey])) {
            return false;
        }

        $table = $this->data['table'];

        $idField = empty($this->data['idField']) ? 'id' : $this->data['idField'];

        $row = ipDb()->selectRow($table, '*', array($valueKey => $values[$valueKey]));

        if (!$row) {
            return false;
        }

        if (isset($values[$idField]) && $values[$idField] == $row[$idField]) {
            return false;
        }

        if ($this->errorMessage !== null) {
            return $this->errorMessage;
        }

        if ($environment == \Ip\Form::ENVIRONMENT_ADMIN) {
            $errorText = __('The value should be unique', 'ipAdmin');
        } else {
            $errorText = __('The value should be unique', 'ipPublic');
        }

        return $errorText;
    }

}
