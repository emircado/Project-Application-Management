<?php

/**
 * This is the model class for table "application_servers".
 *
 * The followings are the available columns in table 'application_servers':
 * @property integer $application_id
 * @property integer $server_id
 * @property string $application_path
 * @property string $application_log
 * @property string $date_created
 * @property string $date_updated
 * @property string $created_by
 * @property string $updated_by
 */
class ApplicationServers extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'application_servers';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('server_id, date_created, date_updated', 'required'),
            array('server_id', 'numerical', 'integerOnly'=>true),
            array('created_by, updated_by', 'length', 'max'=>255),
            array('application_path, application_log', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('application_id, server_id, application_path, application_log, date_created, date_updated, created_by, updated_by', 'safe', 'on'=>'search'),
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
            'server' => array(self::HAS_ONE, 'Servers', array('server_id'=>'server_id')),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'application_id' => 'Application',
            'server_id' => 'Server',
            'application_path' => 'Application Path',
            'application_log' => 'Application Log',
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
        $criteria->compare('server_id',$this->server_id);
        $criteria->compare('application_path',$this->application_path,true);
        $criteria->compare('application_log',$this->application_log,true);
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
     * @return ApplicationServers the static model class
     */
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }
}