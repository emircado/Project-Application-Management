<?php

/**
 * LoginForm class.
 * LoginForm is the data structure for keeping
 * user login form data. It is used by the 'login' action of 'SiteController'.
 */
class LoginForm extends CFormModel
{
	public $username;
	public $password;
	public $rememberMe;

	private $_identity;

	/**
	 * Declares the validation rules.
	 * The rules state that username and password are required,
	 * and password needs to be authenticated.
	 */
	public function rules()
	{
		return array(
			// username and password are required
			array('username, password', 'required'),
			// rememberMe needs to be a boolean
			array('rememberMe', 'boolean'),
			// check username-password combination
			array('password', 'authenticate'),
		);
	}

	/**
	 * Declares attribute labels.
	 */
	public function attributeLabels()
	{
		return array(
			'rememberMe'=>'Remember me next time',
		);
	}

	/**
	 * Authenticates the password.
	 * This is the 'authenticate' validator as declared in rules().
	 */
	public function authenticate($attribute,$params)
	{
		if(!$this->hasErrors())
		{
			$this->_identity=new UserIdentity($this->username,$this->password);
			$this->_identity->authenticate();

			// if (!Yii::app()->ldap->authenticate($this->username, $this->password)) {
			// 	$this->addError('password', 'Invalid username-password combination');
			// } //else {
			// 	// $duration=$this->rememberMe ? 3600*24*30 : 0; // 30 days
			// 	// Yii::app()->user->login($this->_identity,$duration);
			// //}

			if ($this->_identity->errorCode===UserIdentity::ERROR_USERNAME_INVALID) {
				$this->addError('username','Incorrect username-password combination.');
			} else if ($this->_identity->errorCode===UserIdentity::ERROR_PASSWORD_INVALID) {
				$this->addError('username','Incorrect username-password combination.');
			} else if ($this->_identity->errorCode===UserIdentity::ERROR_LDAP_BINDING) {
				$this->addError('username','Binding unsuccessful');
			}
		}
	}

	/**
	 * Logs in the user using the given username and password in the model.
	 * @return boolean whether login is successful
	 */
	public function login()
	{
		// $duration=$this->rememberMe ? 3600*24*30 : 0; // 30 days
		// Yii::app()->user->login($this->_identity,$duration);
		// return true;
		if($this->_identity===null)
		{
			$this->_identity=new UserIdentity($this->username,$this->password);
			$this->_identity->authenticate();
			// if (!Yii::app()->ldap->authenticate($this->username, $this->password)) {
			// 	// $this->addError('password', 'Invalid username-password combination');
			// 	return false;
			// } else {
			// 	$duration=$this->rememberMe ? 3600*24*30 : 0; // 30 days
			// 	Yii::app()->user->login($this->_identity,$duration);
			// 	return true;
			// }
		}
		// return false;		
		if ($this->_identity->errorCode===UserIdentity::ERROR_NONE) {
			$duration=$this->rememberMe ? 3600*24*30 : 0; // 30 days
			Yii::app()->user->login($this->_identity,$duration);

			//SESSION HERE
			// session_start();
			$_SESSION['username'] = $this->username;//Yii::app()->getSecurityManager()->encrypt($this->username, Yii::app()->params['salt']);
			$_SESSION['password'] = $this->password;//Yii::app()->getSecurityManager()->encrypt($this->password, Yii::app()->params['salt']);

			return true;

		} else return false;
	}
}
