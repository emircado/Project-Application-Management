
<?php

/**
 * This is the model class for table "application_point_persons".
 *
 * The followings are the available columns in table 'application_point_persons':
 * @property integer $application_id
 * @property string $username
 * @property string $user_group
 * @property string $description
 * @property string $date_created
 * @property string $date_updated
 * @property string $created_by
 * @property string $updated_by
 */
class ApplicationPointPersons extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'application_point_persons';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('application_id, date_created, date_updated', 'required'),
            array('application_id', 'numerical', 'integerOnly'=>true),
            array('username, description, created_by, updated_by', 'length', 'max'=>255),
            array('user_group', 'length', 'max'=>30),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('application_id, username, user_group, description, date_created, date_updated, created_by, updated_by', 'safe', 'on'=>'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations()
    {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'application_id' => 'Application',
            'username' => 'Username',
            'user_group' => 'User Group',
            'description' => 'Description',
            'date_created' => 'Date Created',
            'date_updated' => 'Date Updated',
            'created_by' => 'Created By',
            'updated_by' => 'Updated By',
        );
    }

    /**
     * Retrieves a list of models based on the current search/filter conditions.
     *
     * Typical usecase:
     * - Initialize the model fields with values from filter form.
     * - Execute this method to get CActiveDataProvider instance which will filter
     * models according to data in model fields.
     * - Pass data provider to CGridView, CListView or any similar widget.
     *
     * @return CActiveDataProvider the data provider that can return the models
     * based on the search/filter conditions.
     */
    public function search()
    {
        // @todo Please modify the following code to remove attributes that should not be searched.

        $criteria=new CDbCriteria;

        $criteria->compare('application_id',$this->application_id);
        $criteria->compare('username',$this->username,true);
        $criteria->compare('user_group',$this->user_group,true);
        $criteria->compare('description',$this->description,true);
        $criteria->compare('date_created',$this->date_created,true);
        $criteria->compare('date_updated',$this->date_updated,true);
        $criteria->compare('created_by',$this->created_by,true);
        $criteria->compare('updated_by',$this->updated_by,true);

        return new CActiveDataProvider($this, array(
            'criteria'=>$criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return ApplicationPointPersons the static model class
     */
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }
}