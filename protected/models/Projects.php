<?php

/**
 * This is the model class for table "projects".
 *
 * The followings are the available columns in table 'projects':
 * @property integer $project_id
 * @property string $name
 * @property string $code
 * @property string $description
 * @property string $status
 * @property string $production_date
 * @property string $termination_date
 * @property string $date_created
 * @property string $date_updated
 */
class Projects extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'projects';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('code, status, date_created, date_updated', 'required'),
            array('name', 'length', 'max'=>255),
            array('code, status', 'length', 'max'=>10),
            array('description, production_date, termination_date', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('project_id, name, code, description, status, production_date, termination_date, date_created, date_updated', 'safe', 'on'=>'search'),
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
            'project_id' => 'Project',
            'name' => 'Name',
            'code' => 'Code',
            'description' => 'Description',
            'status' => 'Status',
            'production_date' => 'Production Date',
            'termination_date' => 'Termination Date',
            'date_created' => 'Date Created',
            'date_updated' => 'Date Updated',
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

        $criteria->compare('project_id',$this->project_id);
        $criteria->compare('name',$this->name,true);
        $criteria->compare('code',$this->code,true);
        $criteria->compare('description',$this->description,true);
        $criteria->compare('status',$this->status,true);
        $criteria->compare('production_date',$this->production_date,true);
        $criteria->compare('termination_date',$this->termination_date,true);
        $criteria->compare('date_created',$this->date_created,true);
        $criteria->compare('date_updated',$this->date_updated,true);

        return new CActiveDataProvider($this, array(
            'criteria'=>$criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Projects the static model class
     */
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }
}