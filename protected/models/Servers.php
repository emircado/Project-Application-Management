<?php

/**
 * This is the model class for table "servers".
 *
 * The followings are the available columns in table 'servers':
 * @property integer $server_id
 * @property string $name
 * @property string $server_type
 * @property string $hostname
 * @property string $public_ip
 * @property string $private_ip
 * @property string $network
 * @property string $location
 * @property string $description
 * @property string $production_date
 * @property string $termination_date
 * @property string $date_created
 * @property string $date_updated
 * @property string $created_by
 * @property string $updated_by
 */
class Servers extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'servers';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('server_type, network, date_created, date_updated', 'required'),
            array('name, hostname, created_by, updated_by', 'length', 'max'=>255),
            array('server_type', 'length', 'max'=>11),
            array('public_ip, private_ip', 'length', 'max'=>20),
            array('network, location', 'length', 'max'=>50),
            array('description, production_date, termination_date', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('server_id, name, server_type, hostname, public_ip, private_ip, network, location, description, production_date, termination_date, date_created, date_updated, created_by, updated_by', 'safe', 'on'=>'search'),
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
            'server_id' => 'Server',
            'name' => 'Name',
            'server_type' => 'Server Type',
            'hostname' => 'Hostname',
            'public_ip' => 'Public Ip',
            'private_ip' => 'Private Ip',
            'network' => 'Network',
            'location' => 'Location',
            'description' => 'Description',
            'production_date' => 'Production Date',
            'termination_date' => 'Termination Date',
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

        $criteria->compare('server_id',$this->server_id);
        $criteria->compare('name',$this->name,true);
        $criteria->compare('server_type',$this->server_type,true);
        $criteria->compare('hostname',$this->hostname,true);
        $criteria->compare('public_ip',$this->public_ip,true);
        $criteria->compare('private_ip',$this->private_ip,true);
        $criteria->compare('network',$this->network,true);
        $criteria->compare('location',$this->location,true);
        $criteria->compare('description',$this->description,true);
        $criteria->compare('production_date',$this->production_date,true);
        $criteria->compare('termination_date',$this->termination_date,true);
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
     * @return Servers the static model class
     */
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }
}